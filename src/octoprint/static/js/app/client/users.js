(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var baseUrl = "api/users";

    var url = function() {
        if (arguments.length) {
            return baseUrl + "/" + Array.prototype.join.call(arguments, "/");
        } else {
            return baseUrl;
        }
    };

    var TTNovemberUserClient = function(base) {
        this.base = base;
    };

    TTNovemberUserClient.prototype.list = function (opts) {
        return this.base.get(url(), opts);
    };

    TTNovemberUserClient.prototype.add = function (user, opts) {
        if (!user.name || !user.password) {
            throw new TTNovemberClient.InvalidArgumentError("Both user's name and password need to be set");
        }

        var data = {
            name: user.name,
            password: user.password,
            active: user.hasOwnProperty("active") ? !!user.active : true,
            admin: user.hasOwnProperty("admin") ? !!user.admin : false
        };

        return this.base.postJson(url(), data, opts);
    };

    TTNovemberUserClient.prototype.get = function (name, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        return this.base.get(url(name), opts);
    };

    TTNovemberUserClient.prototype.update = function (name, active, admin, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        var data = {
            active: !!active,
            admin: !!admin
        };
        return this.base.putJson(url(name), data, opts);
    };

    TTNovemberUserClient.prototype.delete = function (name, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        return this.base.delete(url(name), opts);
    };

    TTNovemberUserClient.prototype.changePassword = function (name, password, opts) {
        if (!name || !password) {
            throw new TTNovemberClient.InvalidArgumentError("user name and password must be set");
        }

        var data = {
            password: password
        };
        return this.base.putJson(url(name, "password"), data, opts);
    };

    TTNovemberUserClient.prototype.generateApiKey = function (name, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        return this.base.postJson(url(name, "apikey"), opts);
    };

    TTNovemberUserClient.prototype.resetApiKey = function (name, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        return this.base.delete(url(name, "apikey"), opts);
    };

    TTNovemberUserClient.prototype.getSettings = function (name, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        return this.base.get(url(name, "settings"), opts);
    };

    TTNovemberUserClient.prototype.saveSettings = function (name, settings, opts) {
        if (!name) {
            throw new TTNovemberClient.InvalidArgumentError("user name must be set");
        }

        settings = settings || {};
        return this.base.patchJson(url(name, "settings"), settings, opts);
    };

    TTNovemberClient.registerComponent("users", TTNovemberUserClient);
    return TTNovemberUserClient;
});
