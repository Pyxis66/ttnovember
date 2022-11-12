(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/printer";
    var printheadUrl = url + "/printhead";
    var toolUrl = url + "/tool";
    var bedUrl = url + "/bed";
    var sdUrl = url + "/sd";

    var TTNovemberPrinterClient = function(base) {
        this.base = base;
    };

    TTNovemberPrinterClient.prototype.issuePrintheadCommand = function (command, payload, opts) {
        return this.base.issueCommand(printheadUrl, command, payload, opts);
    };

    TTNovemberPrinterClient.prototype.issueToolCommand = function (command, payload, opts) {
        return this.base.issueCommand(toolUrl, command, payload, opts);
    };

    TTNovemberPrinterClient.prototype.issueBedCommand = function (command, payload, opts) {
        return this.base.issueCommand(bedUrl, command, payload, opts);
    };

    TTNovemberPrinterClient.prototype.issueSdCommand = function (command, payload, opts) {
        return this.base.issueCommand(sdUrl, command, payload, opts);
    };

    TTNovemberPrinterClient.prototype.getFullState = function (flags, opts) {
        flags = flags || {};

        var history = flags.history || undefined;
        var limit = flags.limit || undefined;
        var exclude = flags.exclude || undefined;

        var getUrl = url;
        if (history || exclude) {
            getUrl += "?";
            if (history) {
                getUrl += "history=true&";
                if (limit) {
                    getUrl += "limit=" + limit + "&";
                }
            }

            if (exclude) {
                getUrl += "exclude=" + exclude.join(",") + "&";
            }
        }

        return this.base.get(getUrl, opts);
    };

    TTNovemberPrinterClient.prototype.getToolState = function (flags, opts) {
        flags = flags || {};

        var history = flags.history || undefined;
        var limit = flags.limit || undefined;

        var getUrl = toolUrl;
        if (history) {
            getUrl += "?history=true";
            if (limit) {
                getUrl += "&limit=" + limit;
            }
        }

        return this.base.get(getUrl, opts);
    };

    TTNovemberPrinterClient.prototype.getBedState = function (flags, opts) {
        flags = flags || {};

        var history = flags.history || undefined;
        var limit = flags.limit || undefined;

        var getUrl = bedUrl;
        if (history) {
            getUrl += "?history=true";
            if (limit) {
                getUrl += "&limit=" + limit;
            }
        }

        return this.base.get(getUrl, opts);
    };

    TTNovemberPrinterClient.prototype.getSdState = function (opts) {
        return this.base.get(sdUrl, opts);
    };

    TTNovemberPrinterClient.prototype.jog = function (params, opts) {
        params = params || {};

        var absolute = params.absolute || false;

        var payload = {absolute: absolute};
        if (params.x) payload.x = params.x;
        if (params.y) payload.y = params.y;
        if (params.z) payload.z = params.z;
        if (params.speed !== undefined) payload.speed = params.speed;

        return this.issuePrintheadCommand("jog", payload, opts);
    };

    TTNovemberPrinterClient.prototype.home = function (axes, opts) {
        axes = axes || [];

        var payload = {
            axes: axes
        };

        return this.issuePrintheadCommand("home", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setFeedrate = function (factor, opts) {
        factor = factor || 100;

        var payload = {
            factor: factor
        };

        return this.issuePrintheadCommand("feedrate", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setToolTargetTemperatures = function (targets, opts) {
        targets = targets || {};

        var payload = {
            targets: targets
        };

        return this.issueToolCommand("target", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setToolTemperatureOffsets = function (offsets, opts) {
        offsets = offsets || {};

        var payload = {
            offsets: offsets
        };

        return this.issueToolCommand("offset", payload, opts);
    };

    TTNovemberPrinterClient.prototype.selectTool = function (tool, opts) {
        tool = tool || undefined;

        var payload = {
            tool: tool
        };

        return this.issueToolCommand("select", payload, opts);
    };

    TTNovemberPrinterClient.prototype.extrude = function (amount, opts) {
        amount = amount || undefined;

        var payload = {
            amount: amount
        };

        return this.issueToolCommand("extrude", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setFlowrate = function (factor, opts) {
        factor = factor || 100;

        var payload = {
            factor: factor
        };

        return this.issueToolCommand("flowrate", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setBedTargetTemperature = function (target, opts) {
        target = target || 0;

        var payload = {
            target: target
        };

        return this.issueBedCommand("target", payload, opts);
    };

    TTNovemberPrinterClient.prototype.setBedTemperatureOffset = function (offset, opts) {
        offset = offset || 0;

        var payload = {
            offset: offset
        };

        return this.issueBedCommand("offset", payload, opts);
    };

    TTNovemberPrinterClient.prototype.initSd = function (opts) {
        return this.issueSdCommand("init", {}, opts);
    };

    TTNovemberPrinterClient.prototype.refreshSd = function (opts) {
        return this.issueSdCommand("refresh", {}, opts);
    };

    TTNovemberPrinterClient.prototype.releaseSd = function (opts) {
        return this.issueSdCommand("release", {}, opts);
    };

    TTNovemberClient.registerComponent("printer", TTNovemberPrinterClient);
    return TTNovemberPrinterClient;
});
