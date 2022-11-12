$(function() {
    function CommandCenterViewModel(parameters) {
        var self = this;

        self.loginState = parameters[0];
        self.settings = parameters[1];

        self._createToolEntry = function () {
            return {
                name: ko.observable(),
                key: ko.observable()
            }
        };

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.extrusionAmount = ko.observable(undefined);
        self.controls = ko.observableArray([]);

        self.distances = ko.observableArray([0.1, 1, 10, 100]);
        self.distance = ko.observable(10);

        self.tools = ko.observableArray([]);

        self.feedRate = ko.observable(100);
        self.flowRate = ko.observable(100);

        self.feedbackControlLookup = {};

        self.controlsFromServer = [];
        self.additionalControls = [];

        self.webcamDisableTimeout = undefined;
        self.webcamLoaded = ko.observable(false);
        self.webcamError = ko.observable(false);

        self.keycontrolActive = ko.observable(false);
        self.keycontrolHelpActive = ko.observable(false);
        self.keycontrolPossible = ko.pureComputed(function () {
            return self.settings.feature_keyboardControl() && self.isOperational() && !self.isPrinting() && self.loginState.isUser() && !$.browser.mobile;
        });
        self.showKeycontrols = ko.pureComputed(function () {
            return self.keycontrolActive() && self.keycontrolPossible();
        });

        self.webcamRatioClass = ko.pureComputed(function() {
            if (self.settings.webcam_streamRatio() == "4:3") {
                return "ratio43";
            } else {
                return "ratio169";
            }
        });

        self.settings.printerProfiles.currentProfileData.subscribe(function () {
            self._updateExtruderCount();
            self.settings.printerProfiles.currentProfileData().extruder.count.subscribe(self._updateExtruderCount);
        });
        self._updateExtruderCount = function () {
            var tools = [];

            var numExtruders = self.settings.printerProfiles.currentProfileData().extruder.count();
            if (numExtruders > 1) {
                // multiple extruders
                for (var extruder = 0; extruder < numExtruders; extruder++) {
                    tools[extruder] = self._createToolEntry();
                    tools[extruder]["name"](gettext("Tool") + " " + extruder);
                    tools[extruder]["key"]("tool" + extruder);
                }
            } else {
                // only one extruder, no need to add numbers
                tools[0] = self._createToolEntry();
                tools[0]["name"](gettext("Hotend"));
                tools[0]["key"]("tool0");
            }

            self.tools(tools);
        };

        self.fromCurrentData = function (data) {
            self._processStateData(data.state);
        };

        self.fromHistoryData = function (data) {
            self._processStateData(data.state);
        };

        self._processStateData = function (data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self.onEventSettingsUpdated = function (payload) {
            // the webcam url might have changed, make sure we replace it now if the tab is focused
            self._enableWebcam();
            self.requestData();
        };

        self.onEventRegisteredMessageReceived = function(payload) {
            if (payload.key in self.feedbackControlLookup) {
                var outputs = self.feedbackControlLookup[payload.key];
                _.each(payload.outputs, function(value, key) {
                    if (outputs.hasOwnProperty(key)) {
                        outputs[key](value);
                    }
                });
            }
        };

        self.rerenderControls = function () {
            var allControls = self.controlsFromServer.concat(self.additionalControls);
            self.controls(self._processControls(allControls))
        };

        self.requestData = function () {
            TTNovember.control.getCustomControls()
                .done(function(response) {
                    self._fromResponse(response);
                });
        };

        self._fromResponse = function (response) {
            self.controlsFromServer = response.controls;
            self.rerenderControls();
        };

        self._processControls = function (controls) {
            for (var i = 0; i < controls.length; i++) {
                controls[i] = self._processControl(controls[i]);
            }
            return controls;
        };

        self._processControl = function (control) {
            if (control.hasOwnProperty("processed") && control.processed) {
                return control;
            }

            if (control.hasOwnProperty("template") && control.hasOwnProperty("key") && control.hasOwnProperty("template_key") && !control.hasOwnProperty("output")) {
                control.output = ko.observable(control.default || "");
                if (!self.feedbackControlLookup.hasOwnProperty(control.key)) {
                    self.feedbackControlLookup[control.key] = {};
                }
                self.feedbackControlLookup[control.key][control.template_key] = control.output;
            }

            if (control.hasOwnProperty("children")) {
                control.children = ko.observableArray(self._processControls(control.children));
                if (!control.hasOwnProperty("layout") || !(control.layout == "vertical" || control.layout == "horizontal" || control.layout == "horizontal_grid")) {
                    control.layout = "vertical";
                }

                if (!control.hasOwnProperty("collapsed")) {
                    control.collapsed = false;
                }
            }

            if (control.hasOwnProperty("input")) {
                var attributeToInt = function(obj, key, def) {
                    if (obj.hasOwnProperty(key)) {
                        var val = obj[key];
                        if (_.isNumber(val)) {
                            return val;
                        }

                        var parsedVal = parseInt(val);
                        if (!isNaN(parsedVal)) {
                            return parsedVal;
                        }
                    }
                    return def;
                };

                _.each(control.input, function (element) {
                    if (element.hasOwnProperty("slider") && _.isObject(element.slider)) {
                        element.slider["min"] = attributeToInt(element.slider, "min", 0);
                        element.slider["max"] = attributeToInt(element.slider, "max", 255);

                        // try defaultValue, default to min
                        var defaultValue = attributeToInt(element, "default", element.slider.min);

                        // if default value is not within range of min and max, correct that
                        if (!_.inRange(defaultValue, element.slider.min, element.slider.max)) {
                            // use bound closer to configured default value
                            defaultValue = defaultValue < element.slider.min ? element.slider.min : element.slider.max;
                        }

                        element.value = ko.observable(defaultValue);
                    } else {
                        element.slider = false;
                        element.value = ko.observable((element.hasOwnProperty("default")) ? element["default"] : undefined);
                    }
                });
            }

            var js;
            if (control.hasOwnProperty("javascript")) {
                js = control.javascript;

                // if js is a function everything's fine already, but if it's a string we need to eval that first
                if (!_.isFunction(js)) {
                    control.javascript = function (data) {
                        eval(js);
                    };
                }
            }

            if (control.hasOwnProperty("enabled")) {
                js = control.enabled;

                // if js is a function everything's fine already, but if it's a string we need to eval that first
                if (!_.isFunction(js)) {
                    control.enabled = function (data) {
                        return eval(js);
                    }
                }
            }

            control.processed = true;
            return control;
        };

        self.isCustomEnabled = function (data) {
            if (data.hasOwnProperty("enabled")) {
                return data.enabled(data);
            } else {
                return self.isOperational() && self.loginState.isUser();
            }
        };

        self.clickCustom = function (data) {
            var callback;
            if (data.hasOwnProperty("javascript")) {
                callback = data.javascript;
            } else {
                callback = self.sendCustomCommand;
            }

            if (data.confirm) {
                showConfirmationDialog({
                    message: data.confirm,
                    onproceed: function (e) {
                        callback(data);
                    }
                });
            } else {
                callback(data);
            }
        };

        self.sendJogCommand = function (axis, multiplier, distance) {
            if (typeof distance === "undefined")
                distance = self.distance();
            if (self.settings.printerProfiles.currentProfileData() && self.settings.printerProfiles.currentProfileData()["axes"] && self.settings.printerProfiles.currentProfileData()["axes"][axis] && self.settings.printerProfiles.currentProfileData()["axes"][axis]["inverted"]()) {
                multiplier *= -1;
            }

            var data = {};
            data[axis] = distance * multiplier;
            TTNovember.printer.jog(data);
        };

        self.sendHomeCommand = function (axis) {
            TTNovember.printer.home(axis);
        };

        self.sendFeedRateCommand = function () {
            TTNovember.printer.setFeedrate(self.feedRate());
        };

        self.sendExtrudeCommand = function () {
            self._sendECommand(1);
        };

        self.sendRetractCommand = function () {
            self._sendECommand(-1);
        };

        self.sendFlowRateCommand = function () {
            TTNovember.printer.setFlowrate(self.flowRate());
        };

        self._sendECommand = function (dir) {
            var length = self.extrusionAmount() || self.settings.printer_defaultExtrusionLength();
            TTNovember.printer.extrude(length * dir);
        };

        self.sendSelectToolCommand = function (data) {
            if (!data || !data.key()) return;

            TTNovember.printer.selectTool(data.key());
        };

        self.sendCustomCommand = function (command) {
            if (!command) return;

            var parameters = {};
            if (command.hasOwnProperty("input")) {
                _.each(command.input, function (input) {
                    if (!input.hasOwnProperty("parameter") || !input.hasOwnProperty("value")) {
                        return;
                    }

                    parameters[input.parameter] = input.value();
                });
            }

            if (command.hasOwnProperty("command") || command.hasOwnProperty("commands")) {
                var commands = command.commands || [command.command];
                TTNovember.control.sendGcodeWithParameters(commands, parameters);
            } else if (command.hasOwnProperty("script")) {
                var script = command.script;
                var context = command.context || {};
                TTNovember.control.sendGcodeScriptWithParameters(script, context, parameters);
            }
        };

        self.displayMode = function (customControl) {
            if (customControl.hasOwnProperty("children")) {
                if (customControl.name) {
                    return "customControls_containerTemplate_collapsable";
                } else {
                    return "customControls_containerTemplate_nameless";
                }
            } else {
                return "customControls_controlTemplate";
            }
        };

        self.rowCss = function (customControl) {
            var span = "span2";
            var offset = "";
            if (customControl.hasOwnProperty("width")) {
                span = "span" + customControl.width;
            }
            if (customControl.hasOwnProperty("offset")) {
                offset = "offset" + customControl.offset;
            }
            return span + " " + offset;
        };

        self.onStartup = function () {
            self.requestData();
        };

        self._disableWebcam = function() {
            // only disable webcam stream if tab is out of focus for more than 5s, otherwise we might cause
            // more load by the constant connection creation than by the actual webcam stream

            // safari bug doesn't release the mjpeg stream, so we just disable this for safari.
            if (TTNovember.coreui.browser.safari) {
                return;
            }

            var timeout = self.settings.webcam_streamTimeout() || 5;
            self.webcamDisableTimeout = setTimeout(function () {
                log.debug("Unloading webcam stream");
                $("#webcam_image").attr("src", "");
                self.webcamLoaded(false);
            }, timeout * 1000);
        };

        self._enableWebcam = function() {
            if (TTNovember.coreui.selectedTab != "#commandcenter" || !TTNovember.coreui.browserTabVisible) {
                return;
            }

            if (self.webcamDisableTimeout != undefined) {
                clearTimeout(self.webcamDisableTimeout);
            }
            var webcamImage = $("#webcam_image");
            var currentSrc = webcamImage.attr("src");

            // safari bug doesn't release the mjpeg stream, so we just set it up the once
            if (TTNovember.coreui.browser.safari && currentSrc != undefined) {
                return;
            }

            var newSrc = self.settings.webcam_streamUrl();
            if (currentSrc != newSrc) {
                if (newSrc.lastIndexOf("?") > -1) {
                    newSrc += "&";
                } else {
                    newSrc += "?";
                }
                newSrc += new Date().getTime();

                self.webcamLoaded(false);
                self.webcamError(false);
                webcamImage.attr("src", newSrc);
            }
        };

        self.onWebcamLoaded = function() {
            log.debug("Webcam stream loaded");
            self.webcamLoaded(true);
            self.webcamError(false);
        };

        self.onWebcamErrored = function() {
            log.debug("Webcam stream failed to load/disabled");
            self.webcamLoaded(false);
            self.webcamError(true);
        };

        self.onTabChange = function (current, previous) {
            if (current == "#commandcenter") {
                self._enableWebcam();
            } else if (previous == "#commandcenter") {
                self._disableWebcam();
            }
        };

        self.onBrowserTabVisibilityChange = function(status) {
            if (status) {
                self._enableWebcam();
            } else {
                self._disableWebcam();
            }
        };

        self.onAllBound = function (allViewModels) {
            var additionalControls = [];
            callViewModels(allViewModels, "getAdditionalControls", function(method) {
                additionalControls = additionalControls.concat(method());
            });
            if (additionalControls.length > 0) {
                self.additionalControls = additionalControls;
                self.rerenderControls();
            }
            self._enableWebcam();
        };

        self.onFocus = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            self.keycontrolActive(true);
        };

        self.onMouseOver = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            $("#webcam_container").focus();
            self.keycontrolActive(true);
        };

        self.onMouseOut = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;
            $("#webcam_container").blur();
            self.keycontrolActive(false);
        };

        self.toggleKeycontrolHelp = function () {
            self.keycontrolHelpActive(!self.keycontrolHelpActive());
        };

        self.onKeyDown = function (data, event) {
            if (!self.settings.feature_keyboardControl()) return;

            var button = undefined;
            var visualizeClick = true;

            switch (event.which) {
                case 37: // left arrow key
                    // X-
                    button = $("#control-xdec");
                    break;
                case 38: // up arrow key
                    // Y+
                    button = $("#control-yinc");
                    break;
                case 39: // right arrow key
                    // X+
                    button = $("#control-xinc");
                    break;
                case 40: // down arrow key
                    // Y-
                    button = $("#control-ydec");
                    break;
                case 49: // number 1
                case 97: // numpad 1
                    // Distance 0.1
                    button = $("#control-distance01");
                    visualizeClick = false;
                    break;
                case 50: // number 2
                case 98: // numpad 2
                    // Distance 1
                    button = $("#control-distance1");
                    visualizeClick = false;
                    break;
                case 51: // number 3
                case 99: // numpad 3
                    // Distance 10
                    button = $("#control-distance10");
                    visualizeClick = false;
                    break;
                case 52: // number 4
                case 100: // numpad 4
                    // Distance 100
                    button = $("#control-distance100");
                    visualizeClick = false;
                    break;
                case 33: // page up key
                case 87: // w key
                    // z lift up
                    button = $("#control-zinc");
                    break;
                case 34: // page down key
                case 83: // s key
                    // z lift down
                    button = $("#control-zdec");
                    break;
                case 36: // home key
                    // xy home
                    button = $("#control-xyhome");
                    break;
                case 35: // end key
                    // z home
                    button = $("#control-zhome");
                    break;
                default:
                    event.preventDefault();
                    return false;
            }

            if (button === undefined) {
                return false;
            } else {
                event.preventDefault();
                if (visualizeClick) {
                    button.addClass("active");
                    setTimeout(function () {
                        button.removeClass("active");
                    }, 150);
                }
                button.click();
            }
        };

        self.stripDistanceDecimal = function(distance) {
            return distance.toString().replace(".", "");
        };

        //terminal


        self.tabActive = false;

        self.log = ko.observableArray([]);
        self.log.extend({ throttle: 500 });
        self.plainLogLines = ko.observableArray([]);
        self.plainLogLines.extend({ throttle: 500 });

        self.buffer = ko.observable(300);
        self.upperLimit = ko.observable(1499);

        self.command = ko.observable(undefined);

        self.isErrorOrClosed = ko.observable(undefined);
        self.isOperational = ko.observable(undefined);
        self.isPrinting = ko.observable(undefined);
        self.isPaused = ko.observable(undefined);
        self.isError = ko.observable(undefined);
        self.isReady = ko.observable(undefined);
        self.isLoading = ko.observable(undefined);

        self.autoscrollEnabled = ko.observable(true);

        self.filters = self.settings.terminalFilters;
        self.filterRegex = ko.observable();

        self.cmdHistory = [];
        self.cmdHistoryIdx = -1;

        self.enableFancyFunctionality = ko.observable(true);
        self.disableTerminalLogDuringPrinting = ko.observable(false);

        self.acceptableFancyTime = 500;
        self.acceptableUnfancyTime = 300;
        self.reenableTimeout = 5000;

        self.forceFancyFunctionality = ko.observable(false);
        self.forceTerminalLogDuringPrinting = ko.observable(false);

        self.fancyFunctionality = ko.pureComputed(function() {
            return self.enableFancyFunctionality() || self.forceFancyFunctionality();
        });
        self.terminalLogDuringPrinting = ko.pureComputed(function() {
            return !self.disableTerminalLogDuringPrinting() || self.forceTerminalLogDuringPrinting();
        });

        self.displayedLines = ko.pureComputed(function() {
            if (!self.enableFancyFunctionality()) {
                return self.log();
            }

            var regex = self.filterRegex();
            var lineVisible = function(entry) {
                return regex == undefined || !entry.line.match(regex);
            };

            var filtered = false;
            var result = [];
            var lines = self.log();
            _.each(lines, function(entry) {
                if (lineVisible(entry)) {
                    result.push(entry);
                    filtered = false;
                } else if (!filtered) {
                    result.push(self._toInternalFormat("[...]", "filtered"));
                    filtered = true;
                }
            });

            return result;
        });

        self.plainLogOutput = ko.pureComputed(function() {
            if (self.fancyFunctionality()) {
                return;
            }
            return self.plainLogLines().join("\n");
        });

        self.lineCount = ko.pureComputed(function() {
            if (!self.fancyFunctionality()) {
                return;
            }

            var regex = self.filterRegex();
            var lineVisible = function(entry) {
                return regex == undefined || !entry.line.match(regex);
            };

            var lines = self.log();
            var total = lines.length;
            var displayed = _.filter(lines, lineVisible).length;
            var filtered = total - displayed;

            if (filtered > 0) {
                if (total > self.upperLimit()) {
                    return _.sprintf(gettext("showing %(displayed)d lines (%(filtered)d of %(total)d total lines filtered, buffer full)"), {displayed: displayed, total: total, filtered: filtered});
                } else {
                    return _.sprintf(gettext("showing %(displayed)d lines (%(filtered)d of %(total)d total lines filtered)"), {displayed: displayed, total: total, filtered: filtered});
                }
            } else {
                if (total > self.upperLimit()) {
                    return _.sprintf(gettext("showing %(displayed)d lines (buffer full)"), {displayed: displayed});
                } else {
                    return _.sprintf(gettext("showing %(displayed)d lines"), {displayed: displayed});
                }
            }
        });

        self.autoscrollEnabled.subscribe(function(newValue) {
            if (newValue) {
                self.log(self.log.slice(-self.buffer()));
            }
        });

        self.activeFilters = ko.observableArray([]);
        self.activeFilters.subscribe(function(e) {
            self.updateFilterRegex();
        });

        self._reenableFancyTimer = undefined;
        self._reenableUnfancyTimer = undefined;
        self._disableFancy = function(difference) {
            log.warn("Terminal: Detected slow client (needed " + difference + "ms for processing new log data), disabling fancy terminal functionality");
            if (self._reenableFancyTimer) {
                window.clearTimeout(self._reenableFancyTimer);
                self._reenableFancyTimer = undefined;
            }
            self.enableFancyFunctionality(false);
        };
        self._reenableFancy = function(difference) {
            if (self._reenableFancyTimer) return;
            self._reenableFancyTimer = window.setTimeout(function() {
                log.info("Terminal: Client speed recovered, enabling fancy terminal functionality");
                self.enableFancyFunctionality(true);
            }, self.reenableTimeout);
        };
        self._disableUnfancy = function(difference) {
            log.warn("Terminal: Detected very slow client (needed " + difference + "ms for processing new log data), completely disabling terminal output during printing");
            if (self._reenableUnfancyTimer) {
                window.clearTimeout(self._reenableUnfancyTimer);
                self._reenableUnfancyTimer = undefined;
            }
            self.disableTerminalLogDuringPrinting(true);
        };
        self._reenableUnfancy = function() {
            if (self._reenableUnfancyTimer) return;
            self._reenableUnfancyTimer = window.setTimeout(function() {
                log.info("Terminal: Client speed recovered, enabling terminal output during printing");
                self.disableTerminalLogDuringPrinting(false);
            }, self.reenableTimeout);
        };

        self.fromCurrentData = function(data) {
            self._processStateData(data.state);

            var start = new Date().getTime();
            self._processCurrentLogData(data.logs);
            var end = new Date().getTime();
            var difference = end - start;

            if (self.enableFancyFunctionality()) {
                // fancy enabled -> check if we need to disable fancy
                if (difference >= self.acceptableFancyTime) {
                    self._disableFancy(difference);
                }
            } else if (!self.disableTerminalLogDuringPrinting()) {
                // fancy disabled, unfancy not -> check if we need to disable unfancy or re-enable fancy
                if (difference >= self.acceptableUnfancyTime) {
                    self._disableUnfancy(difference);
                } else if (difference < self.acceptableFancyTime / 2.0) {
                    self._reenableFancy(difference);
                }
            } else {
                // fancy & unfancy disabled -> check if we need to re-enable unfancy
                if (difference < self.acceptableUnfancyTime / 2.0) {
                    self._reenableUnfancy(difference);
                }
            }
        };

        self.fromHistoryData = function(data) {
            self._processStateData(data.state);
            self._processHistoryLogData(data.logs);
        };

        self._processCurrentLogData = function(data) {
            var length = self.log().length;
            if (length >= self.upperLimit()) {
                return;
            }

            if (!self.terminalLogDuringPrinting() && self.isPrinting()) {
                var last = self.plainLogLines()[self.plainLogLines().length - 1];
                var disabled = "--- client too slow, log output disabled while printing ---";
                if (last != disabled) {
                    self.plainLogLines.push(disabled);
                }
                return;
            }

            var newData = (data.length + length > self.upperLimit())
                ? data.slice(0, self.upperLimit() - length)
                : data;
            if (!newData) {
                return;
            }

            if (!self.fancyFunctionality()) {
                // lite version of the terminal - text output only
                self.plainLogLines(self.plainLogLines().concat(newData).slice(-self.buffer()));
                self.updateOutput();
                return;
            }

            var newLog = self.log().concat(_.map(newData, function(line) { return self._toInternalFormat(line) }));
            if (newData.length != data.length) {
                var cutoff = "--- too many lines to buffer, cut off ---";
                newLog.push(self._toInternalFormat(cutoff, "cut"));
            }

            if (self.autoscrollEnabled()) {
                // we only keep the last <buffer> entries
                newLog = newLog.slice(-self.buffer());
            }
            self.log(newLog);
            self.updateOutput();
        };

        self._processHistoryLogData = function(data) {
            self.plainLogLines(data);
            self.log(_.map(data, function(line) { return self._toInternalFormat(line) }));
            self.updateOutput();
        };

        self._toInternalFormat = function(line, type) {
            if (type == undefined) {
                type = "line";
            }
            return {line: escapeUnprintableCharacters(line), type: type}
        };

        self._processStateData = function(data) {
            self.isErrorOrClosed(data.flags.closedOrError);
            self.isOperational(data.flags.operational);
            self.isPaused(data.flags.paused);
            self.isPrinting(data.flags.printing);
            self.isError(data.flags.error);
            self.isReady(data.flags.ready);
            self.isLoading(data.flags.loading);
        };

        self.updateFilterRegex = function() {
            var filterRegexStr = self.activeFilters().join("|").trim();
            if (filterRegexStr == "") {
                self.filterRegex(undefined);
            } else {
                self.filterRegex(new RegExp(filterRegexStr));
            }
            self.updateOutput();
        };

        self.updateOutput = function() {
            if (self.tabActive && TTNovember.coreui.browserTabVisible && self.autoscrollEnabled()) {
                self.scrollToEnd();
            }
        };

        self.gotoTerminalCommand = function() {
            // skip if user highlights text.
            var sel = getSelection().toString();
            if (sel) {
                return;
            }

            $("#terminal-command").focus();
        };

        self.toggleAutoscroll = function() {
            self.autoscrollEnabled(!self.autoscrollEnabled());
        };

        self.selectAll = function() {
            var container = self.fancyFunctionality() ? $("#terminal-output") : $("#terminal-output-lowfi");
            if (container.length) {
                container.selectText();
            }
        };

        self.scrollToEnd = function() {
            var container = self.fancyFunctionality() ? $("#terminal-output") : $("#terminal-output-lowfi");
            if (container.length) {
                container.scrollTop(container[0].scrollHeight);
            }
        };

        self.sendCommand = function() {
            var command = self.command();
            if (!command) {
                return;
            }

            var re = /^([gmt][0-9]+)(\s.*)?/;
            var commandMatch = command.match(re);
            if (commandMatch != null) {
                command = commandMatch[1].toUpperCase() + ((commandMatch[2] !== undefined) ? commandMatch[2] : "");
            }

            if (command) {
                TTNovember.control.sendGcode(command)
                    .done(function() {
                        self.cmdHistory.push(command);
                        self.cmdHistory.slice(-300); // just to set a sane limit to how many manually entered commands will be saved...
                        self.cmdHistoryIdx = self.cmdHistory.length;
                        self.command("");
                    });
            }
        };

        self.fakeAck = function() {
            TTNovember.connection.fakeAck();
        };

        self.handleKeyDown = function(event) {
            var keyCode = event.keyCode;

            if (keyCode == 38 || keyCode == 40) {
                if (keyCode == 38 && self.cmdHistory.length > 0 && self.cmdHistoryIdx > 0) {
                    self.cmdHistoryIdx--;
                } else if (keyCode == 40 && self.cmdHistoryIdx < self.cmdHistory.length - 1) {
                    self.cmdHistoryIdx++;
                }

                if (self.cmdHistoryIdx >= 0 && self.cmdHistoryIdx < self.cmdHistory.length) {
                    self.command(self.cmdHistory[self.cmdHistoryIdx]);
                }

                // prevent the cursor from being moved to the beginning of the input field (this is actually the reason
                // why we do the arrow key handling in the keydown event handler, keyup would be too late already to
                // prevent this from happening, causing a jumpy cursor)
                return false;
            }

            // do not prevent default action
            return true;
        };

        self.handleKeyUp = function(event) {
            if (event.keyCode == 13) {
                self.sendCommand();
            }

            // do not prevent default action
            return true;
        };

        self.onAfterTabChange = function(current, previous) {
            self.tabActive = current == "#term";
            self.updateOutput();
        };
    }

    OCTOPRINT_VIEWMODELS.push([
        CommandCenterViewModel,
        ["loginStateViewModel", "settingsViewModel"],
        "#commandcenter"
    ]);
});
