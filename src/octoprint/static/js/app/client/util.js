(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient", "jquery"], factory);
    } else {
        factory(global.TTNovemberClient, global.$);
    }
})(this, function(TTNovember, $) {
    var url = "api/util";
    var testUrl = url + "/test";

    var TTNovemberUtilClient = function(base) {
        this.base = base;
    };

    TTNovemberUtilClient.prototype.test = function(command, parameters, opts) {
        return this.base.issueCommand(testUrl, command, parameters, opts);
    };

    TTNovemberUtilClient.prototype.testPath = function(path, additional, opts) {
        additional = additional || {};

        var data = $.extend({}, additional);
        data.path = path;

        return this.test("path", data, opts);
    };

    TTNovemberUtilClient.prototype.testExecutable = function(path, additional, opts) {
        additional = additional || {};

        var data = $.extend({}, additional);
        data.path = path;
        data.check_type = "file";
        data.check_access = "x";

        return this.test("path", data, opts);
    };

    TTNovemberUtilClient.prototype.testUrl = function(url, additional, opts) {
        additional = additional || {};

        var data = $.extend({}, additional);
        data.url = url;

        return this.test("url", data, opts);
    };

    TTNovemberClient.registerComponent("util", TTNovemberUtilClient);
    return TTNovemberUtilClient;
});
