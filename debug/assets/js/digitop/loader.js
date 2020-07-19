/* GLoader - version 1.6.2
- Description: preload external Image, JS & CSS files
- Date: Aug 12, 2017
- Author: Duy Nguyen <duynguyen@wearetopgroup.com>
- Contributor: Tam Lam <tamlam@wearetopgroup.com>
================================================== */
var GLoader = {
    version: '1.7',

    // Load script: JS or CSS
    tmpScriptData: [],
    loadScript: function (url, callback) {
        if (!url) if (callback) callback();

        // url += randomVersion();

        var done = false;
        var fileType = url.indexOf('.js') > -1 ? 'js' : 'css';
        var result = { status: false, message: '' };
        var script = fileType == 'js'
            ? document.createElement('script')
            : document.createElement('link');

        script.setAttribute('data-loader', 'GLoader');
        if (fileType == 'js') {
            // script.setAttribute('async', "");
            script.setAttribute('type', 'text/javascript');
            if (isLocal) {
                script.setAttribute('src', url);
            } else {
                embedJsToHTML();
            }
        } else {
            script.setAttribute('rel', 'stylesheet');
            script.setAttribute('type', 'text/css');
            script.setAttribute('href', url);
        }


        function embedJsToHTML() {

            GLoader.loadFile(url, {
                onComplete: onLoad,
                onError: handleError
            });

            function onLoad(content) {
                // GLoader.tmpScriptData.push({"name": GLoader.getFileName(url), "content": content})
                GLoader.embedScript(script, GLoader.getFileName(url), content)
                // script.innerHTML = content;
                if (callback) callback(result);
            }
        };

        if (fileType == 'js') {
            document.body.appendChild(script);
        } else {
            document.head.appendChild(script);

            script.onload = handleLoad;
            script.onreadystatechange = handleReadyStateChange;
            script.onerror = handleError;
        }

        if (isLocal) {

            // events
            script.onload = handleLoad;
            script.onreadystatechange = handleReadyStateChange;
            script.onerror = handleError;
        }


        function handleLoad() {
            if (!done) {
                done = true;

                result.status = true;
                result.message = 'Script was loaded successfully';

                if (callback) callback(result);
            }
        }

        function handleReadyStateChange() {
            var state;

            if (!done) {
                state = script.readyState;
                if (state === 'complete') {
                    handleLoad();
                }
            }
        }

        function handleError() {
            //console.log("error");
            if (!done) {
                done = true;
                result.status = false;
                result.message = 'Failed to load script.';
                if (callback) callback(result);
            }
        }
    },

    // check file existed:
    isExisted: function (filePath) {
        var scope = this;

        var existed = false;
        var fileName = scope.getFileName(filePath);

        var _name = "js_" + fileName;

        if (document.getElementsByName(_name).length != 0) return true;

        var scripts = document.getElementsByTagName('script');

        for (var i = 0; i < scripts.length; i++) {
            if (scripts[i].src) {
                var src = scripts[i].src;
                var currentFileName = scope.getFileName(src);

                if (currentFileName.toLowerCase() == fileName.toLowerCase()) {
                    existed = true;
                }

            } else {

            }
        }
        return existed;
    },

    embedScript: function (node, nameJs, data) {
        // node
        var _name = node.getAttribute('name') || ""; 

        if (_name.isEmpty()) {
            var _name = "js_" + nameJs;
            node.setAttribute('name', name);
        }

        if (!isLocal)
            node.removeAttribute('name');

        node.textContent = data;
    },

    // Load list of scripts:
    loadScripts: function (array, options) {

        var options = options || {};

        var onComplete = options['onComplete'] || null
            , onProcess = options['onProcess'] || null
            ;

        if (array.length == 0) {
            if (onComplete) onComplete();
            return;
        }

        if (isLocal) {
            var count = 0;
            var total = array.length;
            GLoader.loadScript(array[count], _onComplete);

            function _onComplete(result) {
                if (onProcess) onProcess(count / total);
                // console.log(count / total);
                count++;

                if (count == total) {
                    result.status = true;
                    result.message = "All scripts were loaded.";
                    if (onProcess) onProcess(1);
                    if (onComplete) onComplete(result);
                } else {

                    if (GLoader.isExisted(array[count])) {
                        console.log("[GLoader] The script \"" + array[count] + "\" was existed -> Skipped.");
                        if (_onComplete) _onComplete();
                    } else {
                        GLoader.loadScript(array[count], _onComplete);
                    }
                }
            }
            return;
        } else {

            var listCss = array.filter(function (url) {
                return url.indexOf('.css') > -1
            }).map(function (url) {
                return GLoader.loadScript(url);
            })

        }

        var listJs = [];
        var list = [];
        var index = 0;

        for (var i = 0; i < array.length; i++) {

            var url = array[i];

            if (url.indexOf('.js') <= -1) continue;

            var _name = "js_" + GLoader.getFileName(url);

            if (GLoader.isExisted(GLoader.getFileName(url))
            ) continue;

            var script = document.createElement('script');
            script.setAttribute('name', _name);
            script.setAttribute('data-loader', 'GLoader');
            script.setAttribute('type', 'text/javascript');
            document.body.appendChild(script);

            listJs.push(array[i]);

            list.push({
                id: index,
                url: url,
                name: _name,
            })

            index++;
        }

        var idAdded = -1;

        var listLoaded = [];

        this.loadMultiFile(listJs, {
            maxQueue: 7,
            onProgress: function (process, _url, data) {
                var itemLoaded = list.find(function (_item) {
                    return _item.url == _url;
                })

                itemLoaded.data = data;
                listLoaded.push(itemLoaded);
                checkEmbed(itemLoaded);

                if (onProcess != null) onProcess(process);

            },
            onComplete: function () {

                if (onComplete) onComplete();

                // console.log('complete');
            }

        })


        function checkEmbed(itemLoaded) {

            var idNext = listLoaded.find(function (_item) {
                return _item.id == idAdded + 1
            })

            if (idNext) {
                listLoaded.sort(function (a, b) {
                    return a.id - b.id;
                });

                embed();
            }
        }


        function embed() {
            // console.log("embed !!");
            for (var i = 0; i < listLoaded.length; i++) {
                var item = listLoaded[i];
                // console.log('item.id', item.id, idAdded);
                if (item.id != idAdded + 1) return;

                idAdded++;

                // document.getElementsByName(item.name)[0].innerHTML = item.data;
                GLoader.embedScript(document.getElementsByName(item.name)[0], item.name, item.data)

                listLoaded.shift();
                i--;

            }
        }

        // var result = { status: false, message: '' };
        // var count = 0;
        // var total = array.length;
        // //console.log("loadScripts")
        // this.loadScript(array[count], onComplete);

        // function onComplete(result) {
        // 	count++;
        // 	// console.log(count, total)
        // 	if (count == total) {
        // 		result.status = true;
        // 		result.message = 'All scripts were loaded.';
        // 		if (callback) callback(result);
        // 	} else {
        // 		if (GLoader.isExisted(array[count])) {
        // 			console.log(
        // 				'[GLoader] The script "' +
        // 				array[count] +
        // 				'" was existed -> Skipped.'
        // 			);
        // 			onComplete();
        // 		} else {
        // 			GLoader.loadScript(array[count], onComplete);
        // 		}
        // 	}
        // }
    },

    // load single photos
    // url: String, options: Object
    loadPhoto: function (url, options, callback) {
        var img = new Image();
        img.onload = function () {
            if (typeof callback != 'undefined') callback(url);
        };
        img.onerror = function () {
            if (typeof callback != 'undefined') callback(null);
        };
        img.src = url;
    },

    // load multiple photos
    // urls: Array, options: Object
    loadPhotos: function (urls, options, callback) {
        var array = urls;
        var count = 0;
        var total = array.length;
        var result = { status: false, message: '' };
        var photos = [];

        var currentURL = array[count];
        this.loadPhoto(currentURL, options, onComplete);

        function onComplete(url) {
            count++;
            //console.log(count, total)
            if (count == total) {
                result.status = true;
                result.message = 'All photos were loaded.';
                result.photos = photos;
                if (callback) callback(result);
            } else {
                photos.push(url);
                currentURL = array[count];
                GLoader.loadPhoto(currentURL, options, onComplete);
            }
        }
    },

    loadFile: function (url, options) {

        options = options != undefined ? options : {};

        var onProgress = options.hasOwnProperty("onProgress") ? options['onProgress'] : null;
        var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
        var onError = options.hasOwnProperty("onError") ? options['onError'] : null;
        var responseType = options.hasOwnProperty("responseType") ? options['responseType'] : 'text';

        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.responseType = responseType;


        req.onprogress = function (e) {
            var progress = e.loaded / e.total;
            downloaded = e.loaded;
            if (onProgress != null) onProgress(progress);
        };

        req.onreadystatechange = function () {

            if (req.readyState == 2) {
                // response headers received
            }

            if (req.readyState == 3) {
                // loading
            }
            if (req.readyState == 4) {
                // request finished
            }
        };

        req.onload = function () {

            // console.log("req");
            // console.log(req);
            // console.log(req.DONE);

            // console.log(parseInt(req.status.toString()) );
            // console.log(req.readyState === req.DONE);
            // console.log(parseInt(req.status.toString()) < 400);

            if (req.readyState === req.DONE) {
                if (parseInt(req.status.toString()) < 400) {
                    if (onComplete != null) onComplete(req.response, url);
                    return;
                }
            }

            if (onError != null) onError('Status error ' + this.status, "", url);

        };

        req.onerror = function (err) {
            // Error
            console.log(err);
            if (onError != null) onError('Loading error');
        };

        req.send();
    },

    loadMultiFile: function (urls, options) {
        var scope = this;

        options = options != undefined ? options : {};

        var onProgress = options.hasOwnProperty("onProgress") ? options['onProgress'] : null;
        var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
        var onError = options.hasOwnProperty("onError") ? options['onError'] : null;

        var maxQueue = options.hasOwnProperty("maxQueue") ? options['maxQueue'] : 5;

        var responseType = options.hasOwnProperty("responseType") ? options['responseType'] : 'text';

        var currentQueueCount = 0
            , currentIdLoading = 0
            , idComplete = 0;

        var count = 0;

        if (urls.length == 0 || urls == null) {
            _onComplete();
        }

        if (urls.length < maxQueue) {
            //length < maxQueue
            for (let i = 0; i < urls.length; i++) {
                var url = urls[i];
                scope.loadFile(url,
                    {
                        // onProgress: _onProgress,
                        responseType: responseType,
                        onError: _onError,
                        onComplete: onCompleteSmallQuality,
                    });
            }
        } else {
            //load per [maxQueue] each
            loadedInQueue();
        }

        function loadedInQueue() {
            //
            if (currentIdLoading < urls.length) {

                if (currentQueueCount < maxQueue) {

                    currentQueueCount++;

                    var urlLoading = urls[currentIdLoading];
                    currentIdLoading++;

                    scope.loadFile(urlLoading,
                        {
                            responseType: responseType,
                            onComplete: __onComplete,
                            // onProgress: _onProgress,
                            onError: _onError,
                        });

                    loadedInQueue();
                }
            }
        }


        function _onProgress(url, data) {
            idComplete++;
            var precent = (idComplete) / (urls.length);

            if (onProgress) onProgress(precent, url, data);
        }

        function _onError(errorString, data, _url) {
            if (onError) onError(errorString);

            if (typeof data != "undefined")
                __onComplete(data, _url);
        }

        function onCompleteSmallQuality(data, _url) {
            count++;

            _onProgress(_url, data);
            if (count >= urls.length) {
                _onComplete();
            }

            // else {
            //     loadedInQueue();
            // };
        }

        function __onComplete(data, _url) {
            currentQueueCount--;

            _onProgress(_url, data);

            if (currentIdLoading >= urls.length && currentQueueCount == 0) {
                _onComplete();
            } else {
                loadedInQueue();
            };
        }

        function _onComplete() {
            // console.log("complete");
            if (onComplete) onComplete();
        }


    },


    getFileName: function (path) {
        if (path.indexOf('?') > -1) {
            path = path.substring(0, path.indexOf('?'));
        }

        var startIndex = (path.indexOf('\\') >= 0 ? path.lastIndexOf('\\') : path.lastIndexOf('/'));
        var filename = path.substring(startIndex);
        if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
            filename = filename.substring(1);
        }
        return filename
    },


};


