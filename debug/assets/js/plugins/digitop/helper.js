/*
 List of plugins:
  - DScript 1.0
  - DDevice 1.0
  - DMath 1.0
  - DArray 1.0
  - DLayoutCSS 1.0
  - DUpload 1.2 (2018-11-13)
  - DLoader 1.0
  - DBrowser 1.0
*/

/* DBrowser - version 1.0
// detect: WebGL, Browser name,...
Author: Goon Nguyen
================================================== */

var DLoader = {
    arr: [],
    onComplete: null,
    onProgress: null,
    progress: 0,
    loadCount: 0,
    add: function(url){
        this.arr.push(url);
    },
    load: function(url){
        if(typeof url == "undefined"){
            // load list
            var curURL = DLoader.arr[DLoader.loadCount];
            var img = new Image();
            img.onload = function(){
                if(DLoader.loadCount >= DLoader.arr.length){
                    if(DLoader.onComplete != null) DLoader.onComplete();
                    // clear all events
                    DLoader.onProgress = DLoader.onComplete = null;
                } else {
                    DLoader.loadCount++;
                    curURL = DLoader.arr[DLoader.loadCount];
                    DLoader.load(curURL);
                }
                DLoader.progress = DLoader.loadCount / DLoader.arr.length;
                if(DLoader.onProgress != null) DLoader.onProgress(DLoader.progress);
            }
            img.src = url;
        } else {
            DLoader.progress = 0;
            // load single
            var img = new Image();
            img.onload = function(){
                DLoader.progress = 1;
                if(DLoader.onProgress != null) DLoader.onProgress(DLoader.progress);
                if(DLoader.onComplete != null) DLoader.onComplete();
                // clear all events
                DLoader.onProgress = DLoader.onComplete = null;
            }
            img.src = url;
        }
    },
    on: function(event, callback){
        if(event == "complete"){
            DLoader.onComplete = callback;
        }
        if(event == "progress"){
            DLoader.onProgress = callback;
        }
    }
}

/* DBrowser - version 1.0
// detect: WebGL, Browser name,...
Author: Goon Nguyen
================================================== */

var DBrowser = {
    get isSupportWebGL() {
        /*try {
            var canvas = document.createElement("canvas");
            if( !!window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) ){
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }*/
        if (!!window.WebGLRenderingContext) {
            var canvas = document.createElement("canvas"),
                 names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
               context = false;

            for(var i=0;i<4;i++) {
                try {
                    context = canvas.getContext(names[i]);
                    if (context && typeof context.getParameter == "function") {
                        // else, return just true
                        return true;
                    }
                } catch(e) {
                    console.log("!")
                }
            }

            // WebGL is supported, but disabled
            return false;
        }

        // WebGL not supported
        return false;
    }
}

/* DScript - version 1.0
Author: Goon Nguyen
================================================== */

if (DScript == null && typeof DScript == "undefined") {
    var DScript = {
        version: 1,

        load: function(url, callback) {
            var done = false;
            var result = {
                status: false,
                message: ""
            };
            var script = document.createElement('script');
            script.setAttribute('src', url);

            script.onload = handleLoad;
            script.onreadystatechange = handleReadyStateChange;
            script.onerror = handleError;

            document.head.appendChild(script);

            function handleLoad() {
                if (!done) {
                    done = true;

                    result.status = true;
                    result.message = "Script was loaded successfully";

                    if (callback) callback(result);
                }
            }

            function handleReadyStateChange() {
                var state;

                if (!done) {
                    state = script.readyState;
                    if (state === "complete") {
                        handleLoad();
                    }
                }
            }

            function handleError() {
                if (!done) {
                    done = true;
                    result.status = false;
                    result.message = "Failed to load script."
                    if (callback) callback(result);
                }
            }
        },

        unload: function(url, callback) {
            var scripts = document.getElementsByTagName("script");
            var result = {
                status: false,
                message: ""
            };

            for (var i = 0; i < scripts.length; i++) {
                var script = scripts[i];
                if (script.src) {
                    var src = script.src;
                    if (String(src).toLowerCase().indexOf(url.toLowerCase()) >= 0) {
                        script.parentElement.removeChild(script);
                        result.status = true;
                        result.message = "Unload script successfully.";
                    }
                }
            }

            if (!result.status) {
                result.message = "Script not found.";
            }

            if (callback) callback(result);

            return result;
        },

        isExisted: function(filename) {
            var scripts = document.getElementsByTagName("script");
            var existed = false;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src) {
                    var src = scripts[i].src;
                    if (String(src).toLowerCase().indexOf(filename.toLowerCase()) >= 0) {
                        existed = true;
                    }
                    console.log(i, scripts[i].src)
                } else {
                    console.log(i, scripts[i].innerHTML)
                }
            }
            return existed;
        },

        loadList: function(array, callback) {
            var result = {
                status: false,
                message: ""
            };
            var count = 0;
            var total = array.length;
            //console.log("loadList")
            this.load(array[count], onComplete);

            function onComplete(result) {
                count++;
                //console.log(count, total)
                if (count == total) {
                    result.status = true;
                    result.message = "All scripts were loaded.";
                    if (callback) callback(result);
                } else {
                    DScript.load(array[count], onComplete);
                }
            }
        }
    }
}

/* DDevice - version 1.0
Author: Goon Nguyen
================================================== */

var DDevice = {
    tmpOri: "portrait", //landscape
    ratio: 16 / 9,
    tmpType: "mobile",
    get type() {
        DDevice.resize();
        return DDevice.tmpType;
    },

    get orientation() {
        DDevice.resize();
        return DDevice.tmpOri;
    },

    get width() {
        return $(window).width();
    },

    get height() {
        return $(window).height();
    },

    init: function() {
        $(window).resize(DDevice.resize);
        DDevice.resize();
    },
    resize: function(e) {
        var sw = $(window).width();
        var sh = $(window).height();

        DDevice.ratio = sw / sh;

        if (DDevice.ratio > 1) {
            DDevice.tmpOri = "landscape"

            if (sw > 1024) {
                DDevice.tmpType = "desktop"
            } else {
                if (sw > 640) {
                    DDevice.tmpType = "tablet"
                } else {
                    DDevice.tmpType = "mobile"
                }
            }

        } else if (DDevice.ratio < 1) {
            DDevice.tmpOri = "portrail"

            //console.log("sw: " + sw);
            if (sw > 770) {
                DDevice.tmpType = "desktop"
            } else {
                if (sw > 480) {
                    DDevice.tmpType = "tablet"
                } else {
                    DDevice.tmpType = "mobile"
                }
            }
        } else {
            DDevice.tmpOri = "square"
            DDevice.tmpType = "desktop"
        }

        //console.log(DDevice);
    }
}
$(document).ready(function() {
    DDevice.init();
})

/* DMath - version 1.0
Author: Goon Nguyen
================================================== */

var DMath = {
    random: function(number) {
        return number * Math.random();
    },
    randomInt: function(number) {
        return Math.floor(DMath.random(number));
    },
    randomPlusMinus: function(number) {
        return number * (Math.random() - Math.random());
    },
    randomIntPlusMinus: function(number) {
        return Math.round(DMath.randomPlusMinus(number));
    },
    randomFromTo: function(from, to) {
        return from + (to - from) * Math.random();
    },
    randomIntFromTo: function(from, to) {
        return Math.floor(DMath.randomFromTo(from, to));
    },

    angleRadBetween2Points: function(p1, p2) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },

    angleDegBetween2Points: function(p1, p2) {
        return DMath.radToDeg(DMath.angleRadBetween2Points(p1, p2));
    },

    degToRad: function(deg) {
        return deg * Math.PI / 180;
    },

    radToDeg: function(rad) {
        return rad * 180 / Math.PI;
    },

    angleRadBetween3Points: function(A, B, C) {
        var AB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
        var BC = Math.sqrt(Math.pow(B.x - C.x, 2) + Math.pow(B.y - C.y, 2));
        var AC = Math.sqrt(Math.pow(C.x - A.x, 2) + Math.pow(C.y - A.y, 2));
        return Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
    },

    getPointWithAngleAndRadius: function(angle, radius) {
        var p = {
            x: 0,
            y: 0
        };
        p.x = radius * Math.cos(angle);
        p.y = radius * Math.sin(angle);
        return p;
    },

    distanceBetweenPoints: function(p1, p2) {
        var x1 = p1.x;
        var y1 = p1.y;

        var x2 = p2.x;
        var y2 = p2.y;

        var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));

        return d;
    }
}

/* DArray - version 1.0
Author: Goon Nguyen
================================================== */

var DArray = {
    remove: function(item, array) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return array;
    }
}

/* DLayoutCSS - version 1.0
Author: Goon Nguyen
================================================== */

var DLayoutCSS = {
    init: function() {
        console.log("[DLayoutCSS 1.0] Initialized!");
        $(window).resize(DLayoutCSS.resize);
        DLayoutCSS.resize();
    },
    resize: function(e) {
        var sw = $(window).width();
        var sh = $(window).height();
        if ($('.helper-layout-fullscreen').length > 0) {
            $('.helper-layout-fullscreen').width(sw);
            $('.helper-layout-fullscreen').height(sh);
        }
    }
}
$(function() {
    DLayoutCSS.init();
})

/* DUpload - version 1.1
Author: Goon Nguyen
================================================== */

var DUpload = {
    inputElement: null,
    renderer: null,
    customClass: "",
    customPostName: "photo",
    customUploadType: "images/*",
    reader: null,
    file: null,

    onSelect: null, // (base64)
    onCancel: null,
    onStart: null,
    checkSelectedInt: null,

    browse: function(callback) {
        this.onSelect = callback;

        DUpload.resultBase64 = "";
        DUpload.file = null;
        this.inputElement = null;

        if ($(".DUpload-input").length > 0) {
            $(".DUpload-input").remove();
            console.log("input is existed");
        }

        $("body").append('<input class="DUpload-input helper-hide ' + DUpload.customClass + '" type="file" name="' + DUpload.customPostName + '" accept="' + DUpload.customUploadType + '">');

        this.inputElement = $(".DUpload-input");

        this.inputElement.on("change", onChangeHandler);
        $(".DUpload-input")[0].onChange = onChangeHandler;
        //$(".DUpload-input")[0].addEventListener("change", onChangeHandler);

        this.inputElement.click();

        /*$(window).focusout(function(){
            console.log("This input field has lost its focus.");
        });*/

        $(window).focusin(function() {
            //console.log("This input field has gained its focus.");
            clearTimeout(DUpload.checkSelectedInt)
            DUpload.checkSelectedInt = setTimeout(checkSelected, 500);
        });

        function checkSelected() {
            if (!DUpload.file) {
                console.log("[DUpload] onCancel");
                $(".DUpload-input").remove();
                if (DUpload.onCancel) DUpload.onCancel();

                $(window).off("focusin");

                DUpload.file = null;
            } else {
                //
            }
        }

        //this.inputElement.focusin();

        //--

        function onChangeHandler() {
            //console.log($(this).val());
            if ($(this)[0].files[0]) {
                if (DUpload.onStart) DUpload.onStart();

                DUpload.file = $(this)[0].files[0];

                if (window.FileReader && window.FileReader.prototype.readAsArrayBuffer) {
                    DUpload.reader = new FileReader();

                    DUpload.reader.addEventListener("load", DUpload.onReadDataURL);

                    if (DUpload.file) {
                        DUpload.reader.readAsDataURL(DUpload.file);
                    }
                } else {
                    $(".DUpload-input").remove();
                    alert("Please upload your browser to use this feature.");
                    throw "This browser is too old to use this feature.";
                }
            } else {
                console.log("[DUpload] onCancel");
                DUpload.file = null;
                DUpload.resultBase64 = "";
                $(".DUpload-input").remove();
                if (DUpload.onCancel) DUpload.onCancel();
            }
        } //--
    },

    onReadDataURL: function(e) {
        DUpload.resultBase64 = DUpload.reader.result;

        //DUpload.reader.removeEventListener("load", DUpload.onReadDataURL);

        var reader = new FileReader();
        //DUpload.reader.onload = DUpload.onReadBuffer;
        if (reader.readAsArrayBuffer) {
            reader.addEventListener("load", DUpload.onReadBuffer);
            reader.readAsArrayBuffer(DUpload.file.slice(0, 64 * 1024));
        } else {
            console.log("[DUpload] onSelect");
            if (DUpload.onSelect) DUpload.onSelect(DUpload.resultBase64, null);
            $(".DUpload-input").remove();
            DUpload.file = null;
        }
    },

    onReadBuffer: function(e) {
        var orientation = DUpload.getOrientation(e.target.result);
        var params = {};
        console.log(orientation);
        switch (orientation) {
            case 6:
                params.orientation = 90;
                break;
            case 8:
                params.orientation = 270;
                break;
            case 3:
                params.orientation = 180;
                break;
            default:
                params.orientation = 0;
                break;
        }

        $(".DUpload-input").remove();
        DUpload.file = null;

        if(params.orientation != 0){
            // Auto rotate image:
            DUpload.rotateImage(DUpload.resultBase64, params.orientation, function(result){
                DUpload.resultBase64 = result;
                if (DUpload.onSelect) DUpload.onSelect(DUpload.resultBase64, params);
            });
        } else {
            if (DUpload.onSelect) DUpload.onSelect(DUpload.resultBase64, params);
        }

        // if (DUpload.onSelect) DUpload.onSelect(DUpload.resultBase64, params);
    },

    rotateImage: function(inputBase64, degrees, callback){
        if(DUpload.canvas) {
            document.body.removeChild(DUpload.canvas);
            DUpload.canvas = null;
        }

        var image = document.createElement("img");
        image.onload = function(){
            DUpload.canvas = document.createElement("canvas");
            var canvas = DUpload.canvas;
            var ctx = canvas.getContext("2d");
            canvas.style.invisibility = "hidden";
            canvas.style.position = "absolute";
            canvas.style.left = "10000px";
        
            if(degrees == 90 || degrees == 270) {
                canvas.width = image.height;
                canvas.height = image.width;
            } else {
                canvas.width = image.width;
                canvas.height = image.height;
            }
        
            ctx.clearRect(0,0,canvas.width,canvas.height);
            if(degrees == 90 || degrees == 270) {
                ctx.translate(image.height/2,image.width/2);
            } else {
                ctx.translate(image.width/2,image.height/2);
            }
            ctx.rotate(degrees*Math.PI/180);
            ctx.drawImage(image,-image.width/2,-image.height/2);
        
            document.body.appendChild(canvas);

            var resultBase64 = canvas.toDataURL();
            if(callback) callback(resultBase64);
        };
        image.src = inputBase64;
        
    },

    getOrientation: function(dataBuffer) {
        var view = new DataView(dataBuffer);
        if (view.getUint16(0, false) != 0xFFD8) return -2;
        var length = view.byteLength,
            offset = 2;
        while (offset < length) {
            var marker = view.getUint16(offset, false);
            offset += 2;
            if (marker == 0xFFE1) {
                if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
                var little = view.getUint16(offset += 6, false) == 0x4949;
                offset += view.getUint32(offset + 4, little);
                var tags = view.getUint16(offset, little);
                offset += 2;
                for (var i = 0; i < tags; i++)
                    if (view.getUint16(offset + (i * 12), little) == 0x0112)
                        return view.getUint16(offset + (i * 12) + 8, little);
            } else if ((marker & 0xFF00) != 0xFF00) break;
            else offset += view.getUint16(offset, false);
        }
        return -1;
    },

    onRead: function() {},

    onFailRead: function() {

    }
}