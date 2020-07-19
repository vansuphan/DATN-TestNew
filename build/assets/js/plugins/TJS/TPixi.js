(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.TPixi = global.TPixi || {})));
}(this, (function (exports) {
    'use strict';


    // var loader = null;
    // var resources = [];

    function removeAllChild(target) {
        //DONT USE
        for (var i = target.children.length - 1; i >= 0; i--) {
            var item = target.children[i];

            target.removeChild(item);
            // item.destroy({ children: true, texture: true, baseTexture: true });
            // // item = null;

        }
    };
    exports.removeAllChild = removeAllChild;

    function hideAllChild(target) {

        for (var i = target.children.length - 1; i >= 0; i--) {
            var item = target.children[i];
            item.visible = false;

        }
    };
    exports.hideAllChild = hideAllChild;




    function loadImage(url, callback) {
        // var loader = loader;
        var loader = new PIXI.Loader();
        //v4 PIXI.Loader
        //v5 PIXI.Loader
        loader.add(url);
        loader.once('complete', callback);
        loader.load();
    };
    exports.loadImage = loadImage;

    function loadImages(list, callback) {
        // var loader = _PIXI.loader;
        var loader = new PIXI.Loader();
        //v4 PIXI.Loader
        //v5 PIXI.Loader
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            loader.add(item);
        }

        loader.once('complete', callback);
        loader.load();

        // function _oncomplete(l, r) {
        //     if (callback) callback(l, r);
        //     // resources += r;
        // }
    };
    exports.loadImages = loadImages;

    var TextureCache = PIXI.utils.TextureCache;
    // var TextureCache =PIXI.Loader.shared;
    // let e = PIXI.loader.resources[player.imge].txture;


    function TeeContainer(name, option) {
        var _this = this;
        PIXI.Container.call(_this);

        _this.name = name;

        option = option != undefined ? option : {};
        // var parent = option.hasOwnProperty("parent") ? option["parent"] : holder;
        var anchor = option.hasOwnProperty("anchor") ? option["anchor"] : { x: 0, y: 0 };
        var pivot = option.hasOwnProperty("pivot") ? option["pivot"] : { x: 0, y: 0 };
        var rotation = option.hasOwnProperty("rotation") ? option["rotation"] : 0;
        var _x = option.hasOwnProperty("x") ? option["x"] : 0;
        var _y = option.hasOwnProperty("y") ? option["y"] : 0;

        var fxloop = option.hasOwnProperty("fxloop") ? option["fxloop"] : null;
        // var rotLoop = option.hasOwnProperty("rotLoop") ? option["rotLoop"] : TJS.Math.degToRad(-10);
        var duration = option.hasOwnProperty("duration") ? option["duration"] : .5;
        var delay = option.hasOwnProperty("delay") ? option["delay"] : 0;
        // var ease = option.hasOwnProperty("ease") ? option["ease"] : Sine.easeOut;

        var _texture = TextureCache[name];
        var _image = _this.sprite = new PIXI.Sprite(_texture);
        // parent.addChild(_image);
        if (option.hasOwnProperty("anchor")) _image.anchor = anchor;
        if (option.hasOwnProperty("pivot")) _image.anchor = { x: pivot.x / _image.width, y: pivot.y / _image.height };
        // console.log(_image.anchor);
        _image.rotation = TJS.Math.degToRad(rotation);
        // _image.x = 0;
        // _image.y = 0;
        _this.x = _x;
        _this.y = _y;

        _this.fxLoopMoveY = function () {
            var moveY = option.hasOwnProperty("moveY") ? option["moveY"] : 10;
            duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
            TweenMax.to(_image, duration, {
                delay: Math.random() * duration,
                y: _image.y + moveY,
                ease: Sine.easeInOut,
                repeat: -1,
                yoyo: true
            })
        }

        _this.fxLoopMoveX = function () {
            var moveX = option.hasOwnProperty("moveX") ? option["moveX"] : 10;
            duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
            TweenMax.to(_image, duration, {
                delay: Math.random() * duration,
                x: _image.x + moveX,
                ease: Sine.easeInOut,
                repeat: -1,
                yoyo: true
            })
        }

        _this.fxLoopRotation360 = function () {
            duration = option.hasOwnProperty("duration") ? option["duration"] : 3;
            TweenMax.to(_image, duration, {
                delay: Math.random() * duration,
                rotation: TJS.Math.degToRad(360),
                ease: Linear.easeNone,
                repeat: -1,
            })
        }

        _this.fxLoopRotation = function () {
            duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
            if (option.hasOwnProperty("rotLoop")) {
                var rotLoop = TJS.Math.degToRad(option["rotLoop"]);
                // _image.rotation = -rotLoop;
            } else {
                var rotLoop = TJS.Math.degToRad(-10);
                _image.rotation = -rotLoop;
            }

            TweenMax.to(_image, duration, {
                delay: Math.random() * duration,
                rotation: _image.rotation + rotLoop,
                ease: Sine.easeInOut,
                repeat: -1,
                yoyo: true
            })
        }

        _this.fxLoopScale = function () {
            duration = option.hasOwnProperty("duration") ? option["duration"] : 1;
            TweenMax.to(_image.scale, duration, {
                // rotation: _image.rotation + rotLoop,
                delay: delay,
                x: .9,
                y: .9,
                ease: Sine.easeInOut,
                repeat: -1,
                yoyo: true
            })
        }

        if (fxloop != null) {
            if (fxloop == "rotation360") {
                _this.fxLoopRotation360();
            } else if (fxloop == "rotation") {
                _this.fxLoopRotation();
            } else if (fxloop == "scale") {
                _this.fxLoopScale();
            } else if (fxloop == "moveX") {
                _this.fxLoopMoveX();
            } else if (fxloop == "moveY") {
                _this.fxLoopMoveY();
            }


        }

        var onClick = option.hasOwnProperty("onClick") ? option["onClick"] : null;

        if (onClick != null || _this.onClick) {
            _this.interactive = _this.buttonMode = true;
            _this.on("pointerdown", function () {
                onClick();

                if (_this.onClick) _this.onClick();
            })
        }

        var onOver = option.hasOwnProperty("onOver") ? option["onOver"] : null;
        if (onOver != null || _this.onOver) {
            _this.interactive = _this.buttonMode = true;
            _this.on("pointerover", function () {
                onOver();
                if (_this.onOver) _this.onOver();
            })
        }

        var onOut = option.hasOwnProperty("onOut") ? option["onOut"] : null;
        if (onOut != null || _this.onOut) {
            _this.interactive = _this.buttonMode = true;
            _this.on("pointerout", function () {
                onOut();
                if (_this.onOut) _this.onOut();
            })
        }

        _this.addChild(_image);
        // _this.pivot.x = -_this.width * anchor.x;
        // _this.pivot.y = -_this.height * anchor.y;
        //  _image;
    };
    exports.TeeContainer = TeeContainer;
    TeeContainer.prototype = Object.assign(Object.create(PIXI.Container.prototype), {})


    function ControlImageInMask(option) {
        option = option != undefined ? option : {};
        var container = option.hasOwnProperty("container") ? option["container"] : null;
        var mask = option.hasOwnProperty("mask") ? option["mask"] : null;

        container.interactive = container.buttonMode = true;

        var firstMouse = {},
            firstPos = {}


        container
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);


        function onDragStart(event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.7;
            this.dragging = true;

            var _pos = event.data.getLocalPosition(this.parent);
            // console.log(_pos);
            firstMouse.x = _pos.x;
            firstMouse.y = _pos.y;

            firstPos.x = this.x;
            firstPos.y = this.y;
        }

        function onDragEnd() {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        }

        function onDragMove() {
            if (this.dragging) {
                var mousePos = this.data.getLocalPosition(this.parent);
                // this.x = newPosition.x;
                // this.y = newPosition.y;
                // console.log(this.getBounds().width, this.getBounds().height);

                if (this.getBounds().width > this.getBounds().height) {
                    var __x = firstPos.x + (mousePos.x - firstMouse.x);
                    // console.log(__y);
                    // if ((__x + (this.getBounds().width / 2) > (mask.x + (mask.width / 2))) && (__x - (this.getBounds().width / 2) < (mask.x - (mask.width / 2))))
                    //     this.x = __x;
                    if (__x > mask.x)
                        __x = mask.x;
                    else if (__x < mask.x - (this.getBounds().width - mask.width)) {
                        __x = mask.x - (this.getBounds().width - mask.width);
                    };
                    this.x = __x;
                }
                else {
                    var __y = firstPos.y + (mousePos.y - firstMouse.y);
                    // console.log(__y, mask.y);
                    // if ((__y + (this.getBounds().height / 2) > (mask.y + (mask.height / 2))) && (__y - (this.getBounds().height / 2) < (mask.y - (mask.height / 2))))
                    if (__y > mask.y)
                        __y = mask.y;
                    else if (__y < mask.y - (this.getBounds().height - mask.height)) {
                        __y = mask.y - (this.getBounds().height - mask.height);
                    };
                    this.y = __y;

                }

            }
        }


    };
    exports.ControlImageInMask = ControlImageInMask;


    function FixImageInMask(option) {
        option = option != undefined ? option : {};

        var container = option.hasOwnProperty("container") ? option["container"] : null;
        var sprite = option.hasOwnProperty("sprite") ? option["sprite"] : container.sprite;
        var containerRotation = option.hasOwnProperty("containerRotation") ? option["containerRotation"] : container.containerRotation;
        var _mask = option.hasOwnProperty("mask") ? option["mask"] : container.maskGraphicHidden;

        // var _texture = sprite.texture;

        container.x = container.y = 0;
        container.pivot = { x: 0, y: 0 };

        sprite.anchor = { x: .5, y: .5 };

        containerRotation.x = _mask.x + (_mask.width / 2);
        containerRotation.y = _mask.y + (_mask.height / 2);

        // console.log(container.getBounds())

        if (container.getBounds().width / container.getBounds().height <= _mask.width / _mask.height) {
            containerRotation.width = _mask.width;
            containerRotation.scale.y = containerRotation.scale.x;
            container.pivot.y = container.getBounds().y;
            container.y = -container.getBounds().y - ((container.getBounds().height - _mask.height) / 2);
            // console.log(container.getBounds())

            var __y = container.y;
            if (__y > _mask.y)
                __y = _mask.y;
            else if (__y < _mask.y - (container.getBounds().height - _mask.height)) {
                __y = _mask.y - (container.getBounds().height - _mask.height);
            };
            container.y = __y;
        } else {
            containerRotation.height = _mask.height;
            containerRotation.scale.x = containerRotation.scale.y;
            container.pivot.x = container.getBounds().x;
            container.x = -container.getBounds().x - ((container.getBounds().width - _mask.width) / 2);

            var __x = container.x;
            if (__x > _mask.x)
                __x = _mask.x;
            else if (__x < _mask.x - (container.getBounds().width - _mask.width)) {
                __x = _mask.x - (container.getBounds().width - _mask.width);
            };
            container.x = __x;
        }


        // console.log(container.y, containerRotation.y, sprite.y)

        container.mask = _mask;
    }
    exports.FixImageInMask = FixImageInMask;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
