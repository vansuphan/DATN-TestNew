(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (global = global || self, factory(global.MainEnvironment = {}));
}(this, function (exports) {
    'use strict';

    var scope = this;

    var container = pMain.container[0];

    var scene, renderer, camera, cameraHolder, composer, effectPass
        , controls, stats
        , clock = new THREE.Clock()
        , mixer
        , animationEnabled = true;
    var listener;

    var sound;


    function init() {

        scene = new THREE.Scene();
        // camera = new THREE.PerspectiveCamera(75, sw / sh, 0.1, 400);

        camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 1, 2000);
        camera.position.set(0, 45, 120);
        camera.rotation.x = THREE.Math.degToRad(-7);

        cameraHolder = new THREE.Object3D();
        scene.add(cameraHolder);
        cameraHolder.add(camera);
        // camera.position.set(0, 100, 100);

        scene.background = new THREE.Color(0x8dd7f5);
        // scene.background = new THREE.Color(0x000000);

        scene.fog = new THREE.Fog(0x8dd7f5, 1500, 2000);

        scene.add(new THREE.AmbientLight(0xffffff));
        // scene.add(new THREE.HemisphereLight(0xffffff, 0x8dd7f5, 1));
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
        directionalLight.position.z = 300;
        scene.add(directionalLight);


        // create an AudioListener and add it to the camera
        listener = new THREE.AudioListener();
        camera.add(listener);




        /////////
        /////////
        /////////
        /////////
        /////////
        /////////

        // createSkybox();
        function createSkybox() {
            // var urls = ['right.jpg', 'left.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'back.jpg'];
            var urls = ['front.jpg', 'front.jpg', 'top.jpg', 'bottom.jpg', 'front.jpg', 'front.jpg'];
            var loader = new THREE.CubeTextureLoader().setPath(path_resource + 'images/textures/skybox/PolygonCloud2/');
            loader.load(urls, function (texture) {

                scene.background = texture;

                var pmremGenerator = new THREE.PMREMGenerator(texture);
                pmremGenerator.update(renderer);

                var pmremCubeUVPacker = new THREE.PMREMCubeUVPacker(pmremGenerator.cubeLods);
                pmremCubeUVPacker.update(renderer);

                // var envMap = pmremCubeUVPacker.CubeUVRenderTarget.texture;

                pmremGenerator.dispose();
                pmremCubeUVPacker.dispose();

                //

            });
        }


        window.addEventListener('touchstart', playSound);
        document.addEventListener('click', playSound);




        ////////
        ////////
        ////////
        ////////
        ////////
        ////////

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(sw, sh);
        // renderer.antialias = true;
        // renderer.gammaInput = true;
        // renderer.gammaOutput = true;
        pMain.container.append(renderer.domElement);


        composer = new POSTPROCESSING.EffectComposer(renderer);
        effectPass = new POSTPROCESSING.EffectPass(camera, new POSTPROCESSING.BloomEffect({ luminanceSmoothing: .05 }));
        effectPass.renderToScreen = true;

        composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));
        composer.addPass(effectPass);


        // stats = new Stats();
        // if (isTestingLocal) container.appendChild(stats.dom);
        // $(stats.dom).css('right', '0px');
        // $(stats.dom).css('left', '');


        if (isTestingLocal) {
            controls = new THREE.OrbitControls(camera, renderer.domElement);
            // controls.enablePan = false;
            // controls.minDistance = 1000;
            if (controls) controls.update();
        }

        animate();
    }


    function playSound() {

        // // create a global audio source
        // sound = new THREE.Audio(listener);
        // sound.setBuffer(AssetsManager.get("sound_background"));
        // sound.setLoop(true);
        // sound.setVolume(0.4);
        // sound.play();

        // window.removeEventListener('touchstart', playSound);
        // document.removeEventListener('click', playSound);

    }

    function stopSound() {
        // sound.stop();
    }


    function onRender() {
        // renderer.clear();
        // renderer.render(scene, camera);
        composer.render(clock.getDelta());
    }


    function resize() {
        // update main scene
        if (camera != null) {
            camera.aspect = sw / sh;
            camera.updateProjectionMatrix();

            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(sw, sh);
        }

        // update scene controls
        if (isTestingLocal) if (controls) controls.update();
    }


    var lastCalledTime = 0;
    function animate() {
        // console.log(document.activeElement);
        // stats.update();
        // console.log(stats);


        requestAnimationFrame(animate);

        var deltaTime = clock.getDelta();

        // if (animationEnabled) if (mixer) mixer.update(deltaTime);

        var delta = (performance.now() - lastCalledTime) / 1000;
        var fps = 1 / delta;
        lastCalledTime = performance.now();

        if (isTestingLocal) {


            var textDebug = "";
            // textDebug += "drawcalls; " + renderer.info.render.calls + "<br>";
            // textDebug += "triangles; " + renderer.info.render.triangles + "<br>";
            textDebug += `fps: ${fps.toFixed(0)}` + "<br>";
            // textDebug += `life: ${GameController.life}/${GameController.maxLife}` + "<br>";
            // textDebug += `score: ${GameController.score}` + "<br>";

            $("#debugText").html(textDebug);
        }

        if (fps < 40) camera.far = 1500;
        else camera.far = 2000;

        // update controls
        if (controls) if (controls.enabled) controls.update();

        // if (typeof PlayerController != "undefined")
        //     if (PlayerController.enable) PlayerController.animate(deltaTime);

        // if (typeof MapController != "undefined")
        //     if (MapController.enable) MapController.animate(deltaTime);

        // if (typeof GameController != "undefined")
        //     if (GameController.enable) GameController.update(deltaTime);

        // if (typeof ParticleController != "undefined")
        //     if (ParticleController.enable) ParticleController.update(deltaTime);


        // render scene
        onRender();

    }

    function setMasterVolume(value) {
        listener.setMasterVolume(value);
    }




    exports.init = init;
    exports.resize = resize;
    exports.setMasterVolume = setMasterVolume;
    // exports.stopSound = stopSound;

    // exports.scene = scene;
    // exports.renderer = renderer;
    // exports.camera = camera;

    Object.defineProperty(exports, '__esModule', { value: true });
    Object.defineProperties(exports, {
        scene: { get: function () { return scene } },
        renderer: { get: function () { return renderer } },
        camera: { get: function () { return camera } },
        cameraHolder: { get: function () { return cameraHolder } },
        controls: { get: function () { return controls } },
        composer: { get: function () { return composer } },
        listener: { get: function () { return listener } },
    });

}));
