(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient", "jquery", "lodash", "sockjs"], factory);
    } else {
        factory(global.TTNovemberClient, global.$, global._, global.SockJS);
    }
})(this, function(TTNovemberClient, $, _, SockJS) {

    var normalClose = 1000;

    var TTNovemberSocketClient = function(base) {
        this.base = base;

        this.options = {
            timeouts: [0, 1, 1, 2, 3, 5, 8, 13, 20, 40, 100],
            rateSlidingWindowSize: 20
        };

        this.socket = undefined;
        this.reconnecting = false;
        this.reconnectTrial = 0;
        this.registeredHandlers = {};

        this.rateThrottleFactor = 1;
        this.rateBase = 500;
        this.rateLastMeasurements = [];
    };

    TTNovemberSocketClient.prototype.propagateMessage = function(event, data) {
        var start = new Date().getTime();

        var eventObj = {event: event, data: data};

        var catchAllHandlers = this.registeredHandlers["*"];
        if (catchAllHandlers && catchAllHandlers.length) {
            _.each(catchAllHandlers, function(handler) {
                handler(eventObj);
            });
        }

        var handlers = this.registeredHandlers[event];
        if (handlers && handlers.length) {
            _.each(handlers, function(handler) {
                handler(eventObj);
            });
        }

        var end = new Date().getTime();
        this.analyzeTiming(end - start);
    };

    TTNovemberSocketClient.prototype.analyzeTiming = function(measurement) {
        while (this.rateLastMeasurements.length >= this.options.rateSlidingWindowSize) {
            this.rateLastMeasurements.shift();
        }
        this.rateLastMeasurements.push(measurement);

        var processingLimit = this.rateThrottleFactor * this.rateBase;
        if (measurement > processingLimit) {
            this.onRateTooHigh(measurement, processingLimit);
        } else if (this.rateThrottleFactor > 1) {
            var maxProcessingTime = Math.max.apply(null, this.rateLastMeasurements);
            var lowerProcessingLimit = (this.rateThrottleFactor - 1) * this.rateBase;
            if (maxProcessingTime < lowerProcessingLimit) {
                this.onRateTooLow(maxProcessingTime, lowerProcessingLimit);
            }
        }
    };

    TTNovemberSocketClient.prototype.increaseRate = function() {
        if (this.rateThrottleFactor <= 1) {
            this.rateThrottleFactor = 1;
            return;
        }
        this.rateThrottleFactor--;
        this.sendThrottleFactor();
    };

    TTNovemberSocketClient.prototype.decreaseRate = function() {
        this.rateThrottleFactor++;
        this.sendThrottleFactor();
    };

    TTNovemberSocketClient.prototype.sendThrottleFactor = function() {
        this.sendMessage("throttle", this.rateThrottleFactor);
    };

    TTNovemberSocketClient.prototype.sendMessage = function(type, payload) {
        var data = {};
        data[type] = payload;
        this.socket.send(JSON.stringify(data));
    };

    TTNovemberSocketClient.prototype.connect = function(opts) {
        opts = opts || {};

        this.disconnect();

        var url = this.base.options.baseurl;
        if (!_.endsWith(url, "/")) {
            url += "/";
        }

        var self = this;

        var onOpen = function() {
            self.reconnecting = false;
            self.reconnectTrial = 0;
            self.onConnected();
        };

        var onClose = function(e) {
            if (e.code == normalClose) {
                return;
            }

            if (self.onReconnectAttempt(self.reconnectTrial)) {
                return;
            }

            self.onDisconnected(e.code);

            if (self.reconnectTrial < self.options.timeouts.length) {
                var timeout = self.options.timeouts[self.reconnectTrial];
                setTimeout(function() { self.reconnect() }, timeout * 1000);
                self.reconnectTrial++;
            } else {
                self.onReconnectFailed();
            }
        };

        var onMessage = function(msg) {
            _.each(msg.data, function(data, key) {
                self.propagateMessage(key, data);
            });
        };

        this.socket = new SockJS(url + "sockjs", undefined, opts);
        this.socket.onopen = onOpen;
        this.socket.onclose = onClose;
        this.socket.onmessage = onMessage;
    };

    TTNovemberSocketClient.prototype.reconnect = function() {
        this.disconnect();
        this.socket = undefined;
        this.connect();
    };

    TTNovemberSocketClient.prototype.disconnect = function() {
        if (this.socket != undefined) {
            this.socket.close();
        }
    };

    TTNovemberSocketClient.prototype.onMessage = function(message, handler) {
        if (!this.registeredHandlers.hasOwnProperty(message)) {
            this.registeredHandlers[message] = [];
        }
        this.registeredHandlers[message].push(handler);
        return this;
    };

    TTNovemberSocketClient.prototype.onReconnectAttempt = function(trial) {};
    TTNovemberSocketClient.prototype.onReconnectFailed = function() {};
    TTNovemberSocketClient.prototype.onConnected = function() {};
    TTNovemberSocketClient.prototype.onDisconnected = function(code) {};

    TTNovemberSocketClient.prototype.onRateTooLow = function(measured, minimum) {
        this.increaseRate();
    };
    TTNovemberSocketClient.prototype.onRateTooHigh = function(measured, maximum) {
        this.decreaseRate();
    };

    TTNovemberClient.registerComponent("socket", TTNovemberSocketClient);
    return TTNovemberSocketClient;
});
