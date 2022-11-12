(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient", "jquery"], factory);
    } else {
        factory(global.TTNovemberClient, global.$);
    }
})(this, function(TTNovemberClient, $) {
    var url = "api/settings";
    var apiKeyUrl = url + "/apikey";

    var TTNovemberSettingsClient = function(base) {
        this.base = base;
    };

    TTNovemberSettingsClient.prototype.get = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberSettingsClient.prototype.save = function(settings, opts) {
        settings = settings || {};
        return this.base.postJson(url, settings, opts);
    };

    TTNovemberSettingsClient.prototype.getPluginSettings = function (plugin, opts) {
        return this.get(opts)
            .then(function (settings, statusText, request) {
                if (!settings.plugins || !settings.plugins[plugin]) {
                    return $.Deferred()
                        .reject(request, "dataerror", "No settings for plugin " + plugin)
                        .promise();
                } else {
                    return settings.plugins[plugin];
                }
            });
    };

    TTNovemberSettingsClient.prototype.savePluginSettings = function (plugin, settings, opts) {
        var data = {};
        data["plugins"] = {};
        data["plugins"][plugin] = settings;
        return this.save(data, opts);
    };

    TTNovemberSettingsClient.prototype.generateApiKey = function (opts) {
        return this.base.postJson(apiKeyUrl, opts);
    };

    TTNovemberClient.registerComponent("settings", TTNovemberSettingsClient);
    return TTNovemberSettingsClient;
});
