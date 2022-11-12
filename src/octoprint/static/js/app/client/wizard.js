(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/setup/wizard";

    var TTNovemberWizardClient = function(base) {
        this.base = base;
    };

    TTNovemberWizardClient.prototype.get = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberWizardClient.prototype.finish = function(handled, opts) {
        return this.base.postJson(url, {handled: handled || []}, opts);
    };

    TTNovemberClient.registerComponent("wizard", TTNovemberWizardClient);
    return TTNovemberWizardClient;
});
