(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/job";

    var TTNovemberJobClient = function(base) {
        this.base = base;
    };

    TTNovemberJobClient.prototype.issueCommand = function(command, payload, opts) {
        if (arguments.length == 2) {
            opts = payload;
            payload = {};
        }

        return this.base.issueCommand(url, command, payload, opts);
    };

    TTNovemberJobClient.prototype.get = function(opts) {
        return TTNovember.get(url, opts);
    };

    TTNovemberJobClient.prototype.start = function(opts) {
        return this.issueCommand("start", opts);
    };

    TTNovemberJobClient.prototype.restart = function(opts) {
        return this.issueCommand("restart", opts);
    };

    TTNovemberJobClient.prototype.pause = function(opts) {
        return this.issueCommand("pause", {"action": "pause"}, opts);
    };

    TTNovemberJobClient.prototype.resume = function(opts) {
        return this.issueCommand("pause", {"action": "resume"}, opts)
    };

    TTNovemberJobClient.prototype.togglePause = function(opts) {
        return this.issueCommand("pause", {"action": "toggle"}, opts);
    };

    TTNovemberJobClient.prototype.cancel = function(opts) {
        return this.issueCommand("cancel", opts);
    };

    TTNovemberClient.registerComponent("job", TTNovemberJobClient);
    return TTNovemberJobClient;
});
