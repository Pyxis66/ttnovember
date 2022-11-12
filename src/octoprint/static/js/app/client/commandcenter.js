(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var customUrl = "api/printer/command/custom";
    var commandUrl = "api/printer/command";

    var TTNovemberCommandCenterClient = function(base) {
        this.base = base;
    };

    TTNovemberCommandCenterClient.prototype.getCustomControls = function (opts) {
        return this.base.get(customUrl, opts);
    };

    TTNovemberCommandCenterClient.prototype.sendGcodeWithParameters = function(commands, parameters, opts) {
        commands = commands || [];
        parameters = parameters || {};

        if (typeof commands === "string") {
            commands = [commands];
        }

        return this.base.postJson(commandUrl, {
            commands: commands,
            parameters: parameters
        }, opts);
    };

    TTNovemberCommandCenterClient.prototype.sendGcodeScriptWithParameters = function(script, context, parameters, opts) {
        script = script || "";
        context = context || {};
        parameters = parameters || {};

        return this.base.postJson(commandUrl, {
            script: script,
            context: context,
            parameters: parameters
        }, opts);
    };

    TTNovemberCommandCenterClient.prototype.sendGcode = function (commands, opts) {
        return this.sendGcodeWithParameters(commands, undefined, opts);
    };

    TTNovemberCommandCenterClient.prototype.sendGcodeScript = function (script, context, opts) {
        return this.sendGcodeScriptWithParameters(script, context, undefined, opts);
    };

    TTNovemberClient.registerComponent("commandcenter", TTNovemberCommandCenterClient);
    return TTNovemberCommandCenterClient;
});
