/* PRELOADER - version 1.0
- Description: Show/hide default preloader
- Date: Aug 16, 2017
- Author: Goon Nguyen
================================================== */
var PRELOADER = {
    init: function(){
        
    },
    show: function(callback){
        $("#preloader").removeClass("helper-hide");
    },
    hide: function(callback){
        $("#preloader").addClass("helper-hide");
    }
}