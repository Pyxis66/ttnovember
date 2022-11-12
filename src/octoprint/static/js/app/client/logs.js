(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/logs";

    var TTNovemberLogsClient = function(base) {
        this.base = base;
    };

    TTNovemberLogsClient.prototype.list = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberLogsClient.prototype.delete = function(file, opts) {
        var fileUrl = url + "/" + file;
        return this.base.delete(fileUrl, opts);
    };

    TTNovemberLogsClient.prototype.download = function(file, opts) {
        var fileUrl = url + "/" + file;
        return this.base.download(fileUrl, opts);
    };

    TTNovemberClient.registerComponent("logs", TTNovemberLogsClient);
    return TTNovemberLogsClient;
});
