(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var loginUrl = "api/login";
    var logoutUrl = "api/logout";

    var TTNovemberBrowserClient = function(base) {
        this.base = base;
    };

    TTNovemberBrowserClient.prototype.login = function(username, password, remember, opts) {
        var data = {
            user: username,
            pass: password,
            remember: !!remember
        };
        return this.base.postJson(loginUrl, data, opts);
    };

    TTNovemberBrowserClient.prototype.passiveLogin = function(opts) {
        return this.base.postJson(loginUrl, {passive: true}, opts);
    };

    TTNovemberBrowserClient.prototype.logout = function(opts) {
        return this.base.postJson(logoutUrl, {}, opts);
    };

    TTNovemberClient.registerComponent("browser", TTNovemberBrowserClient);
    return TTNovemberBrowserClient;
});
