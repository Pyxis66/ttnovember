(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/system";
    var commandUrl = "api/system/commands";

    var TTNovemberSystemClient = function(base) {
        this.base = base;
    };

    TTNovemberSystemClient.prototype.getCommands = function (opts) {
        return this.base.get(commandUrl, opts);
    };

    TTNovemberSystemClient.prototype.getCommandsForSource = function (source, opts) {
        return this.base.get(commandUrl + "/" + source, opts);
    };

    TTNovemberSystemClient.prototype.executeCommand = function (source, action, opts) {
        return this.base.postJson(commandUrl + "/" + source + "/" + action, {}, opts);
    };

    TTNovemberClient.registerComponent("system", TTNovemberSystemClient);
    return TTNovemberSystemClient;
});
