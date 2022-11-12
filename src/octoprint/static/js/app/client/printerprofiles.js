(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient", "jquery"], factory);
    } else {
        factory(global.TTNovemberClient, global.$);
    }
})(this, function(TTNovemberClient, $) {
    var url = "api/printerprofiles";

    var profileUrl = function(profile) {
        return url + "/" + profile;
    };

    var TTNovemberPrinterProfileClient = function(base) {
        this.base = base;
    };

    TTNovemberPrinterProfileClient.prototype.list = function (opts) {
        return this.base.get(url, opts);
    };

    TTNovemberPrinterProfileClient.prototype.add = function (profile, basedOn, opts) {
        profile = profile || {};

        var data = {profile: profile};
        if (basedOn) {
            data.basedOn = basedOn;
        }

        return this.base.postJson(url, data, opts);
    };

    TTNovemberPrinterProfileClient.prototype.get = function (id, opts) {
        return this.base.get(profileUrl(id), opts);
    };

   TTNovemberPrinterProfileClient.prototype. update = function (id, profile, opts) {
        profile = profile || {};

        var data = {profile: profile};

        return this.base.patchJson(profileUrl(id), data, opts);
    };

    TTNovemberPrinterProfileClient.prototype.delete = function (id, opts) {
        return this.base.delete(profileUrl(id), opts);
    };

    TTNovemberClient.registerComponent("printerprofiles", TTNovemberPrinterProfileClient);
    return TTNovemberPrinterProfileClient;
});
