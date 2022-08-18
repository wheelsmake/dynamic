/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/dynamic.ts":
/*!************************!*\
  !*** ./src/dynamic.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/index */ "../utils/index.ts");
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/index */ "./src/utils/index.ts");
/* harmony import */ var _spa__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./spa */ "./src/spa.ts");
/* harmony import */ var _manifest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./manifest */ "./src/manifest.ts");
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_rootNode, _App_data, _App_proxy, _App_detectInsert;


const isBeta = true;
console.info(`dynamic(dnJS) ©LJM12914. https://github.com/wheelsmake/dynamic
You are using the unminified build of dynamic. Make sure to use the minified build for production.`);
const isDEVMode = "__dn_DEV__" in window && window.__dn_DEV__ === true && isBeta;
const s = [
    "鬼片出现了！",
    "Access to deleted property was blocked: "
];
class App {
    constructor(rootNode) {
        _App_instances.add(this);
        _App_rootNode.set(this, void 0);
        _App_data.set(this, {});
        _App_proxy.set(this, void 0);
        __classPrivateFieldSet(this, _App_rootNode, _utils_index__WEBPACK_IMPORTED_MODULE_0__.arguments.reduceToElement(rootNode), "f");
        console.info("creating new dynamic instance with rootNode", rootNode);
        __classPrivateFieldSet(this, _App_proxy, new Proxy(__classPrivateFieldGet(this, _App_data, "f"), {
            get(sharpData, property, proxy) {
                property = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.eliminateSymbol(property);
                console.log("get", property);
                if (property in sharpData && !sharpData[property].deleted) {
                    var result;
                    if (typeof sharpData[property].value == "function")
                        result = (sharpData[property].value.bind(proxy))();
                    else
                        result = sharpData[property].value;
                    if (typeof result == "object")
                        try {
                            result = JSON.stringify(result);
                        }
                        catch { }
                    return result;
                }
                else if (sharpData[property].deleted)
                    console.warn(`${s[1]}${property}.`);
                else
                    return undefined;
            },
            set(sharpData, property, newValue, proxy) {
                property = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.eliminateSymbol(property);
                console.log("set", property, newValue);
                if (property in sharpData && !sharpData[property].deleted) {
                    if (typeof newValue == "function") {
                    }
                    const oldValue = sharpData[property].value;
                    sharpData[property].value = newValue;
                    const exports = sharpData[property].shouldExports, updates = sharpData[property].shouldUpdates;
                    for (let i = 0; i < updates.length; i++) {
                    }
                    for (let i = 0; i < exports.length; i++)
                        (exports[i].bind(proxy))(oldValue);
                }
                else if (sharpData[property].deleted)
                    console.warn(`${s[1]}${property}.`);
                else {
                    sharpData[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData(newValue, [], []);
                    if (_utils_index__WEBPACK_IMPORTED_MODULE_1__.data) {
                    }
                }
                return true;
            },
            deleteProperty(sharpData, property) {
                property = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.eliminateSymbol(property);
                const exists = property in sharpData;
                if (exists)
                    sharpData[property].deleted = true;
                return exists;
            }
        }), "f");
        __classPrivateFieldGet(this, _App_instances, "m", _App_detectInsert).call(this, __classPrivateFieldGet(this, _App_rootNode, "f"));
    }
    get rootNode() { return __classPrivateFieldGet(this, _App_rootNode, "f"); }
    get data() { return __classPrivateFieldGet(this, _App_proxy, "f"); }
    get _() { return __classPrivateFieldGet(this, _App_proxy, "f"); }
    get __privateData__() {
        if (isDEVMode)
            return __classPrivateFieldGet(this, _App_data, "f");
        else
            return "BLOCKED IN NON-DEV MODE";
    }
    addExport(dataProperty, func) {
        return _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_data, "f")[dataProperty], func);
    }
    removeExport(dataProperty, func) {
        return _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.removeExport(__classPrivateFieldGet(this, _App_data, "f")[dataProperty], func);
    }
    parseTemplate(node) { __classPrivateFieldGet(this, _App_instances, "m", _App_detectInsert).call(this, node); }
}
_App_rootNode = new WeakMap(), _App_data = new WeakMap(), _App_proxy = new WeakMap(), _App_instances = new WeakSet(), _App_detectInsert = function _App_detectInsert(node) {
    if (node instanceof Element) {
        const data = this.data;
        Object.defineProperty(node, "data", {
            configurable: false,
            enumerable: true,
            get() { return data; }
        });
        Object.defineProperty(node, "_", {
            configurable: false,
            enumerable: true,
            get() { return data; }
        });
        const attrs = node.attributes, children = Array.from(node.childNodes);
        for (let i = 0; i < attrs.length; i++) {
            if (attrs[i].name.match(/:_[a-zA-Z$_][\w$]*_:/)) {
                const property = attrs[i].name.substring(2, attrs[i].name.length - 2);
                if (!(property in __classPrivateFieldGet(this, _App_data, "f")))
                    __classPrivateFieldGet(this, _App_data, "f")[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData();
                const __addedByDynamic__ = function (oldValue) {
                    const valueOfAttr = node.getAttribute(oldValue);
                    node.setAttribute(this[property], valueOfAttr);
                    node.removeAttribute(oldValue);
                };
                _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_data, "f")[property], __addedByDynamic__);
                __classPrivateFieldGet(this, _App_proxy, "f")[property] = undefined;
            }
            if (attrs[i].value.match(/:_[a-zA-Z$_][\w$]*_:/)) {
                const property = attrs[i].value.substring(2, attrs[i].value.length - 2), name = attrs[i].name;
                if (!(property in __classPrivateFieldGet(this, _App_data, "f")))
                    __classPrivateFieldGet(this, _App_data, "f")[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData();
                const __addedByDynamic__ = function () {
                    node.setAttribute(name, this[property]);
                };
                _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_data, "f")[property], __addedByDynamic__);
                __classPrivateFieldGet(this, _App_proxy, "f")[property] = undefined;
            }
        }
        for (let i = 0; i < node.childNodes.length; i++)
            __classPrivateFieldGet(this, _App_instances, "m", _App_detectInsert).call(this, node.childNodes[i]);
    }
    else if (node instanceof Text) {
        if (node.textContent) {
            const inserts = [...node.textContent.matchAll(/:_[a-zA-Z$_][\w$]*_:/g)];
            if (inserts.length > 0) {
                const offsets = [], properties = [], text = node.textContent;
                for (let i = 0; i < inserts.length; i++) {
                    const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                    offsets.push(inserts[i].index);
                    properties.push(property);
                    if (!(property in __classPrivateFieldGet(this, _App_data, "f")))
                        __classPrivateFieldGet(this, _App_data, "f")[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData();
                }
                if (offsets.length != properties.length)
                    console.error(s[0], offsets, properties);
                const NRproperties = _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.noRepeat(properties);
                const __addedByDynamic__ = function () {
                    var t = text;
                    for (let i = 0; i < NRproperties.length; i++)
                        t = t.replaceAll(`:_${NRproperties[i]}_:`, this[NRproperties[i]]);
                    node.textContent = t;
                };
                for (let i = 0; i < NRproperties.length; i++) {
                    _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_data, "f")[NRproperties[i]], __addedByDynamic__);
                    __classPrivateFieldGet(this, _App_proxy, "f")[NRproperties[i]] = undefined;
                }
            }
        }
    }
    else
        console.error(s[0], node);
};


const Dynamic = {
    new(rootNode) {
        return new App(rootNode);
    },
    spa: _spa__WEBPACK_IMPORTED_MODULE_2__, manifest: _manifest__WEBPACK_IMPORTED_MODULE_3__,
    e(s, scope) { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.e(s, scope); },
    debugger() {
        return setInterval(() => {
            debugger;
        }, 20);
    }
};
_utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.constantize(Dynamic);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dynamic);


/***/ }),

/***/ "./src/manifest.ts":
/*!*************************!*\
  !*** ./src/manifest.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add": () => (/* binding */ add)
/* harmony export */ });
function add() {
}


/***/ }),

/***/ "./src/spa.ts":
/*!********************!*\
  !*** ./src/spa.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getHash": () => (/* binding */ getHash),
/* harmony export */   "getSearch": () => (/* binding */ getSearch)
/* harmony export */ });
function getSearch() {
    var s = location.search;
    if (s != "") {
        s = s.substring(1);
        const result = {};
        s.split("&").forEach(value => {
            const sp = value.split("=");
            result[sp[0]] = sp[1];
        });
        return result;
    }
    else
        return null;
}
function getHash() {
}


/***/ }),

/***/ "./src/utils/data.ts":
/*!***************************!*\
  !*** ./src/utils/data.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "addExport": () => (/* binding */ addExport),
/* harmony export */   "createData": () => (/* binding */ createData),
/* harmony export */   "isComputedProperty": () => (/* binding */ isComputedProperty),
/* harmony export */   "pushCache": () => (/* binding */ pushCache),
/* harmony export */   "removeExport": () => (/* binding */ removeExport)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/index */ "../utils/index.ts");

function createData(value, shouldUpdate, shouldExport) {
    const result = {
        value,
        deleted: false,
        shouldUpdates: shouldUpdate ? shouldUpdate : [],
        shouldExports: shouldExport ? shouldExport : []
    };
    if (isComputedProperty(result))
        result.cache = undefined;
    return result;
}
function addExport(dataInstance, func) {
    const sE = dataInstance.shouldExports, funcString = func.toString();
    if (funcString.match(/^\([^\(\)]*\)[\s]*=>/))
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("func", "exportFunc", func, "export function must not be an arrow function");
    if (sE.indexOf(func) == -1)
        sE.push(func);
    else
        console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    return sE;
}
function removeExport(dataInstance, func) {
    const sE = dataInstance.shouldExports;
    if (typeof func == "string") {
        if (func == "__addedByDynamic__")
            _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("func", "string | exportFunc", func, "this name is reserved");
        else if (func == "")
            console.warn("Operation blocked trying to remove ALL annoymous functions. Use the function itself for argument instead.");
        else
            for (let i = 0; i < sE.length; i++)
                if (sE[i].name === func)
                    _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.precisePop(sE[i], sE);
    }
    else if (typeof func == "function")
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.precisePop(func, sE);
    else
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("func", "string | exportFunc", func);
    return sE;
}
function isComputedProperty(data) {
    return typeof data.value == "function";
}
function pushCache() {
}


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "data": () => (/* reexport module object */ _data__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   "misc": () => (/* reexport module object */ _misc__WEBPACK_IMPORTED_MODULE_1__)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/utils/data.ts");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc */ "./src/utils/misc.ts");






/***/ }),

/***/ "./src/utils/misc.ts":
/*!***************************!*\
  !*** ./src/utils/misc.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eliminateSymbol": () => (/* binding */ eliminateSymbol)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/index */ "../utils/index.ts");

function eliminateSymbol(property) {
    if (typeof property == "symbol")
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E(property.toString(), "string", property, "index of Dynamic.data must not be a Symbol");
    return property;
}


/***/ }),

/***/ "../utils/arguments.ts":
/*!*****************************!*\
  !*** ../utils/arguments.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reduceToElement": () => (/* binding */ reduceToElement)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../utils/index.ts");

function reduceToElement(input) {
    if (input instanceof Element)
        return input;
    else if (typeof input == "string") {
        const el = _index__WEBPACK_IMPORTED_MODULE_0__.element.e(input);
        if (el instanceof Node)
            return el;
        else
            _index__WEBPACK_IMPORTED_MODULE_0__.generic.E("rootNode", "string | Element", input, "rootNode should be a VALID #id selector");
    }
    else
        _index__WEBPACK_IMPORTED_MODULE_0__.generic.E("rootNode", "string | Element", input, "rootNode should be a #id selector or an Element");
}


/***/ }),

/***/ "../utils/element.ts":
/*!***************************!*\
  !*** ../utils/element.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "e": () => (/* binding */ e),
/* harmony export */   "getInnerNodes": () => (/* binding */ getInnerNodes),
/* harmony export */   "hatch": () => (/* binding */ hatch),
/* harmony export */   "isChild": () => (/* binding */ isChild),
/* harmony export */   "isDescendant": () => (/* binding */ isDescendant),
/* harmony export */   "isInDocument": () => (/* binding */ isInDocument),
/* harmony export */   "render": () => (/* binding */ render),
/* harmony export */   "toHTML": () => (/* binding */ toHTML)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../utils/index.ts");

function e(s, scope) {
    if (scope === undefined || !(scope instanceof Element))
        scope = document;
    let a = scope.querySelectorAll(s);
    if (!a.length)
        return [];
    if (a.length == 1 && s.match(/^.*#[^\s]*$/))
        return a[0];
    else
        return Array.from(a);
}
function isDescendant(possibleDescendant, possibleParent) {
    while (possibleDescendant.tagName != "HTML") {
        possibleDescendant = possibleDescendant.parentNode;
        if (possibleDescendant === possibleParent)
            return true;
    }
    return false;
}
function isInDocument(element) {
    return isDescendant(element, e("html")[0]);
}
function isChild(element, target) {
    const children = target.childNodes;
    for (let i = 0; i < children.length; i++)
        if (element === children[i])
            return true;
    return false;
}
function toHTML(HTML) {
    if (HTML === "" || typeof HTML != "string")
        _index__WEBPACK_IMPORTED_MODULE_0__.generic.E("HTML", "string", HTML);
    const ele = document.createElement("div");
    ele.innerHTML = HTML;
    return getInnerNodes(ele);
}
function getInnerNodes(el) {
    var nodes = [];
    for (let i = 0; i < el.childNodes.length; i++)
        nodes[i] = el.childNodes[i].cloneNode(true);
    return nodes;
}
function hatch(element, remove) {
    const par = element.parentElement, children = Array.from(element.childNodes);
    for (let i = 0; i < children.length; i++)
        par.insertBefore(children[i], element);
    if (remove === true)
        element.remove();
    return children;
}
function render(HTML, element, insertAfter, append, disableDF) {
    if (element.parentElement === null)
        _index__WEBPACK_IMPORTED_MODULE_0__.generic.EE("cannot render by '<html>' element, since it's root of document.");
    var html = [];
    if (typeof HTML == "string")
        html = toHTML(HTML);
    else if (HTML instanceof Element || HTML instanceof Node)
        html[0] = HTML.cloneNode(true);
    else if (HTML instanceof HTMLCollection || HTML instanceof NodeList)
        for (let i = 0; i < HTML.length; i++)
            html[i] = HTML.item(i).cloneNode(true);
    else
        html = HTML;
    const Rhtml = [...html].reverse(), parent = element.parentElement;
    if (append === true)
        for (let i = 0; i < html.length; i++)
            element.append(html[i]);
    else if (append === false)
        for (let i = 0; i < Rhtml.length; i++)
            element.prepend(Rhtml[i]);
    else if (insertAfter === true) {
        if (!element.nextSibling)
            for (let i = 0; i < Rhtml.length; i++)
                parent.append(Rhtml[i]);
        else
            for (let i = 0; i < Rhtml.length; i++)
                parent.insertBefore(Rhtml[i], element.nextSibling);
    }
    else if (insertAfter === false)
        for (let i = 0; i < html.length; i++)
            parent.insertBefore(html[i], element);
    else
        for (let i = 0; i < html.length; i++)
            element.append(html[i]);
    return html;
}


/***/ }),

/***/ "../utils/generic.ts":
/*!***************************!*\
  !*** ../utils/generic.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E": () => (/* binding */ E),
/* harmony export */   "EE": () => (/* binding */ EE),
/* harmony export */   "constantize": () => (/* binding */ constantize),
/* harmony export */   "noRepeat": () => (/* binding */ noRepeat),
/* harmony export */   "precisePop": () => (/* binding */ precisePop),
/* harmony export */   "randoma2Z": () => (/* binding */ randoma2Z),
/* harmony export */   "randoma2z029": () => (/* binding */ randoma2z029),
/* harmony export */   "repeat": () => (/* binding */ repeat)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../utils/index.ts");

function randoma2Z(length) {
    var s = "";
    for (let i = 0; i < length; i++) {
        let r = Math.floor(Math.random() * 52);
        if (r > 25)
            s += String.fromCharCode(r + 71);
        else
            s += String.fromCharCode(r + 65);
    }
    return s;
}
function randoma2z029(length) {
    var s = "";
    for (let i = 0; i < length; i++) {
        let r = Math.floor(Math.random() * 36);
        if (r < 10)
            s += r;
        else
            s += String.fromCharCode(r + 87);
    }
    return s;
}
function precisePop(ele, array) {
    if (array.indexOf(ele) === -1)
        return null;
    return array.splice(array.indexOf(ele), 1)[0];
}
function constantize(obj) {
    Object.freeze(obj);
    for (let i = 0; i < Object.keys(obj).length; i++)
        if (typeof obj[Object.keys(obj)[i]] == "object")
            constantize(obj[Object.keys(obj)[i]]);
}
function E(argument, type, value, reason) {
    if (argument === undefined)
        throw new Error("An error occured.");
    else {
        console.error("ERROR INFO: argument", argument, ",type", type, ",value", value, ",reason", reason);
        throw new Error(`Argument '${argument}' ${type ? `should be a(an) ${type}` : "is invalid"}${reason ? `, reason: ${reason}` : ""}${value ? `, got ${value}` : ""}.`);
    }
}
function EE(message) { throw new Error(message); }
function repeat(item, count) {
    if (typeof count != "number" || count < 1)
        _index__WEBPACK_IMPORTED_MODULE_0__.generic.E("count", "integer bigger than 0", count);
    return Array(count).fill(item, 0, count);
}
function noRepeat(input) {
    return Array.from(new Set(input));
}


/***/ }),

/***/ "../utils/index.ts":
/*!*************************!*\
  !*** ../utils/index.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "arguments": () => (/* reexport module object */ _arguments__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   "element": () => (/* reexport module object */ _element__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "generic": () => (/* reexport module object */ _generic__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _generic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generic */ "../utils/generic.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element */ "../utils/element.ts");
/* harmony import */ var _arguments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./arguments */ "../utils/arguments.ts");








/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/dynamic.export.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dynamic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dynamic */ "./src/dynamic.ts");

Object.defineProperty(window, "Dynamic", {
    configurable: false,
    writable: false,
    enumerable: true,
    value: _dynamic__WEBPACK_IMPORTED_MODULE_0__["default"]
});

})();

/******/ })()
;
//# sourceMappingURL=dynamic.js.map