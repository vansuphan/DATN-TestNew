
(function () {
    if (typeof window.CustomEvent === "function") return false; //If not IE

    function CustomEvent(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();


document.getElementsByClassName = function (cl) {
    var retnode = [];
    var elem = this.getElementsByTagName('*');
    for (var i = 0; i < elem.length; i++) {
        if ((' ' + elem[i].className + ' ').indexOf(' ' + cl + ' ') > -1) retnode.push(elem[i]);
    }
    return retnode;
};



var lazyloadCustom = {

    element: document.createElement("child"),

    isAllowTrigger: true,

    start: function () {
        var scope = this;

        var array = document.getElementsByClassName("lazyload");
        //////console.log(array.length);
        scope.loadMultiFile(array, {
            onComplete: function () {
                //////console.log("complete");
            }
        });
    },

    reCheck: function (tick) {

        tick = tick || 250;

        var scope = this;

        setInterval(function () {
            if (document.getElementsByClassName("lazyload").length > 0) scope.start();
        }, tick);

    },


    checkImageLoaded: function (callback) {
        var scope = this;

        if (!scope.isAllowTrigger) return;

        var array = document.getElementsByClassName("lazyload");

        ////console.log(array.length);
        if (array.length == 0) {
            onComplete();
        } else {
            scope.element.addEventListener("oncomplete", function (e) {
                onComplete();
            });
        }

        function onComplete() {
            ////console.log('onComplete');
            if (callback) callback();
            scope.isAllowTrigger = false;
        }

    },


    loadFile: function (element, options) {

        element = typeof element != "undefined" ? element : {};

        options = typeof options != "undefined" ? options : {};

        var onProgress = options.hasOwnProperty("onProgress") ? options['onProgress'] : null;
        var onComplete = options.hasOwnProperty("onComplete") ? options['onComplete'] : null;
        var onError = options.hasOwnProperty("onError") ? options['onError'] : null;
        var responseType = options.hasOwnProperty("responseType") ? options['responseType'] : 'text';

        if (element.classList) element.classList.remove("lazyload");
        if (element.classList) element.classList.add("lazyloading");

        element.addEventListener("load", function () {
            if (element.classList) element.classList.remove("lazyloading");
            if (element.classList) element.classList.add("lazyloaded");
            //////console.log("load");
            if (onComplete) onComplete("", element);
        })
        element.addEventListener("error", function () {
            // if (element.classList) element.classList.remove("lazyloading");
            // if (element.classList) element.classList.add("lazyloaded");
            //////console.log("load");
            if (onError) onError("", element);
        })
        element.setAttribute("src", element.getAttribute("data-src"))

    },

    loadMultiFile: function (_array, options) {

        var array = _array.slice();
        //  var array = Array.of(_array);
        //////console.log(array);

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

        if (array.length == 0 || array == null) {
            _onComplete();
        }

        if (array.length < maxQueue) {
            //length < maxQueue
            for (let i = 0; i < array.length; i++) {
                var element = array[i];
                scope.loadFile(element,
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

            if (currentIdLoading < array.length) {
                ////console.log(currentQueueCount, maxQueue)

                if (currentQueueCount < maxQueue) {

                    currentQueueCount++;

                    var urlLoading = array[currentIdLoading];
                    currentIdLoading++;
                    ////console.log(currentIdLoading, urlLoading)
                    //console.log("loadedInQueue", urlLoading);
                    //console.log(currentIdLoading, array.length);

                    scope.loadFile(urlLoading,
                        {
                            responseType: responseType,
                            onComplete: __onComplete,
                            // onProgress: _onProgress,
                            onError: _onError,
                        });

                    loadedInQueue();
                }
            } else {

            }
        }


        function _onProgress(url, data) {
            idComplete++;
            var precent = (idComplete) / (array.length);

            if (onProgress) onProgress(precent, url, data);
        }

        function _onError(errorString, data, _url) {
            if (onError) onError(errorString);
            console.log('_onError', errorString, data, _url)

            if (typeof data != "undefined")
                __onComplete(data, _url);
        }

        function onCompleteSmallQuality(data, _url) {
            count++;

            _onProgress(_url, data);
            if (count >= array.length) {
                _onComplete();
            }

            // else {
            //     loadedInQueue();
            // };
        }

        function __onComplete(data, _url) {
            currentQueueCount--;

            _onProgress(_url, data);

            //console.log('__onComplete', _url, idComplete)
            //console.log(idComplete, array.length)
            if (currentIdLoading >= array.length && currentQueueCount == 0) {
                _onComplete();
            } else {
                loadedInQueue();
            };
        }

        // scope.element = document.createElement("child");

        function _onComplete() {
            ////console.log("complete");
            // create and dispatch the event
            var event = new CustomEvent("oncomplete", {
                // detail: {
                //     hazcheeseburger: true
                // }
            });
            scope.element.dispatchEvent(event);

            if (onComplete) onComplete();
        }
    },
}


lazyloadCustom.start();

// lazyloadCustom.checkImageLoaded(function () {
//     lazyloadCustom.reCheck();
// });


