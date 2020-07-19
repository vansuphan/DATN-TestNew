
/* PRELOADER - version 1.0
- Description: Show/hide default preloader
- Date: Aug 16, 2017
- Author: Goon Nguyen
================================================== */
if (typeof PRELOADER != "undefined") delete PRELOADER;

var PRELOADER = {
    init: function () {

    },
    show: function (callback) {
        $("#preloader").removeClass("helper-hide");
        // $("#loading-wrapper").fadeIn();
    },
    hide: function (callback) {
        $("#preloader").addClass("helper-hide");
        $("#preloader .process-text").html("");
        // $("#loading-wrapper").fadeOut();
    },
    count:function (text) {
        this.show();
        $("#preloader .process-text").html(text);
    },
}
