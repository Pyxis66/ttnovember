(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["TTNovemberClient"], factory);
    } else {
        factory(global.TTNovemberClient);
    }
})(this, function(TTNovemberClient) {
    var url = "api/slicing";

    var slicerUrl = function(slicer) {
        return url + "/" + slicer;
    };

    var profileUrl = function(slicer, profileId) {
        return slicerUrl(slicer) + "/profiles/" + profileId;
    };

    var TTNovemberSlicingClient = function(base) {
        this.base = base;
    };

    TTNovemberSlicingClient.prototype.listAllSlicersAndProfiles = function(opts) {
        return this.base.get(url, opts);
    };

    TTNovemberSlicingClient.prototype.listProfilesForSlicer = function(slicer, opts) {
        return this.base.get(slicerUrl(slicer) + "/profiles", opts);
    };

    TTNovemberSlicingClient.prototype.getProfileForSlicer = function(slicer, profileId, opts) {
        return this.base.get(profileUrl(slicer, profileId), opts);
    };

    TTNovemberSlicingClient.prototype.addProfileForSlicer = function(slicer, profileId, profile, opts) {
        profile = profile || {};
        return this.base.putJson(profileUrl(slicer, profileId), profile, opts);
    };

    TTNovemberSlicingClient.prototype.updateProfileForSlicer = function(slicer, profileId, profile, opts) {
        profile = profile || {};
        return this.base.patchJson(profileUrl(slicer, profileId), profile, opts);
    };

    TTNovemberSlicingClient.prototype.deleteProfileForSlicer = function(slicer, profileId, opts) {
        return this.base.delete(profileUrl(slicer, profileId), opts);
    };

    TTNovemberClient.registerComponent("slicing", TTNovemberSlicingClient);
    return TTNovemberSlicingClient;
});
