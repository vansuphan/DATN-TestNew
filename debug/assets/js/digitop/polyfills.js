
function randomVersion() {
    return '?v=' + (+new Date()) + (99 * Math.random() << 0);
}


//	Polyfills

/*


Array
    prototype:
        first
        last
        randomIndex
        randomElement

    method:
        getRandom
        getHalfRandom
        shuffle
        moveIndex

String
    prototype:
        isEmpty
        replaceAt

*/

//Object.assign
"function" != typeof Object.assign && Object.defineProperty(Object, "assign", { value: function (e, t) { "use strict"; if (null == e) throw new TypeError("Cannot convert undefined or null to object"); for (var n = Object(e), r = 1; r < arguments.length; r++) { var o = arguments[r]; if (null != o) for (var c in o) Object.prototype.hasOwnProperty.call(o, c) && (n[c] = o[c]) } return n }, writable: !0, configurable: !0 });

//String.includes
String.prototype.includes || (String.prototype.includes = function (t, e) { "use strict"; return "number" != typeof e && (e = 0), !(e + t.length > this.length) && -1 !== this.indexOf(t, e) });

//Array.find
Array.prototype.find || Object.defineProperty(Array.prototype, "find", { value: function (r) { if (null == this) throw TypeError('"this" is null or not defined'); var t = Object(this), e = t.length >>> 0; if ("function" != typeof r) throw TypeError("predicate must be a function"); for (var i = arguments[1], o = 0; o < e;) { var n = t[o]; if (r.call(i, n, o, t)) return n; o++ } }, configurable: !0, writable: !0 });



Object.defineProperties(Array.prototype, {

    first: {
        get: function () {
            if (this.length == 0) return null;
            return this[0];
        },
    },

    last: {
        get: function () {
            if (this.length == 0) return null;
            return this[this.length - 1];
        },
    },

    randomIndex: { get: function () { return Math.floor(Math.random() * this.length); }, },

    randomElement: { get: function () { return this[this.randomIndex] }, },

});





Object.assign(Array.prototype, {

    getRandom: function (n) {
        var result = new Array(n),
            len = this.length,
            taken = new Array(len);
        if (n > len)
            throw new RangeError("getRandom: more elements taken than available");
        while (n--) {
            var x = Math.floor(Math.random() * len);
            result[n] = this[x in taken ? taken[x] : x];
            taken[x] = --len in taken ? taken[len] : len;
        }
        return result;
    },

    getHalfRandom: function () {
        var n = Math.ceil(this.length / 2);
        return this.getRandom(n);
    },


    shuffle: function () {
        var i = this.length, j, temp;
        if (i == 0) return this;
        while (--i) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this[i];
            this[i] = this[j];
            this[j] = temp;
        }
        return this;
    },

    moveIndex: function (oldIndex, newIndex) {
        // return Math.floor(Math.random() * this.length);
        if (newIndex >= this.length) {
            var k = newIndex - this.length + 1;
            while (k--) {
                this.push(undefined);
            }
        }
        this.splice(newIndex, 0, this.splice(oldIndex, 1)[0]);
        return this; // for testing
    },
})



Object.assign(String.prototype, {

    isEmpty: function () { return this === null || this.match(/^ *$/) !== null; },
    replaceAt: function () { return this.substr(0, index) + replacement + this.substr(index + replacement.length); },

})
