var GLOBAL = this;
if (typeof path_resource == "undefined") path_resource = "";
if (typeof CDN_DEV == "undefined") CDN_DEV = "";
if (typeof CDN_PROD == "undefined") CDN_PROD = "";

Object.defineProperties(GLOBAL, {
    // Dont edit structure this, super risky.
    // Must be read only.
    isLocal: {
        get: function () {
            // return false;
            return window.location.hostname.includes('localhost')
                || window.location.hostname.includes('192.168')
                || window.location.origin.includes('file')
                || window.location.href.includes("https://dev4.digitop.vn/demo")
                ;
        }
    },
});


var globalCssList = [
    // main CSS files:
    //path_resource + "assets/css/main.css" + randomVersion(), // generate from SASS
    // path_resource + "assets/css/pure.css", // will overwrite SASS
    // Helper CSS file: preloader & some quick styling css
    // path_resource + "assets/css/helper.css",
    // More CSS file to inject? Use this:
    // path_resource + "assets/css/test.css", 
    path_resource + 'assets/js/plugins/nanoscroller/nanoscroller.css',
];

var globalJsList = [
    path_resource + "assets/js/vendor/jquery/jquery.min.js",
    path_resource + "assets/js/digitop/bundle.js",
    // vendor
    path_resource + "assets/js/vendor/sweetalert/sweetalert.min.js",
    path_resource + "assets/js/plugins/nanoscroller/jquery.nanoscroller.min.js",
    path_resource + "assets/js/plugins/slick/slick.js",
    path_resource + "assets/js/plugins/scrollmagic/ScrollMagic.min.js", 
    path_resource + "assets/js/plugins/scrollmagic/plugins/animation.gsap.min.js", 
    path_resource + "assets/js/plugins/scrollmagic/plugins/debug.addIndicators.min.js",
    path_resource + "assets/js/plugins/jquery-ui/jquery-ui.min.js",
    // common scripts will execute in all templates:
    path_resource + "assets/js/digitop-common.js",
];

var MAIN = {
    init: function () {
        // Inject JS and CSS files:
        // These scripts will be available in every pages.
        var scriptArr = [];
        globalCssList.forEach(function (css) {
            scriptArr.push(css);
        });
        globalJsList.forEach(function (js) {
            scriptArr.push(js);
        });

        GLoader.loadScripts(scriptArr, {
            onComplete: function (result) {
                // inject page script (if any):
                var mainTag = document.getElementsByTagName("main")[0];
                if (!mainTag) {
                    console.log("[MAIN] Thẻ <main> trong HTML của bạn đâu?");
                    return;
                }

                var pageID = mainTag.getAttribute("id");
                if (!pageID) {
                    console.log("[MAIN] Thẻ <main> hình như chưa có 'id' kìa. Mà nếu không cần thì thôi cũng chả sao!");
                    //return;
                }

                if (pageID) {
                    GLoader.loadScript(path_resource + "assets/js/pages/" + pageID + ".js", function (script) {
                        if (GLOBAL[pageID] && typeof GLOBAL[pageID].init != "undefined") {
                            GLOBAL[pageID].init();
                        } else {
                            console.log("[MAIN] Không tìm thấy Class [" + pageID + "] nào để gọi init() cả.");
                        }
                    });
                }
                else {
                    console.log("[MAIN] Chả có Class JS (id) nào cho trang này để load cả.");
                }
            }
        }
        );
        // End MAIN init.
    }
};

// Execute INIT:
MAIN.init();