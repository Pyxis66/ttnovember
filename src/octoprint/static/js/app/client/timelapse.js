(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient", "jquery"], factory);
    } else {
        factory(global.TTNovemberClient, global.$);
    }
})(this, function(TTNovemberClient, $) {
    var url = "api/timelapse";

    var downloadUrl = "downloads/timelapse";

    var timelapseUrl = function(filename) {
        return url + "/" + filename;
    };

    var timelapseDownloadUrl = function(filename) {
        return downloadUrl + "/" + filename;
    };

    var unrenderedTimelapseUrl = function(name) {
        return url + "/unrendered/" + name;
    };

    var TTNovemberTimelapseClient = function(base) {
        this.base = base;
    };

    TTNovemberTimelapseClient.prototype.get = function (unrendered, opts) {
        if (unrendered) {
            opts = opts || {};
            opts.data = {unrendered: unrendered};
        }
        return this.base.get(url, opts);
    };

    TTNovemberTimelapseClient.prototype.list = function(opts) {
        var deferred = $.Deferred();

        this.get(true, opts)
            .done(function (response, status, request) {
                deferred.resolve({
                    rendered: response.files,
                    unrendered: response.unrendered
                }, status, request);
            })
            .fail(function () {
                deferred.reject.apply(null, arguments);
            });

        return deferred.promise();
    };

    TTNovemberTimelapseClient.prototype.listRendered = function (opts) {
        var deferred = $.Deferred();

        this.get(false, opts)
            .done(function (response, status, request) {
                deferred.resolve(response.files, status, request);
            })
            .fail(function () {
                deferred.reject.apply(null, arguments);
            });

        return deferred.promise();
    };

    TTNovemberTimelapseClient.prototype.listUnrendered = function (opts) {
        var deferred = $.Deferred();

        this.get(true, opts)
            .done(function (response, status, request) {
                deferred.resolve(response.unrendered, status, request);
            })
            .fail(function () {
                deferred.reject.apply(null, arguments);
            });

        return deferred.promise();
    };

    TTNovemberTimelapseClient.prototype.download = function (filename, opts) {
        return this.base.download(timelapseDownloadUrl(filename), opts);
    };

    TTNovemberTimelapseClient.prototype.delete = function (filename, opts) {
        return this.base.delete(timelapseUrl(filename), opts);
    };

    TTNovemberTimelapseClient.prototype.deleteUnrendered = function(name, opts) {
        return this.base.delete(unrenderedTimelapseUrl(name), opts);
    };

    TTNovemberTimelapseClient.prototype.renderUnrendered = function(name, opts) {
        return this.base.issueCommand(unrenderedTimelapseUrl(name), "render");
    };

    TTNovemberTimelapseClient.prototype.getConfig = function (opts) {
        var deferred = $.Deferred();
        this.get(false, opts)
            .done(function (response, status, request) {
                deferred.resolve(response.config, status, request);
            })
            .fail(function () {
                deferred.reject.apply(null, arguments);
            });
        return deferred.promise();
    };

    TTNovemberTimelapseClient.prototype.saveConfig = function (config, opts) {
        config = config || {};
        return TTNovember.postJson(url, config, opts);
    };

    TTNovemberClient.registerComponent("timelapse", TTNovemberTimelapseClient);
    return TTNovemberTimelapseClient;
});
