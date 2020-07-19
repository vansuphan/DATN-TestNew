(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.AssetsManager = {}));
}(this, function (exports) {
    'use strict';

    // var scope = this;
    // console.log(scope);

    var Events = {
        ON_LOAD_PROGRESS: "onLoadProgress",
        ON_LOAD_COMPLETE: "onLoadComplete",
        ON_LOAD_ERROR: "onLoadError",
    }

    var list = new Map();
    var enabled = true;

    var cubeImages = [
        'right.jpg',
        'left.jpg',
        'top.jpg',
        'bottom.jpg',
        'front.jpg',
        'back.jpg',
    ];

    var manager = new THREE.LoadingManager();
    // manager.onStart = onLoadStart;
    // manager.onLoad = onLoadComplete;
    // manager.onProgress = onLoadProgress;
    manager.onError = onLoadError;

    var listToLoad = [];
    var loaders = [];
    var loaded = 0;
    var total = 0;

    var _onComplete;

    // functions

    function get(key) {
        return list.get(key);
    }

    function set(key, object) {
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = false;
                child.receiveShadow = false;
            }
        });
        list.set(key, object);
    }

    function add(key, url) {
        var itemToLoad = { url: url, key: key };
        listToLoad.push(itemToLoad);
    }

    function start(onComplete) {
        _onComplete = onComplete;
        loaded = 0;
        total = listToLoad.length;

        if (total == 0) {
            if (_onComplete) _onComplete();
            return;
        }

        for (var i = 0; i < total; i++) {
            var url = listToLoad[i].url;
            var key = listToLoad[i].key;
            load(key, url, onLoaded);
        }
    }

    function onLoaded(key, object) {
        // console.log(key, object);
        list.set(key, object);

        loaded++;
        total = listToLoad.length;
        // console.log(loaded, total);
        if (loaded == total) {
            if (_onComplete) _onComplete();

            var evt = $.Event(Events.ON_LOAD_PROGRESS);
            evt.progress = 1;
            $(AssetsManager).trigger(evt);

            var evt = $.Event(Events.ON_LOAD_COMPLETE);
            $(AssetsManager).trigger(evt);
        } else {
            var progress = loaded / total;

            var evt = $.Event(Events.ON_LOAD_PROGRESS);
            evt.progress = progress;
            $(AssetsManager).trigger(evt);
        }
    }

    function load(key, url, onLoad) {
        var loader;

        if (key.indexOf('cube_map') != -1) {
            loader = new THREE.CubeTextureLoader(manager);
            loader.setPath(url);
            loader.load(cubeImages, onItemLoaded);
        } else {
            var fileExt = getExtension(url);
            switch (fileExt) {
                case 'fbx':
                    loader = new THREE.FBXLoader(manager);
                    break;

                case 'glb':
                    loader = new THREE.GLTFLoader(manager);
                    break;

                case 'gltf':
                    loader = new THREE.GLTFLoader(manager);
                    break;

                case 'obj':
                    loader = new THREE.FBXLoader(manager);
                    break;

                case 'mp3':
                    loader = new THREE.AudioLoader(manager);
                    break;

                case 'jpg':
                    loader = new THREE.TextureLoader(manager);
                    break;

                case 'png':
                    loader = new THREE.TextureLoader(manager);
                    break;

                default:
                    loader = new THREE.FileLoader(manager);
                    break;
            }
            loader.load(url, onItemLoaded, undefined, onItemError);
        }

        loaders.push(loader);

        function onItemError(e) {
            console.log(e);
            // console.log("[Assets] Error " + e.target.status + ": " + e.target.statusText);
        }

        function onItemLoaded(object) {
            // console.log(object);
            var obj3d;
            // console.log(object.scene);
            if (typeof object.scene != 'undefined') {
                // console.log (object);
                var holder = new THREE.Object3D();
                holder.add(object.scene);
                object.scene.scale.setScalar(100);
                obj3d = holder;
                if (typeof object.animations != 'undefined') {
                    obj3d.animations = object.animations;
                }
                if (typeof object.assets != 'undefined') {
                    obj3d.assets = object.assets;
                }
                if (typeof object.parser != 'undefined') {
                    obj3d.parser = object.parser;
                }
            } else {
                obj3d = object;
            }
            if (onLoad) onLoad(key, obj3d);
        }

        return loader;
    }

    function activate() {
        enabled = true;
    }

    function deactivate() {
        enabled = false;
    }

    function getExtension(url) {
        var ext = url.substring(url.lastIndexOf('.') + 1, url.length) || url;
        return ext.toLowerCase();
    }

    function onLoadComplete() {
        // loaded++;
        // console.log ('Loading: ' + loaded + '/' + total);
        // console.log ('Everything is loaded completely');
    }

    function onLoadStart(url, itemsLoaded, itemsTotal) {
        /* console.log (
                'Started loading file: ' +
                    url +
                    '.\nLoaded ' +
                    itemsLoaded +
                    ' of ' +
                    itemsTotal +
                    ' files.'
            ); */
    }

    function onLoadProgress(url, itemsLoaded, itemsTotal) {
        /* console.log (
          'Loading file: ' +
            url +
            '.\nLoaded ' +
            itemsLoaded +
            ' of ' +
            itemsTotal +
            ' files.'
        ); */
        var progress = itemsLoaded / itemsTotal;


        // if (scope.onLoadProgress) scope.onLoadProgress(progress);
    }

    function onLoadError(url) {
        console.log('There was an error loading ' + url);

        var evt = $.Event(Events.ON_LOAD_ERROR);
        evt.url = url;
        $(AssetsManager).trigger(evt);
    }

    function dispose() {
        loaders.forEach(function (loader) {
            loader = null;
        });

        // delete scope.enabled;
        // delete scope.activate;
        // delete scope.deactivate;
        // delete scope.add;
        // delete scope.start;
        // delete scope.get;
        // delete scope.set;
        // delete scope.list;
        // delete scope.dispose;
        // delete scope.onLoadProgress;
        // delete scope.onLoadComplete;
    }


    // exports
    exports.Event = Events;
    exports.enabled = enabled;
    exports.activate = activate;
    exports.deactivate = deactivate;
    exports.add = add;
    exports.start = start;
    exports.get = get;
    exports.set = set;
    exports.list = list;
    exports.dispose = dispose;

    // exports.onLoadProgress = null;
    // exports.onLoadComplete = null;

    Object.defineProperty(exports, '__esModule', { value: true });

    Object.defineProperties(exports, {

        Events: { get: function () { return Events; } },

    })

}));
