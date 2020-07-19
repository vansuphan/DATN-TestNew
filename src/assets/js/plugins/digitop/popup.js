/* POPUP - version 1.0
- Description: Show/hide popup
- Date: Aug 16, 2017
- Author: Goon Nguyen
================================================== */
var POPUP = {
    isShow: false,
    currentPopup: "",

    init: function(){
        //TweenMax.set("#popup .holder", {opacity: 0, transformOrigin: ""});
    },
    show: function(callback){
        $("#popup").removeClass("helper-hide");
        TweenMax.set("#popup .holder", {scaleX: 0.5, scaleY: 0.5, opacity: 0});
    },
    hide: function(callback){
        $("#popup").ađClass("helper-hide");
    }
}