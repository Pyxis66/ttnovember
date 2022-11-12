(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var customUrl = "api/printer/command/custom";
    var commandUrl = "api/printer/command";

    var TTNovemberControlClient = function(base) {
        this.base = base;
    };

    TTNovemberControlClient.prototype.getCustomControls = function (opts) {
        return this.base.get(customUrl, opts);
    };

    TTNovemberControlClient.prototype.sendGcodeWithParameters = function(commands, parameters, opts) {
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

    TTNovemberControlClient.prototype.sendGcodeScriptWithParameters = function(script, context, parameters, opts) {
        script = script || "";
        context = context || {};
        parameters = parameters || {};

        return this.base.postJson(commandUrl, {
            script: script,
            context: context,
            parameters: parameters
        }, opts);
    };

    TTNovemberControlClient.prototype.sendGcode = function (commands, opts) {
        return this.sendGcodeWithParameters(commands, undefined, opts);
    };

    TTNovemberControlClient.prototype.sendGcodeScript = function (script, context, opts) {
        return this.sendGcodeScriptWithParameters(script, context, undefined, opts);
    };

    TTNovemberClient.registerComponent("control", TTNovemberControlClient);
    return TTNovemberControlClient;
});
