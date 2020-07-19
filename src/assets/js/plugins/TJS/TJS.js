
//	Polyfills

/*

Object
    prototype:
        randomValue
        randomKey
        randomElementIndex
        getObjectLength

*/


Object.defineProperties(Object.prototype, {

    randomValue: {
        get: function () {
            return this[this.randomKey];
        }
    },
    randomKey: {
        get: function () {
            var keys = Object.keys(this);
            return keys[keys.length * Math.random() << 0];
        }
    },
    randomElementIndex: {
        get: function () {
            var keys = Object.keys(this)
            return keys.length * Math.random() << 0;
        }
    },
    getObjectLength: {
        get: function () {
            var keys = Object.keys(this)
            return keys;
        }
    }

})




function onRemoveTweenChild(item) {
    try {
        TweenMax.killTweensOf(item);
        for (var i = 0; i < item.children.length; i++) {
            var _item = item.children[i];
            onRemoveTweenChild(_item);
        }
    } catch (error) {
        //////console.log(errorr);
    }

}


(function (global, factory) {



    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.TJS = global.TJS || {})));
}(this, (function (exports) {
    'use strict';


    var tMath = {

        DEG2RAD: Math.PI / 180,
        RAD2DEG: 180 / Math.PI,

        generateUUID: (function () {

            // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

            var lut = [];

            for (var i = 0; i < 256; i++) {

                lut[i] = (i < 16 ? '0' : '') + (i).toString(16);

            }

            return function generateUUID() {

                var d0 = Math.random() * 0xffffffff | 0;
                var d1 = Math.random() * 0xffffffff | 0;
                var d2 = Math.random() * 0xffffffff | 0;
                var d3 = Math.random() * 0xffffffff | 0;
                var uuid = lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
                    lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
                    lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                    lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];

                // .toUpperCase() here flattens concatenated strings to save heap memory space.
                return uuid.toUpperCase();

            };

        })(),


        isRotateLeft: function (a, b, c) {
            return ((b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)) > 0;
        },

        deg_between_points_360: function (cx, cy, ex, ey) {
            var theta = tMath.angleLine(cx, cy, ex, ey); // range (-180, 180]
            if (theta < 0) theta = 360 + theta; // range [0, 360)
            return theta;
        },

        deg_between_points: function (cx, cy, ex, ey) {
            var dy = ey - cy;
            var dx = ex - cx;
            var theta = Math.atan2(dy, dx); // range (-PI, PI]
            theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
            return theta;
        },


        angle_between_points: function (cx, cy, ex, ey) {
            var dy = ey - cy;
            var dx = ex - cx;
            var theta = Math.atan2(dy, dx); // range (-PI, PI]
            // theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
            return theta;
        },


        distance2Point: function (x1, y1, x2, y2) {
            var dist = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
            return dist;
        },

        randRound: function (number) {
            return Math.round(Math.random() * number);
        },

        rand: function (number) {
            return (Math.random() - Math.random()) * number;
        },

        randHalt: function (number) {
            var rand = (Math.random() - Math.random());
            var res;
            if (rand > 0) {
                res = (rand * (number / 2)) + (number / 2);
            } else {
                res = (rand * (number / 2)) - (number / 2);
            }
            return Math.abs(res);
        },


        clamp: function (value, min, max) {

            return Math.max(min, Math.min(max, value));

        },

        // compute euclidian modulo of m % n
        // https://en.wikipedia.org/wiki/Modulo_operation

        euclideanModulo: function (n, m) {

            return ((n % m) + m) % m;

        },

        // Linear mapping from range <a1, a2> to range <b1, b2>

        mapLinear: function (x, a1, a2, b1, b2) {

            return b1 + (x - a1) * (b2 - b1) / (a2 - a1);

        },

        // https://en.wikipedia.org/wiki/Linear_interpolation

        lerp: function (x, y, t) {

            return (1 - t) * x + t * y;

        },

        // http://en.wikipedia.org/wiki/Smoothstep

        smoothstep: function (x, min, max) {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * (3 - 2 * x);

        },

        smootherstep: function (x, min, max) {

            if (x <= min) return 0;
            if (x >= max) return 1;

            x = (x - min) / (max - min);

            return x * x * x * (x * (x * 6 - 15) + 10);

        },

        // Random integer from <low, high> interval

        randInt: function (low, high) {

            return low + Math.floor(Math.random() * (high - low + 1));

        },

        // Random float from <low, high> interval

        randFloat: function (low, high) {

            return low + Math.random() * (high - low);

        },

        // Random float from <-range/2, range/2> interval

        randFloatSpread: function (range) {

            return range * (0.5 - Math.random());

        },

        degToRad: function (degrees) {

            return degrees * tMath.DEG2RAD;

        },

        radToDeg: function (radians) {

            return radians * tMath.RAD2DEG;

        },

        isPowerOfTwo: function (value) {

            return (value & (value - 1)) === 0 && value !== 0;

        },

        nearestPowerOfTwo: function (value) {

            return Math.pow(2, Math.round(Math.log(value) / Math.LN2));

        },

        nextPowerOfTwo: function (value) {

            value--;
            value |= value >> 1;
            value |= value >> 2;
            value |= value >> 4;
            value |= value >> 8;
            value |= value >> 16;
            value++;

            return value;

        }

    };


    function Vector2(x, y) {

        this.x = x || 0;
        this.y = y || 0;

    }

    Object.defineProperties(Vector2.prototype, {

        "width": {

            get: function () {

                return this.x;

            },

            set: function (value) {

                this.x = value;

            }

        },

        "height": {

            get: function () {

                return this.y;

            },

            set: function (value) {

                this.y = value;

            }

        }

    });

    Object.assign(Vector2.prototype, {

        isVector2: true,

        set: function (x, y) {

            this.x = x;
            this.y = y;

            return this;

        },

        setScalar: function (scalar) {

            this.x = scalar;
            this.y = scalar;

            return this;

        },

        setX: function (x) {

            this.x = x;

            return this;

        },

        setY: function (y) {

            this.y = y;

            return this;

        },

        setComponent: function (index, value) {

            switch (index) {

                case 0: this.x = value; break;
                case 1: this.y = value; break;
                default: throw new Error('index is out of range: ' + index);

            }

            return this;

        },

        getComponent: function (index) {

            switch (index) {

                case 0: return this.x;
                case 1: return this.y;
                default: throw new Error('index is out of range: ' + index);

            }

        },

        clone: function () {

            return new this.constructor(this.x, this.y);

        },

        copy: function (v) {

            this.x = v.x;
            this.y = v.y;

            return this;

        },

        add: function (v, w) {

            if (w !== undefined) {

                console.warn('THREE.Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.');
                return this.addVectors(v, w);

            }

            this.x += v.x;
            this.y += v.y;

            return this;

        },

        addScalar: function (s) {

            this.x += s;
            this.y += s;

            return this;

        },

        addVectors: function (a, b) {

            this.x = a.x + b.x;
            this.y = a.y + b.y;

            return this;

        },

        addScaledVector: function (v, s) {

            this.x += v.x * s;
            this.y += v.y * s;

            return this;

        },

        sub: function (v, w) {

            if (w !== undefined) {

                console.warn('THREE.Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.');
                return this.subVectors(v, w);

            }

            this.x -= v.x;
            this.y -= v.y;

            return this;

        },

        subScalar: function (s) {

            this.x -= s;
            this.y -= s;

            return this;

        },

        subVectors: function (a, b) {

            this.x = a.x - b.x;
            this.y = a.y - b.y;

            return this;

        },

        multiply: function (v) {

            this.x *= v.x;
            this.y *= v.y;

            return this;

        },

        multiplyScalar: function (scalar) {

            this.x *= scalar;
            this.y *= scalar;

            return this;

        },

        divide: function (v) {

            this.x /= v.x;
            this.y /= v.y;

            return this;

        },

        divideScalar: function (scalar) {

            return this.multiplyScalar(1 / scalar);

        },

        applyMatrix3: function (m) {

            var x = this.x, y = this.y;
            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6];
            this.y = e[1] * x + e[4] * y + e[7];

            return this;

        },

        min: function (v) {

            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);

            return this;

        },

        max: function (v) {

            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);

            return this;

        },

        clamp: function (min, max) {

            // assumes min < max, componentwise

            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));

            return this;

        },

        clampScalar: function () {

            var min = new Vector2();
            var max = new Vector2();

            return function clampScalar(minVal, maxVal) {

                min.set(minVal, minVal);
                max.set(maxVal, maxVal);

                return this.clamp(min, max);

            };

        }(),

        clampLength: function (min, max) {

            var length = this.length();

            return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));

        },

        floor: function () {

            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);

            return this;

        },

        ceil: function () {

            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);

            return this;

        },

        round: function () {

            this.x = Math.round(this.x);
            this.y = Math.round(this.y);

            return this;

        },

        roundToZero: function () {

            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);

            return this;

        },

        negate: function () {

            this.x = - this.x;
            this.y = - this.y;

            return this;

        },

        dot: function (v) {

            return this.x * v.x + this.y * v.y;

        },

        cross: function (v) {

            return this.x * v.y - this.y * v.x;

        },

        lengthSq: function () {

            return this.x * this.x + this.y * this.y;

        },

        length: function () {

            return Math.sqrt(this.x * this.x + this.y * this.y);

        },

        manhattanLength: function () {

            return Math.abs(this.x) + Math.abs(this.y);

        },

        normalize: function () {

            return this.divideScalar(this.length() || 1);

        },

        angle: function () {

            // computes the angle in radians with respect to the positive x-axis

            var angle = Math.atan2(this.y, this.x);

            if (angle < 0) angle += 2 * Math.PI;

            return angle;

        },

        distanceTo: function (v) {

            return Math.sqrt(this.distanceToSquared(v));

        },

        distanceToSquared: function (v) {

            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;

        },

        manhattanDistanceTo: function (v) {

            return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);

        },

        setLength: function (length) {

            return this.normalize().multiplyScalar(length);

        },

        lerp: function (v, alpha) {

            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;

            return this;

        },

        lerpVectors: function (v1, v2, alpha) {

            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);

        },

        equals: function (v) {

            return ((v.x === this.x) && (v.y === this.y));

        },

        fromArray: function (array, offset) {

            if (offset === undefined) offset = 0;

            this.x = array[offset];
            this.y = array[offset + 1];

            return this;

        },

        toArray: function (array, offset) {

            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            array[offset] = this.x;
            array[offset + 1] = this.y;

            return array;

        },

        fromBufferAttribute: function (attribute, index, offset) {

            if (offset !== undefined) {

                console.warn('THREE.Vector2: offset has been removed from .fromBufferAttribute().');

            }

            this.x = attribute.getX(index);
            this.y = attribute.getY(index);

            return this;

        },

        rotateAround: function (center, angle) {

            var c = Math.cos(angle), s = Math.sin(angle);

            var x = this.x - center.x;
            var y = this.y - center.y;

            this.x = x * c - y * s + center.x;
            this.y = x * s + y * c + center.y;

            return this;

        }

    });
    exports.Vector2 = Vector2;


    var GLoader = {
        version: 1.2,

        // Load script: JS or CSS
        loadScript: function (url, callback) {
            var done = false;
            var fileType = (url.indexOf('.js') > -1) ? "js" : "css";
            var result = { status: false, message: "" };
            var script = (fileType == "js") ? document.createElement('script') : document.createElement('link');

            script.setAttribute('loader', 'GLoader');
            if (fileType == "js") {
                script.setAttribute('type', 'text/javascript');
                script.setAttribute('src', url);
            } else {
                script.setAttribute('rel', 'stylesheet');
                script.setAttribute('type', 'text/css');
                script.setAttribute('href', url);
            }
            // events
            script.onload = handleLoad;
            script.onreadystatechange = handleReadyStateChange;
            script.onerror = handleError;

            if (fileType == "js") {
                document.body.appendChild(script);
            } else {
                document.head.appendChild(script);
            }

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
                //console.log("error");
                if (!done) {
                    done = true;
                    result.status = false;
                    result.message = "Failed to load script."
                    if (callback) callback(result);
                }
            }
        },

        // check file existed:
        isExisted: function (filename) {
            var scripts = document.getElementsByTagName("script");
            var existed = false;
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].src) {
                    var src = scripts[i].src;
                    if (String(src).toLowerCase().indexOf(filename.toLowerCase()) >= 0) {
                        existed = true;
                    }
                    //console.log(i,scripts[i].src)
                } else {
                    //console.log(i,scripts[i].innerHTML)
                }
            }
            return existed;
        },

        // Load list of scripts:
        loadScripts: function (array, callback) {
            var result = { status: false, message: "" };
            var count = 0;
            var total = array.length;
            //console.log("loadScripts")
            this.loadScript(array[count], onComplete);

            function onComplete(result) {
                count++;
                //console.log(count, total)
                if (count == total) {
                    result.status = true;
                    result.message = "All scripts were loaded.";
                    if (callback) callback(result);
                } else {
                    if (GLoader.isExisted(array[count])) {
                        console.log("[GLoader] The script \"" + array[count] + "\" was existed -> Skipped.");
                    }
                    GLoader.loadScript(array[count], onComplete);
                }
            }
        },


        resources: {
            images: [],
            shaders: [],
        },

        sliceNameFromPath: function (_path) {
            // console.log(_path);
            var _from = _path.lastIndexOf("/") + 1;
            var _to = _path.lastIndexOf(".");
            var _id = _path.slice(_from, _to);
            var _id = _id.replace("-", "_");
            var _id = _id.replace(".", "_");
            // console.log(_id);
            return _id;
        },


        // load single photos
        // url: String, options: Object
        //options: {crossOrigin: "Anonymous"}}
        loadPhoto: function (url, options, callback, _id) {
            var img = new Image();
            img.id = _id;
            // console.log(_id);
            img.onload = function () {
                if (typeof callback != "undefined") callback(img);
            }
            img.onerror = function () {
                if (typeof callback != "undefined") callback(null);
            }

            options = options || {};

            img.crossOrigin = options.crossOrigin !== undefined ? options.crossOrigin : "Anonymous";

            img.src = url;
        },


        // load multiple photos
        // urls: Array, options: Object
        //options: {maxConnection: 5}}
        loadPhotos: function (urls, options, callback, _callbackOnLoad) {

            var array = urls;
            var count = 0;
            var total = array.length;
            var result = { status: false, message: "", percent: 0 };
            var photos = [];
            var currentConnection = 0;
            var currentLoadedId = 0;

            options = options || {};

            var maxConnection = options.maxConnection !== undefined ? options.maxConnection : 5;
            // console.log(total);

            if (total <= maxConnection) {

                for (var i = 0; i < total; i++) {
                    var urlImg = array[i];
                    onLoad(urlImg, i);
                }

            } else {
                onLoadPerConection();
            }


            function IncreaseCount() {

                count++;
                result.percent = (count / (total));
                result.message = count + "/" + total + " photos were loaded.";
                result.count = count;
                return count;
            }


            function onLoadPerConection() {

                currentConnection++;

                if (currentLoadedId < total) {

                    var url = array[currentLoadedId];

                    GLoader.loadPhoto(url, options, function (img) {
                        // console.log(img, img.width, img.height);

                        currentConnection--;
                        // url = array[count];
                        // var _id = GLoader.sliceNameFromPath(url);
                        // GLoader.resources.images[_id] = url;
                        IncreaseCount();

                        if (_callbackOnLoad) _callbackOnLoad(result, img);
                        if (count == total) {
                            onComplete()
                        } else {
                            onLoadPerConection();
                        };
                    }, currentLoadedId);
                    currentLoadedId++;

                    if (currentConnection < maxConnection) {
                        onLoadPerConection();
                    }
                }
            }


            function onComplete(url) {

                result.status = true;
                result.percent = (count / total);
                result.message = "All photos were loaded.";
                result.photos = photos;

                if (callback) callback(result);
            }


            function onLoad(url, id) {

                GLoader.loadPhoto(url, options, function (img) {

                    // var _id = GLoader.sliceNameFromPath(url);
                    // GLoader.resources.images[_id] = url;
                    // photos.push(url);
                    IncreaseCount();

                    if (_callbackOnLoad) _callbackOnLoad(result, img);
                    if (count == total) onComplete();

                }, id);
            }
        },



        loadFile: function (url, options, callback) {
            var result = { status: false, message: "" }
            $.get(url).done(function (content) {
                result.status = true;
                result.message = "File loaded";
                if (typeof callback != "undefined") callback(url);
            }).fail(function () {
                result.status = false;
                result.message = "error";
                console.log(result.message);
                if (typeof callback != "undefined") callback(result);
            })
        },

        //type: string
        // urls: Array, options: Object
        //options: {maxConnection: default is 5}}
        loadFiles: function (type, urls, options, callback, _callbackOnLoad) {

            if (GLoader.resources[type] == undefined) GLoader.resources[type] = [];

            var array = urls;
            var count = 0;
            var total = array.length;
            var result = { status: false, message: "", percent: 0 };
            var datas = [];

            options = options || {};

            var currentConnection = 0;
            var currentLoadedId = 0;
            var maxConnection = options.maxConnection !== undefined ? options.maxConnection : 5;

            if (total <= maxConnection) {

                for (var i = 0; i < total; i++) {
                    var url = array[i];
                    onLoad(url);
                }
            } else {
                onLoadPerConection();
            }

            function IncreaseCount() {

                count++;
                result.percent = (count / total);
                result.message = count + "/" + total + " files were loaded.";

                return count;
            }

            function onLoadPerConection() {

                currentConnection++;
                if (currentLoadedId < total) {

                    var url = array[currentLoadedId];

                    GLoader.loadFile(url, options, function () {

                        currentConnection--;
                        url = array[count];

                        var _id = GLoader.sliceNameFromPath(url);
                        GLoader.resources[type][_id] = url;
                        IncreaseCount();
                        if (_callbackOnLoad) _callbackOnLoad(result);

                        if (count == total) {
                            onComplete()
                        } else {
                            onLoadPerConection();
                        };
                    });

                    if (currentConnection < maxConnection) {
                        onLoadPerConection();
                    }
                }

                currentLoadedId++;
            }

            function onComplete(url) {

                result.status = true;
                // result.percent = (count / (total - 1));
                result.message = "All files were loaded.";
                result.datas = datas;

                if (callback) callback(result);
            }

            function onLoad(url) {
                GLoader.loadFile(url, options, function () {

                    var _id = GLoader.sliceNameFromPath(url);
                    GLoader.resources[type][_id] = url;
                    datas.push(url);
                    IncreaseCount();

                    if (_callbackOnLoad) _callbackOnLoad(result);
                    if (count == total) onComplete();
                });
            }
        },


        loadShader: function (url, callback) {
            var done = false;
            var fileType = (url.indexOf('.vert') > -1) ? "vert" : "frag";
            var result = { status: false, message: "" };
            var script = document.createElement('script');

            script.setAttribute('loader', 'GLoader');
            if (fileType == "vert") {
                script.setAttribute('type', 'x-shader/x-vertex');
                // script.setAttribute('src', url);
            } else {
                script.setAttribute('type', 'x-shader/x-fragment');
                // script.setAttribute('src', url);
            }

            // console.log(script);

            document.body.appendChild(script);

            handleLoad();

            function handleLoad() {
                $.ajax({
                    url: url,
                    async: false,
                    success: function (data) {
                        script.innerHTML = data;
                        done = true;

                        // // url = array[count];
                        var _id = GLoader.sliceNameFromPath(url);
                        GLoader.resources.shaders[_id] = url;

                        script.setAttribute('id', _id);

                        result.status = true;
                        result.message = "Shader was loaded successfully";

                        if (callback) callback(result);
                    },
                    error: handleError
                });

                // console.log("!!!!");

                // if (!done) {
                //     done = true;

                //     // url = array[count];
                //     var _id = GLoader.sliceNameFromPath(url);
                //     GLoader.resources.shaders[_id] = url;

                //     result.status = true;
                //     result.message = "Shader was loaded successfully";

                //     if (callback) callback(result);
                // }
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
                console.log("error");
                if (!done) {
                    done = true;
                    result.status = false;
                    result.message = "Failed to load script."
                    if (callback) callback(result);
                }
            }

        },


        loadShaders: function (array, callback, onLoad) {
            var result = { status: false, message: "" };
            var count = 0;
            var total = array.length;
            // console.log("loadShader")
            this.loadShader(array[count], onComplete);

            function onComplete(result) {
                count++;
                // console.log(count, total)
                if (count == total) {
                    result.status = true;
                    result.message = "All shaders were loaded.";
                    if (callback) callback(result);
                } else {
                    if (GLoader.isExisted(array[count])) {
                        console.log("[GLoader] The shaders \"" + array[count] + "\" was existed -> Skipped.");
                    }
                    GLoader.loadShader(array[count], onComplete);
                }

                if (onLoad) onLoad(result);
            }

        },


        // loadShader: function (url, callback) {
        //     var result = { status: false, message: "" }
        //     $.ajax(url).done(function (content) {
        //         result.status = true;
        //         result.message = "Shader loaded";
        //         if (typeof callback != "undefined") callback(url);
        //     }).fail(function () {
        //         result.status = false;
        //         result.message = "error";
        //         if (typeof callback != "undefined") callback(result);
        //     })
        // },


        // loadShaders: function (urls, callback, _callbackOnLoad) {
        //     var array = urls;
        //     var count = 0;
        //     var total = array.length;
        //     var result = { status: false, message: "" };
        //     result.percent = 0;
        //     var shaders = [];

        //     var currentURL = array[count];

        //     onLoad(result);

        //     function onComplete(url) {
        //         count++;
        //         result.percent = (count / total);
        //         // console.log(url);
        //         shaders.push(url);

        //         // console.log(result.percent);

        //         if (count == total) {
        //             result.status = true;
        //             result.message = "All shaders were loaded.";
        //             result.shaders = shaders;

        //             if (callback) callback(result);
        //         } else {
        //             onLoad(result);
        //         }
        //     }

        //     function onLoad(result) {
        //         result.message = count + "/" + total + " shaders were loaded.";
        //         currentURL = array[count];
        //         var _id = GLoader.sliceShaderNameFromPath(currentURL);
        //         GLoader.resources.shaders[_id] = currentURL;
        //         GLoader.loadShader(currentURL, onComplete);

        //         if (_callbackOnLoad) _callbackOnLoad(result);
        //     }

        // },


        //type: string
        // urls: Array, options: Object
        //options: {maxConnection: default is 10}}
        getFilePaths: function (type, urls, options, callback, _callbackOnLoad) {

            if (GLoader.resources[type] == undefined) GLoader.resources[type] = [];

            var array = urls;
            var count = 0;
            var total = array.length;
            var result = { status: false, message: "", percent: 0 };
            var datas = [];

            options = options || {};

            var currentConnection = 0;
            var currentLoadedId = 0;
            var maxConnection = options.maxConnection !== undefined ? options.maxConnection : 10;

            onLoadPerConection();

            function IncreaseCount() {

                count++;
                result.percent = (count / total);
                result.message = count + "/" + total + " files were loaded.";

                return count;
            }

            function onLoadPerConection() {

                currentConnection++;
                if (currentLoadedId < total) {
                    // console.log(currentLoadedId + " _ " + total);

                    var url = array[currentLoadedId];

                    currentConnection--;
                    url = array[count];

                    var _id = GLoader.sliceNameFromPath(url);
                    GLoader.resources[type][_id] = url;
                    IncreaseCount();
                    currentLoadedId++;

                    if (_callbackOnLoad) _callbackOnLoad(result);

                    if (count == total) {
                        onComplete()
                    } else {
                        onLoadPerConection();
                    };

                    if (currentConnection < maxConnection) {
                        onLoadPerConection();
                    }
                }

            }

            function onComplete(url) {

                result.status = true;
                // result.percent = (count / (total - 1));
                result.message = "All files were loaded.";
                result.datas = datas;

                if (callback) callback(result);
            }

        },


        sliceShaderNameFromPath: function (_path) {
            var _from = _path.lastIndexOf("/") + 1;
            var _to = _path.indexOf(".fragment");
            var _id = _path.slice(_from, _to);
            var _id = _id.replace("-", "");
            return _id;
        }




    }


    var TLoader = {
        //

        loadFile: function (url, options) {

            options = options != undefined ? options : {};

            var onProgress = options.hasOwnProperty("onProgress") ? options['onProgress'] : null;
            var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
            var onError = options.hasOwnProperty("onError") ? options['onError'] : null;
            var responseType = options.hasOwnProperty("responseType") ? options['responseType'] : 'text';
            // var onCheckConnection = options.hasOwnProperty("onCheckConnection") ? options['onCheckConnection'] : null;

            var req = new XMLHttpRequest();
            req.open('GET', url, true);
            // req.responseType = 'blob';
            // req.responseType = 'text';
            req.responseType = responseType;

            var downloaded = 0;
            // var fastConnection = true;

            req.onprogress = function (e) {
                var progress = e.loaded / e.total;
                // console.log(e.loaded);
                downloaded = e.loaded;
                // console.log(progress);
                if (onProgress != null) onProgress(progress);
            };


            req.onreadystatechange = function () {
                // console.log(req.readyState);

                if (req.readyState == 2) {
                    // response headers received
                    // var sec = 1;

                    // var kps = 0;

                    // if (fastConnection) {
                    //     TweenMax.delayedCall(sec, function () {
                    //         kps = (downloaded / sec / 1024);
                    //         // swal.fire("" + downloaded + " - " + kps);

                    //         if (kps < 500) {
                    //             pInGame.SPEED = pInGame.LOW_2MB;
                    //             req.abort();
                    //             pInGame.startLoadedVideoBeforePlay();
                    //         }
                    //     })
                    // }
                }

                if (req.readyState == 3) {
                    // loading
                }
                if (req.readyState == 4) {
                    // request finished
                }
            };

            req.onload = function () {

                if (req.readyState === req.DONE) {
                    if (req.status === 200) {
                        // console.log(req.response);
                        if (onComplete != null) onComplete(req.response);
                        return;
                    }
                }

                if (onError != null) onError('Network error ' + this.status);

            };
            // req.onload = function () {
            //     // Onload is triggered even on 404
            //     // so we need to check the status code
            //     console.log("onload");
            //     if (this.status === 200) {
            //         var blob = this.response;
            //         var vid = URL.createObjectURL(blob);
            //         console.log(req.responseText);
            //         // Video is now downloaded
            //         //   video.src = vid;
            //         if (onComplete != null) onComplete(blob);
            //     } else {
            //         if (onError != null) onError('Network error ' + this.status);
            //     }
            // };

            req.onerror = function (err) {
                // Error
                console.log(err);
                if (onError != null) onError('Loading error');
            };

            req.send();
        },

        loadMultiFile: function (urls, options) {

            options = options != undefined ? options : {};

            var onProgress = options.hasOwnProperty("onProgress") ? options['onProgress'] : null;
            var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
            var onError = options.hasOwnProperty("onError") ? options['onError'] : null;
            var maxQueue = options.hasOwnProperty("maxQueue") ? options['maxQueue'] : 5;

            var currentQueueCount = 0
                , currentIdLoaded = 0;

            if (urls.length == 0 || urls == null) {
                onComplete();
            }

            if (urls.length < maxQueue) {
                //length < maxQueue
                for (let i = 0; i < urls.length; i++) {
                    const item = urls[i];
                    this.loadFile(item,
                        {
                            onProgress: onProgress,
                            onError: onError,
                            onComplete: onComplete,
                        });
                }
            } else {
                //load per [maxQueue] each
                loadedInQueue();
            }

            function loadedInQueue() {
                //
                if (currentIdLoaded < urls.length) {

                    if (currentQueueCount < maxQueue) {

                        currentQueueCount++;

                        var currentItemLoaded = urls[currentIdLoaded];
                        currentIdLoaded++;

                        TLoader.loadFile(currentItemLoaded,
                            {
                                onComplete: function (blob) {

                                    currentQueueCount--;

                                    if (currentIdLoaded >= urls.length && currentQueueCount == 0) {
                                        _onComplete();
                                    } else {
                                        loadedInQueue();
                                    };
                                },
                                onProgress: _onProgress,
                                onError: _onError,
                            });

                        loadedInQueue();
                    }
                }
            }


            function _onProgress(progress) {
                var precent = ((currentIdLoaded - 1) / urls.length) + (progress * (1 / urls.length))
                if (onProgress) onProgress(precent);
            }

            function _onError(errorString) {
                if (onError) onError(errorString);
            }

            function _onComplete() {
                if (onComplete) onComplete();
            }


        },

        showPopupPoorConnection: function () {
            swal.fire({
                title: "Kết nối của bạn không ổn định",
                text: 'Vui lòng tải lại trang',
                type: 'warning',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'Tải lại trang!',
                showCancelButton: true,
                cancelButtonText: 'Về trang chủ!',
                cancelButtonColor: '#FF9500',
            }).then((result) => {
                if (result.value)
                    location.reload();
                else
                    location.replace(basePath)
            })
        },
    }
    //end TLOADER

    var tBrowser = {

        deleteAllCookies: function () {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i];
                var eqPos = cookie.indexOf("=");
                var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        },

        setCookie: function (cname, cvalue, exdays) {
            if (exdays == undefined) exdays = 999;
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        },

        getCookie: function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },

        hasCookie: function (_name) {
            var _str = tBrowser.getCookie(_name);
            if (_str != "") {
                return true;
            } else {
                return false;
            }
        },

        isMobile: function () {
            if (navigator.userAgent.match(/Android/i)
                || navigator.userAgent.match(/webOS/i)
                || navigator.userAgent.match(/iPhone/i)
                || navigator.userAgent.match(/iPad/i)
                || navigator.userAgent.match(/iPod/i)
                || navigator.userAgent.match(/BlackBerry/i)
                || navigator.userAgent.match(/Windows Phone/i)
            ) {
                return true;
            }
            else {
                return false;
            }
        },

        isSupportWebGL: function () {

            // return Detector.webgl();
            var Detector = {
                canvas: !!window.CanvasRenderingContext2D,
                webgl: (function () {
                    // 
                    try {

                        var canvas = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));

                    } catch (e) {

                        return false;

                    }

                })(),
                workers: !!window.Worker,
                fileapi: window.File && window.FileReader && window.FileList && window.Blob,

                getWebGLErrorMessage: function () {

                    var element = document.createElement('div');
                    element.id = 'webgl-error-message';
                    element.style.fontFamily = 'monospace';
                    element.style.fontSize = '13px';
                    element.style.fontWeight = 'normal';
                    element.style.textAlign = 'center';
                    element.style.background = '#fff';
                    element.style.color = '#000';
                    element.style.padding = '1.5em';
                    element.style.width = '400px';
                    element.style.margin = '5em auto 0';

                    if (!this.webgl) {

                        element.innerHTML = window.WebGLRenderingContext ? [
                            'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
                            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                        ].join('\n') : [
                            'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
                            'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.'
                        ].join('\n');

                    }

                    return element;

                },

                addGetWebGLMessage: function (parameters) {

                    var parent, id, element;

                    parameters = parameters || {};

                    parent = parameters.parent !== undefined ? parameters.parent : document.body;
                    id = parameters.id !== undefined ? parameters.id : 'oldie';

                    element = Detector.getWebGLErrorMessage();
                    element.id = id;

                    parent.appendChild(element);

                },

            };

            return Detector.webgl;
        },


        getUrlParameters: function (parameter, staticURL, decode) {

            staticURL = staticURL == undefined ? window.location : staticURL;
            var currLocation = (staticURL.length) ? staticURL : window.location.search;

            if (currLocation.split("?").length < 2)
                return "";

            var parArr = currLocation.split("?")[1].split("&"),
                returnBool = true;

            for (var i = 0; i < parArr.length; i++) {
                var parr = parArr[i].split("=");
                if (parr[0] == parameter) {
                    return (decode) ? decodeURIComponent(parr[1]) : parr[1];
                    returnBool = true;
                } else {
                    returnBool = false;
                }
            }

            if (!returnBool) return false;
        },



        checkOS: function (option) {
            option = option != undefined ? option : {};

            var callback = option.hasOwnProperty("callback") ? option.callback : null;

            if (typeof window.deviceInfo == "undefined") {
                var unknown = '-';

                // screen
                var screenSize = '';
                if (screen.width) {
                    var width = (screen.width) ? screen.width : '';
                    var height = (screen.height) ? screen.height : '';
                    screenSize += '' + width + " x " + height;
                }

                // browser
                var nVer = navigator.appVersion;
                var nAgt = navigator.userAgent;
                var browser = navigator.appName;
                var version = '' + parseFloat(navigator.appVersion);
                var majorVersion = parseInt(navigator.appVersion, 10);
                var nameOffset, verOffset, ix;

                // Opera
                if ((verOffset = nAgt.indexOf('Opera')) != -1) {
                    browser = 'Opera';
                    version = nAgt.substring(verOffset + 6);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                }
                // Opera Next
                if ((verOffset = nAgt.indexOf('OPR')) != -1) {
                    browser = 'Opera';
                    version = nAgt.substring(verOffset + 4);
                }
                // Edge
                else if ((verOffset = nAgt.indexOf('Edge')) != -1) {
                    browser = 'Microsoft Edge';
                    version = nAgt.substring(verOffset + 5);
                }
                // MSIE
                else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
                    browser = 'Microsoft Internet Explorer';
                    version = nAgt.substring(verOffset + 5);
                }
                // Chrome
                else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
                    browser = 'Chrome';
                    version = nAgt.substring(verOffset + 7);
                }
                // Safari
                else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
                    browser = 'Safari';
                    version = nAgt.substring(verOffset + 7);
                    if ((verOffset = nAgt.indexOf('Version')) != -1) {
                        version = nAgt.substring(verOffset + 8);
                    }
                }
                // Firefox
                else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
                    browser = 'Firefox';
                    version = nAgt.substring(verOffset + 8);
                }
                // MSIE 11+
                else if (nAgt.indexOf('Trident/') != -1) {
                    browser = 'Microsoft Internet Explorer';
                    version = nAgt.substring(nAgt.indexOf('rv:') + 3);
                }
                // Other browsers
                else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
                    browser = nAgt.substring(nameOffset, verOffset);
                    version = nAgt.substring(verOffset + 1);
                    if (browser.toLowerCase() == browser.toUpperCase()) {
                        browser = navigator.appName;
                    }
                }
                // trim the version string
                if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
                if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
                if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

                majorVersion = parseInt('' + version, 10);
                if (isNaN(majorVersion)) {
                    version = '' + parseFloat(navigator.appVersion);
                    majorVersion = parseInt(navigator.appVersion, 10);
                }

                // mobile version
                var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

                // cookie
                var cookieEnabled = (navigator.cookieEnabled) ? true : false;

                if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
                    document.cookie = 'testcookie';
                    cookieEnabled = (document.cookie.indexOf('testcookie') != -1) ? true : false;
                }

                // system
                var os = unknown;
                var clientStrings = [
                    { s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/ },
                    { s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/ },
                    { s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/ },
                    { s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/ },
                    { s: 'Windows Vista', r: /Windows NT 6.0/ },
                    { s: 'Windows Server 2003', r: /Windows NT 5.2/ },
                    { s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/ },
                    { s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/ },
                    { s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/ },
                    { s: 'Windows 98', r: /(Windows 98|Win98)/ },
                    { s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/ },
                    { s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/ },
                    { s: 'Windows CE', r: /Windows CE/ },
                    { s: 'Windows 3.11', r: /Win16/ },
                    { s: 'Android', r: /Android/ },
                    { s: 'Open BSD', r: /OpenBSD/ },
                    { s: 'Sun OS', r: /SunOS/ },
                    { s: 'Linux', r: /(Linux|X11)/ },
                    { s: 'iOS', r: /(iPhone|iPad|iPod)/ },
                    { s: 'Mac OS X', r: /Mac OS X/ },
                    { s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/ },
                    { s: 'QNX', r: /QNX/ },
                    { s: 'UNIX', r: /UNIX/ },
                    { s: 'BeOS', r: /BeOS/ },
                    { s: 'OS/2', r: /OS\/2/ },
                    { s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/ }
                ];
                for (var id in clientStrings) {
                    var cs = clientStrings[id];
                    if (cs.r.test(nAgt)) {
                        os = cs.s;
                        break;
                    }
                }

                var osVersion = unknown;

                if (/Windows/.test(os)) {
                    osVersion = /Windows (.*)/.exec(os)[1];
                    os = 'Windows';
                }

                switch (os) {
                    case 'Mac OS X':
                        osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'Android':
                        osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
                        break;

                    case 'iOS':
                        osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
                        osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
                        break;
                }

                // flash (you'll need to include swfobject)
                /* script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js" */
                var flashVersion = 'no check';
                if (typeof swfobject != 'undefined') {
                    var fv = swfobject.getFlashPlayerVersion();
                    if (fv.major > 0) {
                        flashVersion = fv.major + '.' + fv.minor + ' r' + fv.release;
                    }
                    else {
                        flashVersion = unknown;
                    }
                }


                window.deviceInfo = {
                    screen: screenSize,
                    browser: browser,
                    browserVersion: version,
                    browserMajorVersion: majorVersion,
                    mobile: mobile,
                    os: os,
                    osVersion: osVersion,
                    cookies: cookieEnabled,
                    flashVersion: flashVersion
                };
            }

            if (callback != null) callback(window.deviceInfo);
        },

        SAFARI: "safari",
        CHROME: "chrome",
        FIREFOX: "firefox",
        OPERA: "opera",
        WEBVIEW: "webview",

        detectBrowser_Ios: function (option) {
            // Only detect safari, chrome, firefox, webview
            var _this = this;

            option = typeof option != "undefined" ? option : {};

            var callback = option.hasOwnProperty("callback") ? option.callback : {};

            var callbackWebview = callback.hasOwnProperty("webview") ? callback.webview : null;
            var callbackSafari = callback.hasOwnProperty("safari") ? callback.safari : null;
            var callbackChrome = callback.hasOwnProperty("chrome") ? callback.chrome : null;
            var callbackFirefox = callback.hasOwnProperty("firefox") ? callback.firefox : null;
            // var callbackOpera = callback.hasOwnProperty("opera") ? callback.opera : null;


            if (typeof window.deviceInfo == "undefined") TJS.Browser.checkOS();

            var deviceInfo = window.deviceInfo;

            // var os = deviceInfo.os.toLowerCase();
            // var osVersion = deviceInfo.osVersion;
            var browser = deviceInfo.browser.toLowerCase();
            var browserMajorVersion = deviceInfo.browserMajorVersion;
            var userAgent = navigator.userAgent.toLowerCase();

            if (browser.includes(_this.SAFARI)) {
                //not sure safari
                if (browserMajorVersion > "20") {
                    //It's not safari !! It's Owl Donkey !!!
                    if (userAgent.includes("fxios")) {
                        //firefox

                        if (callbackFirefox != null) callbackFirefox();

                        return _this.FIREFOX;
                    } else if (userAgent.includes("crios")) {
                        //chrome
                        if (callbackChrome != null) callbackChrome();

                        return _this.CHROME;
                    }
                } else {
                    //Safari real
                    if (callbackSafari != null) callbackSafari();

                    return _this.SAFARI;
                }
            } else {
                //webview
                if (callbackWebview != null) callbackWebview();

                return _this.WEBVIEW;
            }

            return _this.WEBVIEW;
        },

        detectBrowser_Android: function (option) {
            var _this = this;

            option = typeof option != "undefined" ? option : {};

            var callback = option.hasOwnProperty("callback") ? option.callback : {};

            var callbackWebview = callback.hasOwnProperty("webview") ? callback.webview : null;
            // var callbackSafari = callback.hasOwnProperty("safari") ? callback.safari : null;
            var callbackChrome = callback.hasOwnProperty("chrome") ? callback.chrome : null;
            var callbackFirefox = callback.hasOwnProperty("firefox") ? callback.firefox : null;
            var callbackOpera = callback.hasOwnProperty("opera") ? callback.opera : null;

            if (typeof window.deviceInfo == "undefined") TJS.Browser.checkOS();

            var deviceInfo = window.deviceInfo;

            // var os = deviceInfo.os.toLowerCase();
            // var osVersion = deviceInfo.osVersion;
            var browser = deviceInfo.browser.toLowerCase();
            var browserMajorVersion = deviceInfo.browserMajorVersion;
            var userAgent = navigator.userAgent.toLowerCase();

            if (browser.includes("firefox")) {
                //firefox

                if (callbackFirefox != null) callbackFirefox();

                return _this.FIREFOX;

            } else if (browser.includes("opera")) {
                //opera
                if (callbackOpera != null) callbackOpera();

                return _this.OPERA;

            } else if (browser.includes("chrome")) {
                //not sure chrome

                if (userAgent.includes("; wv")) {
                    //webview
                    if (callbackWebview != null) callbackWebview();

                    return _this.WEBVIEW;

                } else {
                    //chrome
                    if (callbackChrome != null) callbackChrome();

                    return _this.CHROME;

                }
            }


            return _this.WEBVIEW;
        },

        canOpenCamera: function () {
            var _this = this;

            if (typeof window.deviceInfo == "undefined")
                TJS.Browser.checkOS();

            // function callback(window.deviceInfo) {
            var os = window.deviceInfo.os.toLowerCase();
            var osVersion = window.deviceInfo.osVersion;
            var browserMajorVersion = window.deviceInfo.browserMajorVersion;

            if (window.deviceInfo.mobile) {
                if (os.includes("ios")) {
                    var browser = TJS.Browser.detectBrowser_Ios();
                    var minOSVersion = "11";

                    if (minOSVersion <= osVersion) {

                        switch (browser) {
                            case TJS.Browser.SAFARI:

                                return true;

                            default:
                                return false;
                        }

                    } else {
                        //Version OS thấp quá, update đi em, make Steve Jobs great again !
                        return false;
                    }
                } else if (os.includes("android")) {
                    var browser = TJS.Browser.detectBrowser_Android();

                    if (browser == TJS.Browser.CHROME) {
                        if (browserMajorVersion >= 52) {
                            //ok
                            return true;
                        } else {
                            return false;
                        }
                    } else if (browser == TJS.Browser.FIREFOX) {
                        if (browserMajorVersion >= 36) {
                            //ok
                            return true;
                        } else {
                            return false;
                        }
                    } else if (browser == TJS.Browser.OPERA) {
                        if (browserMajorVersion >= 40) {
                            //ok
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        //"Vui lòng dùng trình duyệt Chrome version 52, Firefox version 36 hoặc Opera version 40!"
                        return false;
                    }
                } else {
                    //Hệ điều hành không hỗ trợ, bán điện thoại đi e
                    return false;
                }
            }

            return false;
        },


        restoreConsole: function (params) {
            //<iframe> element
            var iframe = document.createElement("iframe");
            //Hide it somewhere
            iframe.style.position = "fixed";
            iframe.style.height = iframe.style.width = "1px";
            iframe.style.top = iframe.style.left = "-5px";
            iframe.style.display = "none";
            //No src to prevent loading some data
            iframe.src = "about: blank";
            //Needs append to work
            document.body.appendChild(iframe);
            //Get the inner console
            window.console = {};
            window.console = iframe.contentWindow.console;

            // delete iframe;
        },

        removeConsole: function () {
            // console.clear()
            for (var i in console) {
                console[i] = function () { };
            }
        },

        showCredit: function () {
            console.log("Developed by Digitop | https://wearetopgroup.com/");
        }

    };


    var tShaders = {};

    var Webcam = function (option) {
        option = typeof option == "undefined" ? option : {};



    };



    var THREE = {
        rotateAroundObjectAxis: function (object, axis, radians) {
            var rotationMatrix = new THREE.Matrix4();

            rotationMatrix.makeRotationAxis(axis.normalize(), radians);
            object.matrix.multiply(rotationMatrix);
            object.rotation.setFromRotationMatrix(object.matrix);

        },


        rotateAroundWorldAxis: function (object, axis, radians) {

            var rotationMatrix = new THREE.Matrix4();

            rotationMatrix.makeRotationAxis(axis.normalize(), radians);
            rotationMatrix.multiply(object.matrix);                       // pre-multiply
            object.matrix = rotationMatrix;
            object.rotation.setFromRotationMatrix(object.matrix);
        },


        makeTextSprite: function (message, parameters) {
            if (parameters === undefined) parameters = {};

            var fontface = parameters.hasOwnProperty("fontface") ?
                parameters["fontface"] : "MontserratMedium";

            var fontsize = parameters.hasOwnProperty("fontsize") ?
                parameters["fontsize"] : 28;

            var borderThickness = parameters.hasOwnProperty("borderThickness") ?
                parameters["borderThickness"] : 0;

            var borderColor = parameters.hasOwnProperty("borderColor") ?
                parameters["borderColor"] : { r: 255, g: 0, b: 0, a: 1.0 };

            var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
                parameters["backgroundColor"] : { r: 255, g: 255, b: 255, a: 1.0 };


            var canvasWidth = parameters.hasOwnProperty("canvasWidth") ?
                parameters["canvasWidth"] : 32;

            var spriteScl = parameters.hasOwnProperty("spriteScl") ?
                parameters["spriteScl"] : .6;


            var canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasWidth;
            var context = canvas.getContext('2d');
            context.font = "" + fontsize + "px " + fontface;
            // context.fillStyle = "rgba(0, 0, 200, 0.2)";
            // context.fillRect(0, 0, canvas.width, canvas.height);
            // get size data (height depends only on font size)
            var metrics = context.measureText(message);

            // var textWidth = vi_char.includes(message) ? metrics.width * .6 : metrics.width;
            var textWidth = metrics.width
            // //console.log(message, textWidth);
            // background color
            context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
                + backgroundColor.b + "," + backgroundColor.a + ")";
            // border color
            context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
                + borderColor.b + "," + borderColor.a + ")";

            context.lineWidth = borderThickness;

            // text color
            context.fillStyle = "rgba(255, 84, 23, 1.0)";

            context.textAlign = 'center';
            // context.fillText(message, borderThickness, fontsize + borderThickness);
            context.fillText(message, canvas.width / 2, fontsize + borderThickness);

            // canvas contents will be used for a texture
            var texture = new THREE.Texture(canvas)
            texture.needsUpdate = true;

            var spriteMaterial = new THREE.SpriteMaterial(
                { map: texture });
            var sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(canvas.width / 10 * 2, canvas.height / 10 * 2, 1.0);
            sprite.width = (textWidth / sprite.scale.x) * spriteScl;

            return sprite;
        }

    };


    var Camera = {

        ftpBridgeToSafari: "ftp://dev3.digitop.vn/bridge.html",

        minChrome: '<b>Chrome</b>',
        minFirefox: '<b>Firefox</b>',
        minOpera: '<b>Opera</b>',
        brands: '<b>Samsung</b>',
        veTrangChu: 'Về <b>Trang chủ</b>!',
        skip: '<b>Bỏ qua!</b>!',

        direct_link: location.host + location.pathname + "?redirect_src=inappwebview",

        chromeTextTag: function () { return `<a href="#" style="color: white;">Mở Chrome!</a>` },
        firefoxTextTag: function () { return `<a href="#" style="color: white;">Mở Firefox!</a>` },
        operaTextTag: function () { return `<a href="#" style="color: white;">Mở Opera!</a>` },

        openChromeLink: function () { return `intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=com.android.chrome;end` },
        openFirefoxLink: function () { return `intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=org.mozilla.firefox;end` },
        openOperaLink: function () { return `intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=com.opera.browser;end` },

        // openChromeLink: "intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=com.android.chrome;end",
        // openFirefoxLink: "intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=com.android.chrome;end",
        // openOperaLink: "intent://` + TJS.Camera.direct_link + `/#Intent;scheme=https;package=com.android.chrome;end",

        checkErrorPermissionCamera: function (options) {
            var _this = this;

            options = typeof (options) != "undefined" ? options : {};

            var onCancelCallback = options.hasOwnProperty("onCancelCallback") ? options['onCancelCallback'] : null;

            if (typeof window.deviceInfo == "undefined")
                TJS.Browser.checkOS();

            var deviceInfo = window.deviceInfo;

            var os = deviceInfo.os.toLowerCase();
            var osVersion = deviceInfo.osVersion;
            var browser = deviceInfo.browser.toLowerCase();
            var browserMajorVersion = deviceInfo.browserMajorVersion;
            var userAgent = navigator.userAgent.toLowerCase();

            // swal.fire({
            //     html: " " + (browser.includes("chrome") && !userAgent.includes("zalo")),
            // })

            if (deviceInfo.mobile) {
                if (os.includes("ios")) {
                    var minOSVersion = "11";

                    if (minOSVersion <= osVersion) {
                        if (browser.includes("safari")) {

                            TJS.Browser.detectBrowser_Ios({
                                callback: {
                                    safari: function () { _this.popupCapQuyenDeTraiNghiem(); },
                                    webview: function () { _this.popupUseSafari({ onCancelCallback: onCancelCallback }); },
                                    chrome: function () { _this.popupUseSafari({ onCancelCallback: onCancelCallback }); },
                                    firefox: function () { _this.popupUseSafari({ onCancelCallback: onCancelCallback }); },
                                }
                            })
                        } else {
                            //Truy cập bằng safari nha gái, bấm zô nút ở dưới đi đồ làm biếng !
                            _this.popupUseSafari({ onCancelCallback: onCancelCallback });
                        }
                    } else {
                        //Version OS thấp quá, update đi em, make Steve Jobs great again !
                        _this.popupOsNotSupport();
                    }
                } else if (os.includes("android")) {


                    TJS.Browser.detectBrowser_Android({
                        callback: {
                            webview: function () {
                                //"Vui lòng dùng trình duyệt Chrome version 52, Firefox version 36 hoặc Opera version 40!"
                                if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'no_support_webRTC');

                                _this.showPopup({
                                    html: "<b>Rất tiếc, trình duyệt này chưa hỗ trợ.</b> Vui lòng sử dụng trình duyệt " + _this.minChrome + " để có thể trải nghiệm cùng " + _this.brands + "!" +
                                        `<br>
                                        <br> <button type="button" role="button" tabindex="1" class="swal2-styled customSwalBtn-confirm" style="background-color: #3085d6">` + _this.chromeTextTag() + `</button>`,
                                    //<br> <button type="button" role="button" tabindex="2" class="swal2-styled customSwalBtn-cancel" style="background-color: #cccccc">` + _this.skip + `</button>`,
                                    type: 'warning',
                                    teeCancelCallback: function () {

                                        if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_redirect_from_other_browser', 'cancel');
                                        if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');

                                        // window.open(basePath, "_self");
                                        if (onCancelCallback != null) onCancelCallback();

                                        swal.close();

                                    },
                                    teeConfirmCallback: function (button) {
                                        if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_redirect_from_other_browser', 'success');
                                        if (typeof trackingClickGA != "undefined") trackingClickGA('ChangeBrowser', 'ChangeBrowser');

                                        var url = "";

                                        if (typeof $(button).find("a").html() != "undefined") {

                                            var _html = $(button).find("a").html().toLowerCase();
                                            var _browser = window.deviceInfo.browser.toLowerCase();

                                            if (_html.includes("chrome")) {

                                                if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "chrome");
                                                url = _this.openChromeLink();

                                            } else if (_html.includes("firefox")) {

                                                if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "firefox");
                                                url = _this.openFirefoxLink();

                                            } else if (_html.includes("opera")) {

                                                if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "opera");
                                                url = _this.openOperaLink();

                                            }
                                            // else if (_html.includes("safari")) {
                                            //     if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "safari");
                                            // } else if (_html.includes("webview")) {
                                            //     if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "webview");
                                            // }
                                        };
                                        // alert("" + 'tee_browser' + 'redirect_' + _browser + '_' + "safari")
                                        window.open(url, "_self");
                                    },
                                })
                            },
                            chrome: function () {
                                if (browserMajorVersion >= 52) {
                                    //ok
                                    _this.popupCapQuyenDeTraiNghiem();
                                } else {
                                    _this.popupUpgradeBrowser();
                                }
                            },
                            firefox: function () {
                                if (browserMajorVersion >= 36) {
                                    //ok
                                    _this.popupCapQuyenDeTraiNghiem();
                                } else {
                                    _this.popupUpgradeBrowser();
                                }
                            },
                            opera: function () {
                                if (browserMajorVersion >= 40) {
                                    //ok
                                    _this.popupCapQuyenDeTraiNghiem();
                                } else {
                                    _this.popupUpgradeBrowser();
                                }
                            },
                        }
                    })

                } else {
                    //Hệ điều hành không hỗ trợ, bán điện thoại đi e
                    _this.popupOsNotSupport();
                }
            }


        },

        popupCapQuyenDeTraiNghiem: function () {
            var _this = this;

            if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_get_camera_permission', 'error');

            swal.fire({
                html: "Vui lòng cung cấp <b>Quyền truy cập Camera</b> để có thể trải nghiệm cùng " + _this.brands + "!",
                type: 'warning',
                allowOutsideClick: false,
                showCancelButton: true,
                cancelButtonText: '<a href="#" style="color: white;"">Về <b>Trang chủ</b>!</a> ',
                confirmButtonText: "Tải lại trang!"
            }).then(function (result) {
                if (result.value) {
                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'tai-lai-trang');
                    location.reload();
                } else {

                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');
                    window.open(basePath, "_self");

                }
            })
        },

        popupUseSafari: function (options) {
            var _this = this;

            if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_device', 'not_support_get_camera');
            if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'no_support_webRTC');

            options = typeof (options) != "undefined" ? options : {};

            var onCancelCallback = options.hasOwnProperty("onCancelCallback") ? options['onCancelCallback'] : null;

            swal.fire({
                html: "<b>Rất tiếc, trình duyệt trên chương trình này chưa hỗ trợ.</b> Vui lòng sử dụng trình duyệt khác để có thể trải nghiệm!",
                type: 'warning',
                allowOutsideClick: false,
                confirmButtonText: '<a href="#" style="color: white;"">Mở Safari!</a> ',
                showCancelButton: true,
                cancelButtonText: '<a href="#" style="color: white;"">' + _this.skip + '</a> ',
            }).then(function (result) {
                if (result.value) {
                    // if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'tai-lai-trang');
                    if (typeof trackingClickGA != "undefined") trackingClickGA('ChangeBrowser', 'ChangeBrowser');

                    // var _browser = window.deviceInfo.browser.toLowerCase();
                    // if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'redirect_' + _browser + '_' + "safari");

                    window.open(_this.ftpBridgeToSafari + "?url=" + location.href);
                    // window.open(_this.ftpBridgeToSafari + "?url=" + location.href);

                } else {
                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_redirect_from_other_browser', 'cancel');
                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');

                    swal.close();
                    if (onCancelCallback != null) onCancelCallback();
                    // window.open(basePath, "_self");
                }
            });;
        },

        popupOsNotSupport: function () {
            var _this = this;

            if (typeof gaTrackingClick != "undefined") gaTrackingClick('request_permission', 'no_support_camera');
            if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_device', 'not_support_get_camera');

            _this.showPopup({
                html: "<b>Rất tiếc, hệ điều hành này chưa hỗ trợ.</b> Vui lòng sử dụng <b>iOS</b> hoặc <b>Android</b> để có thể trải nghiệm cùng " + _this.brands + "!"
                    + `<br><br>
                   <button type="button" role="button" tabindex="1" class="swal2-styled customSwalBtn-confirm"><a href="#" style="color: white;"">` + _this.veTrangChu + `</a></button>
                `,
                type: 'warning',
                // confirmButtonText: _this.veTrangChu,
                teeConfirmCallback: function () {
                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');
                    window.open(basePath, "_self");
                    // alert("!!");
                },
            })
        },

        popupUpgradeBrowser: function () {
            var _this = this;

            if (typeof gaTrackingClick != "undefined") gaTrackingClick('tee_browser', 'low_version');

            var upgradeBrowserText = "<b>Rất tiếc, phiên bản trình duyệt này chưa hỗ trợ.</b> Vui lòng nâng cấp phiên bản trình duyệt mới nhất để có thể trải nghiệm cùng " + _this.brands + "!"

            _this.showPopup({
                html: upgradeBrowserText +
                    `<br><br> <button type="button" role="button" tabindex="1" class="swal2-styled customSwalBtn-confirm><a href="#" style="color: white;"">` + _this.veTrangChu + `</a></button>`,
                teeConfirmCallback: function () {
                    if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');
                    window.open(basePath, "_self");
                },
            })
        },

        showPopup: function (option) {
            var _this = this;

            option = option != undefined ? option : {};

            var _class = _this.class = "C" + TJS.Math.generateUUID();

            var title = option.hasOwnProperty("title") ? option.title : "";
            var html = option.hasOwnProperty("html") ? option.html.replace("customSwalBtn-confirm", "customSwalBtn-confirm " + _class).replace("customSwalBtn-cancel " + _class) : "Vui lòng cấp quyền truy cập camera để có thể trải nghiệm cùng " + _this.brands + "!";
            var teeConfirmCallback = option.hasOwnProperty("teeConfirmCallback") ? option.teeConfirmCallback : null;
            var teeCancelCallback = option.hasOwnProperty("teeCancelCallback") ? option.teeCancelCallback : null;

            swal.fire({
                title: title,
                html: html,
                type: 'warning',
                allowOutsideClick: false,
                showConfirmButton: false,
            });

            $(".customSwalBtn-confirm," + _class).on("click", function () {
                var __this = this;
                if (teeConfirmCallback != null) teeConfirmCallback(__this);
            })

            $(".customSwalBtn-cancel," + _class).on("click", function () {
                // if (typeof gaTrackingClick != "undefined") gaTrackingClick('popup', 'cta-trang-chu');
                var __this = this;
                if (teeCancelCallback != null) teeCancelCallback(__this);
            })

        },

    };


    var Sec = {
        set: function (salt) {
            var key = "ffu#)cdk5e6RZM@b!9x@Q5A3NYjV.H)UNT7+F$)#_)UyYaLOdNnlzrEVG4Iz-@af";
            var hash = CryptoJS.SHA256(salt + key);
            return hash.toString(CryptoJS.enc.Base64);
        },
        check: function (salt, hash) {
            return this.set(salt) == hash;
        },
    }
    exports.Sec = Sec;

    // function getRandomChild(target) {
    //     var id = TJS.Math.randInt(0, target.length - 1)
    //     return target[id];

    // };
    // exports.getRandomChild = getRandomChild;



    var bundleJs = {
        readJs: function (path, options) {
            options = typeof options == "undefined" ? {} : options;
            var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null
                , onError = options.hasOwnProperty("onError") ? options['onError'] : null;

            if (typeof path == "undefined") {
                if (onComplete) onComplete();
                return;
            }

            TJS.Loader.loadFile(path, {
                onComplete: function (data) {
                    if (onComplete) onComplete(data);
                },
                onError: function (err) {
                    if (onError) onError(err);
                }
            });

        },

        writeToFile: function (string, fileName) {
            fileName = typeof fileName == "undefined" ? "fileName" : fileName;
            var _type = "text/plain;charset=utf-8";

            var blob = new Blob([], { type: _type });
            blob = new Blob([blob, " " + string], { type: _type });

            var url = URL.createObjectURL(blob);

            var a = document.createElement('a');
            a.download = `${fileName}.txt`;
            a.href = url;
            a.textContent = "Download backup.txt";
            a.click();
        },

        writeArrayJsToFile: function (arrPath, fileName) {

            fileName = typeof fileName == "undefined" ? "fileName" : fileName;

            var currentIndex = 0;

            var _type = "text/plain;charset=utf-8";

            var blob = new Blob([], { type: _type });
            var opening = '//This file include:\n';
            blob = new Blob([blob, opening], { type: _type });

            for (var i = 0; i < arrPath.length; i++) {
                blob = new Blob([blob, `//${arrPath[i]} \n`], { type: _type });
            }

            bundleJs.readJs(arrPath[currentIndex], {
                onComplete: onLoad,
                onError: onError
            });

            function onError(er) {
                console.log(er);
            }

            function onLoad(data) {
                currentIndex++;
                if (currentIndex <= arrPath.length) {
                    // var firstChar = '';
                    // if (currentIndex - 1 != 0)
                    var firstChar = '\n\n';

                    blob = new Blob([blob, `${firstChar}//${arrPath[currentIndex - 1]} \n`], { type: _type });
                    blob = new Blob([blob, data], { type: _type });

                    bundleJs.readJs(arrPath[currentIndex], {
                        onComplete: onLoad,
                        onError: onError
                    });

                } else {
                    onComplete();
                }
            }

            function onComplete() {

                var url = URL.createObjectURL(blob);

                var a = document.createElement('a');
                a.download = fileName;
                a.href = url;
                a.textContent = "Download backup.txt";
                a.click();
            }
        },

        createScriptToDocument: function (arrPath, options) {

            options = typeof options == "undefined" ? {} : options;

            var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
            var onProcess = options.hasOwnProperty("onProcess") ? options['onProcess'] : null;

            var currentIndex = 0;

            // var _type = "text/plain;charset=utf-8";
            // var blob = new Blob([], { type: _type });

            bundleJs.readJs(arrPath[currentIndex], {
                onComplete: onLoad,
                onError: onError
            });

            function onError(er) {
                console.log(er);
            }

            function onLoad(data) {
                currentIndex++;

                if (onProcess != null) onProcess(currentIndex / (arrPath.length));

                if (currentIndex <= arrPath.length) {
                    if (data) {
                        // console.log(data);
                        bundleJs.embedJsToHTML(data);

                        bundleJs.readJs(arrPath[currentIndex], {
                            onComplete: onLoad,
                            onError: onError
                        });
                    }
                    else onLoad();
                } else {
                    if (onComplete != null) onComplete();
                }


            }
        },

        embedJsToHTML: function (content) {
            var script = document.createElement('script');

            script.innerHTML = content;

            document.body.appendChild(script);
        },
    }


    var Convert= {
        //
         isNull:function(object) {
            return object === null;
        },
    
         toBool:function(object) {
            if (Convert.isNull(object)) return false;
            object = object.toString();
    
            return object === "true" || object == "1";
        },
    
         toInt:function(object) {
            if (Convert.isNull(object)) return 0;
            object = object.toString();
    
            return parseInt(object, 10);
        },
    
         toFloat:function(object) {
            if (Convert.isNull(object)) return 0;
            object = object.toString();
    
            return parseFloat(object);
        },
    }
    
    
    // export default Convert;


    exports.Convert = Convert;
    exports.Shaders = tShaders;
    exports.Math = tMath;
    exports.Loader = TLoader;
    exports.Browser = tBrowser;
    exports.Webcam = Webcam;
    exports.THREE = THREE;
    exports.Camera = Camera;
    exports.BundleJs = bundleJs;
    exports.Sec = Sec;

    Object.defineProperty(exports, '__esModule', { value: true });


})));



if (typeof isTestingLocal != "undefined")
    if (!isTestingLocal) {
        console.clear();
        TJS.Browser.showCredit();
        TJS.Browser.removeConsole();
    }
