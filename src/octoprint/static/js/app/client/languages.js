(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/languages";

    var TTNovemberLanguagesClient = function(base) {
        this.base = base;
    };

    TTNovemberLanguagesClient.prototype.list = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberLanguagesClient.prototype.upload = function(file) {
        return this.base.upload(url, file);
    };

    TTNovemberLanguagesClient.prototype.delete = function(locale, pack, opts) {
        var packUrl = url + "/" + locale + "/" + pack;
        return this.base.delete(packUrl, opts);
    };

    TTNovemberClient.registerComponent("languages", TTNovemberLanguagesClient);
    return TTNovemberLanguagesClient;
});
