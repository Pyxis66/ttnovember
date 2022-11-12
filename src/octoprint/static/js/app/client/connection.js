(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/connection";

    var TTNovemberConnectionClient = function(base) {
        this.base = base;
    };

    TTNovemberConnectionClient.prototype.getSettings = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberConnectionClient.prototype.connect = function(data, opts) {
        return this.base.issueCommand(url, "connect", data || {}, opts);
    };

    TTNovemberConnectionClient.prototype.disconnect = function(opts) {
        return this.base.issueCommand(url, "disconnect", {}, opts);
    };

    TTNovemberConnectionClient.prototype.fakeAck = function(opts) {
        return this.base.issueCommand(url, "fake_ack", {}, opts);
    };

    TTNovemberClient.registerComponent("connection", TTNovemberConnectionClient);
    return TTNovemberConnectionClient;
});
