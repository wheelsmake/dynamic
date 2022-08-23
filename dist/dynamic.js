﻿/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ App)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/index */ "../utils/index.ts");
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/index */ "./src/utils/index.ts");
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
var _App_instances, _App_rootNode, _App_data, _App_proxy, _App_initData, _App_methods, _App_hydrate, _App_aOProcessorStore, _App_dOProcessorStore, _App_cOProcessorStore, _App_observer;


console.info(`dynamic(dnJS) ©LJM12914. https://github.com/wheelsmake/dynamic
You are using the unminified build of dynamic. Make sure to use the minified build for production.`);
const s = [
    "鬼片出现了！",
    "Access to deleted property was blocked: "
], HTMLDSLs = {
    twoWayBinding: {
        leftBracket: "_:",
        rightBracket: ":_"
    },
    oneWayBinding: {
        leftBracket: "_-",
        rightBracket: "-_"
    },
    attrAdditional: ":"
}, twoWayBindingRegExp = new RegExp(`^${HTMLDSLs.twoWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.twoWayBinding.rightBracket}$`), oneWayBindingRegExp = new RegExp(`^${HTMLDSLs.oneWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.oneWayBinding.rightBracket}$`), nSoneWayBindingRegExp = new RegExp(`${HTMLDSLs.oneWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.oneWayBinding.rightBracket}`, "g");
class App {
    constructor(rootNode) {
        _App_instances.add(this);
        _App_rootNode.set(this, void 0);
        _App_data.set(this, {});
        _App_proxy.set(this, {});
        _App_methods.set(this, {});
        _App_aOProcessorStore.set(this, new WeakMap());
        _App_dOProcessorStore.set(this, new WeakMap());
        _App_cOProcessorStore.set(this, new WeakMap());
        _App_observer.set(this, new MutationObserver((records) => {
            for (let i = 0; i < records.length; i++) {
                const record = records[i], type = record.type;
                console.log(record);
                if (type == "attributes" && __classPrivateFieldGet(this, _App_aOProcessorStore, "f").has(record.target))
                    __classPrivateFieldGet(this, _App_aOProcessorStore, "f").get(record.target)(record);
                else if (type == "characterData" && __classPrivateFieldGet(this, _App_dOProcessorStore, "f").has(record.target))
                    __classPrivateFieldGet(this, _App_dOProcessorStore, "f").get(record.target)(record);
                else if (type == "childList" && __classPrivateFieldGet(this, _App_cOProcessorStore, "f").has(record.target))
                    __classPrivateFieldGet(this, _App_cOProcessorStore, "f").get(record.target)(record);
            }
        }));
        __classPrivateFieldSet(this, _App_rootNode, _utils_index__WEBPACK_IMPORTED_MODULE_0__.arguments.reduceToElement(rootNode), "f");
        console.info("creating new dynamic instance with rootNode", rootNode);
        __classPrivateFieldGet(this, _App_instances, "m", _App_initData).call(this);
        __classPrivateFieldGet(this, _App_instances, "m", _App_hydrate).call(this, __classPrivateFieldGet(this, _App_rootNode, "f"));
        __classPrivateFieldGet(this, _App_observer, "f").observe(__classPrivateFieldGet(this, _App_rootNode, "f"), {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
        });
    }
    get rootNode() { return __classPrivateFieldGet(this, _App_rootNode, "f"); }
    get data() { return __classPrivateFieldGet(this, _App_proxy, "f"); }
    get _() { return __classPrivateFieldGet(this, _App_proxy, "f"); }
    get __DEV_data__() { return __classPrivateFieldGet(this, _App_data, "f"); }
    addExport(dataProperty, func, target) { return _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_proxy, "f"), __classPrivateFieldGet(this, _App_data, "f")[dataProperty], func, target); }
    removeExport(dataProperty, func) { return _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.removeExport(__classPrivateFieldGet(this, _App_data, "f")[dataProperty], func); }
    addMethods() {
    }
    removeMethods() {
    }
    hydrate(node) {
        if (__classPrivateFieldGet(this, _App_rootNode, "f").contains(node))
            __classPrivateFieldGet(this, _App_instances, "m", _App_hydrate).call(this, node);
        else
            _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("node", undefined, node, "the input node must be a descendant of the rootNode");
    }
}
_App_rootNode = new WeakMap(), _App_data = new WeakMap(), _App_proxy = new WeakMap(), _App_methods = new WeakMap(), _App_aOProcessorStore = new WeakMap(), _App_dOProcessorStore = new WeakMap(), _App_cOProcessorStore = new WeakMap(), _App_observer = new WeakMap(), _App_instances = new WeakSet(), _App_initData = function _App_initData() {
    __classPrivateFieldSet(this, _App_proxy, new Proxy(__classPrivateFieldGet(this, _App_data, "f"), {
        get(sharpData, property, proxy) {
            property = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.eliminateSymbol(property);
            if (property in sharpData && !sharpData[property].deleted) {
                let result;
                if (_utils_index__WEBPACK_IMPORTED_MODULE_1__.data.isComputedProperty(sharpData[property])) {
                    result = (sharpData[property].value.bind(proxy))(proxy);
                    sharpData[property].value;
                }
                else
                    result = sharpData[property].value;
                return result;
            }
            else if (!(property in sharpData))
                return undefined;
            else if (sharpData[property].deleted)
                console.warn(`${s[1]}${property}.`);
            else
                console.error(s[0], "get", property);
        },
        set(sharpData, property, newValue, proxy) {
            property = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.eliminateSymbol(property);
            if (property in sharpData && !sharpData[property].deleted) {
                if (typeof newValue == "function") {
                }
                const oldValue = sharpData[property].value;
                sharpData[property].value = newValue;
                if (oldValue !== newValue) {
                    const exportInstances = sharpData[property].shouldExports, updates = sharpData[property].shouldUpdates;
                    for (let i = 0; i < updates.length; i++) {
                    }
                    for (let i = 0; i < exportInstances.length; i++) {
                        (exportInstances[i][0].bind(proxy))(exportInstances[i], oldValue);
                    }
                }
            }
            else if (!(property in sharpData)) {
                if (typeof newValue == "function") {
                }
                else if (typeof newValue == "object") {
                }
                sharpData[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData(newValue);
            }
            else if (sharpData[property].deleted)
                console.warn(`${s[1]}${property}.`);
            else
                console.error(s[0], "set", property);
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
}, _App_hydrate = function _App_hydrate(node) {
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
        const attrs = Array.from(node.attributes), children = Array.from(node.childNodes);
        for (let i = 0; i < attrs.length; i++) {
            let name = attrs[i].name, value = attrs[i].value;
            if (name.match(twoWayBindingRegExp) || name.match(oneWayBindingRegExp)) {
                if (name.match(twoWayBindingRegExp))
                    console.warn(`It's not rational to declare a two-way binding attribute name: ${name}, automatically treated as one-way binding. Use "${HTMLDSLs.oneWayBinding.leftBracket}${name.substring(2, name.length - 2)}${HTMLDSLs.oneWayBinding.rightBracket}" instead.`);
                if (value.match(twoWayBindingRegExp) || value.match(oneWayBindingRegExp))
                    console.warn("Cannot set an attribute with both name and value dynamic. Dynamic will make only attribute name dynamic.");
                const property = name.substring(2, name.length - 2);
                const __addedByDynamic__ = function (exportInstance, oldValue) {
                    const newValue = this[property];
                    if (oldValue !== newValue) {
                        const thisNode = exportInstance[1], valueOfAttr = thisNode.getAttribute(oldValue);
                        thisNode.removeAttribute(oldValue);
                        if (newValue !== "") {
                            if (typeof newValue == "string" && newValue !== newValue.toLowerCase())
                                console.warn(`Attribute names are case insensitive, don't pass string with upper-case letters which may cause bugs: ${newValue}`);
                            thisNode.setAttribute(newValue, valueOfAttr);
                        }
                    }
                };
                node.removeAttribute(name);
                if (!(property in __classPrivateFieldGet(this, _App_proxy, "f")))
                    __classPrivateFieldGet(this, _App_proxy, "f")[property] = undefined;
                _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_proxy, "f"), __classPrivateFieldGet(this, _App_data, "f")[property], __addedByDynamic__, node);
                node.setAttribute(__classPrivateFieldGet(this, _App_proxy, "f")[property], value);
            }
            else if (value.match(twoWayBindingRegExp) || value.match(oneWayBindingRegExp)) {
                const property = value.substring(2, value.length - 2);
                node.removeAttribute(name);
                if (name[name.length - 1] == HTMLDSLs.attrAdditional)
                    name = name.substring(0, name.length - 1);
                let name_default_processed = name, __addedByDynamic__;
                if ((name_default_processed == "value" || name_default_processed == "checked")
                    && node instanceof HTMLInputElement
                    && name_default_processed in node)
                    __addedByDynamic__ = function (exportInstance, oldValue) {
                        node[name_default_processed] = this[property];
                    };
                else {
                    if (node instanceof HTMLInputElement) {
                        if (name_default_processed == "defaultvalue" && "defaultValue" in node)
                            name_default_processed = "value";
                        else if (name_default_processed == "defaultchecked" && "defaultChecked" in node)
                            name_default_processed = "checked";
                    }
                    __addedByDynamic__ = function (exportInstance, oldValue) {
                        const newValue = this[property];
                        if (oldValue !== newValue) {
                            if (newValue === null)
                                node.removeAttribute(name_default_processed);
                            else
                                node.setAttribute(name_default_processed, newValue);
                        }
                    };
                }
                if (!(property in __classPrivateFieldGet(this, _App_proxy, "f")))
                    __classPrivateFieldGet(this, _App_proxy, "f")[property] = undefined;
                _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_proxy, "f"), __classPrivateFieldGet(this, _App_data, "f")[property], __addedByDynamic__, node);
                node.setAttribute(name_default_processed, __classPrivateFieldGet(this, _App_proxy, "f")[property]);
                if (value.match(twoWayBindingRegExp)) {
                    if (node instanceof HTMLInputElement) {
                        if (name == "value") {
                            node.addEventListener("input", (e) => {
                                if (e.target === node)
                                    __classPrivateFieldGet(this, _App_proxy, "f")[property] = node.value;
                            });
                        }
                        else if (name == "checked") {
                            node.addEventListener("input", (e) => {
                                if (e.target === node)
                                    __classPrivateFieldGet(this, _App_proxy, "f")[property] = node.checked;
                            });
                        }
                    }
                    else {
                        __classPrivateFieldGet(this, _App_aOProcessorStore, "f").set(node, (record) => {
                            if (record.attributeName === name_default_processed
                                && node.getAttribute(record.attributeName) !== __classPrivateFieldGet(this, _App_proxy, "f")[property])
                                __classPrivateFieldGet(this, _App_proxy, "f")[property] = node.getAttribute(record.attributeName);
                        });
                    }
                }
            }
        }
        for (let i = 0; i < children.length; i++)
            __classPrivateFieldGet(this, _App_instances, "m", _App_hydrate).call(this, children[i]);
    }
    else if (node instanceof Text) {
        if (node.textContent) {
            const text = node.textContent, inserts = [...text.matchAll(nSoneWayBindingRegExp)];
            if (inserts.length > 0) {
                const offsets = [], properties = [], parent = node.parentNode, nextNode = node.nextSibling;
                for (let i = 0; i < inserts.length; i++) {
                    const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                    offsets.push(inserts[i].index);
                    properties.push(property);
                    if (!(property in __classPrivateFieldGet(this, _App_proxy, "f")))
                        __classPrivateFieldGet(this, _App_proxy, "f")[property] = undefined;
                }
                const NRproperties = _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.noRepeat(properties);
                const __addedByDynamic__ = function (exportInstance) {
                    let t = text;
                    if (!document.contains(exportInstance[1])) {
                        exportInstance[1] = document.createTextNode(text);
                        parent.insertBefore(exportInstance[1], nextNode);
                    }
                    let thisNode = exportInstance[1];
                    for (let i = 0; i < NRproperties.length; i++) {
                        let data = this[NRproperties[i]];
                        if (typeof data == "object")
                            data = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.advancedStringify(data);
                        t = t.replaceAll(`${HTMLDSLs.oneWayBinding.leftBracket}${NRproperties[i]}${HTMLDSLs.oneWayBinding.rightBracket}`, data);
                    }
                    thisNode.textContent = t;
                };
                for (let i = 0; i < NRproperties.length; i++) {
                    if (!(NRproperties[i] in __classPrivateFieldGet(this, _App_proxy, "f")))
                        __classPrivateFieldGet(this, _App_proxy, "f")[NRproperties[i]] = undefined;
                    _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(__classPrivateFieldGet(this, _App_proxy, "f"), __classPrivateFieldGet(this, _App_data, "f")[NRproperties[i]], __addedByDynamic__, node);
                }
            }
            else if (text.match(twoWayBindingRegExp)) {
                if (!(node.parentElement instanceof HTMLElement))
                    console.warn("It's no use adding a two-way binding insert to an SVGElement, but dynamic will continue anyway.");
            }
        }
    }
};


/***/ }),

/***/ "./src/dynamic.export.ts":
/*!*******************************!*\
  !*** ./src/dynamic.export.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/index */ "../utils/index.ts");
/* harmony import */ var _app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app */ "./src/app.ts");
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./template */ "./src/template.ts");
/* harmony import */ var _spa__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./spa */ "./src/spa.ts");
/* harmony import */ var _manifest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./manifest */ "./src/manifest.ts");





const cI = clearInterval;
var dtInterval;
function __disableDevTools__() {
    dtInterval = (() => {
        return setInterval(() => {
            debugger;
        }, 20);
    })();
    clearInterval = (id) => {
        if (id != dtInterval)
            cI.call(window, id);
    };
}
function __enableDevTools__() {
    clearInterval = cI;
    clearInterval(dtInterval);
}
function Dynamic(rootNode) { return new _app__WEBPACK_IMPORTED_MODULE_1__["default"](rootNode); }
((obj) => {
    for (let i in obj)
        Dynamic[i] = obj[i];
})({
    template: _template__WEBPACK_IMPORTED_MODULE_2__, spa: _spa__WEBPACK_IMPORTED_MODULE_3__, manifest: _manifest__WEBPACK_IMPORTED_MODULE_4__,
    e(s, scope) { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.e(s, scope); },
    render(args) { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.render(args.HTML, args.element, args.insertAfter, args.append); },
    toHTML(HTML) { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.toHTML(HTML); },
    hatch(element, remove) { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.hatch(element, remove); },
    compose() { },
    __disableDevTools__,
    __enableDevTools__,
    constructor() { console.log("a"); }
});
_utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.constantize(Dynamic);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Dynamic);


/***/ }),

/***/ "./src/libs/cycle.ts":
/*!***************************!*\
  !*** ./src/libs/cycle.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decycle": () => (/* binding */ decycle)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/index */ "./src/utils/index.ts");

function decycle(object) {
    const objects = new WeakMap();
    return (function checkCycle(object, path) {
        if (typeof object === "object"
            && object !== null
            && !(object instanceof Boolean)
            && !(object instanceof Date)
            && !(object instanceof Number)
            && !(object instanceof RegExp)
            && !(object instanceof String)) {
            const prev_path = objects.get(object);
            if (prev_path !== undefined && path.indexOf(prev_path) != -1)
                return { $ref: prev_path };
            else
                objects.set(object, path);
            if (object instanceof Array) {
                const newObj = [];
                for (let i = 0; i < object.length; i++)
                    newObj[i] = checkCycle(object[i], path + "[" + i + "]");
                return newObj;
            }
            else {
                const newObj = {}, keys = Object.keys(object);
                if (keys.length != 0)
                    for (let i = 0; i < keys.length; i++)
                        newObj[keys[i]] = checkCycle(object[keys[i]], path + "[" + JSON.stringify(keys[i]) + "]");
                else {
                    const toStringed = _utils_index__WEBPACK_IMPORTED_MODULE_0__.misc.compatibleToString(object);
                    if (toStringed != "[object Object]")
                        return object;
                }
                return newObj;
            }
        }
        else
            return object;
    }(object, "$"));
}
;


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
    return location.hash.substring(1);
}


/***/ }),

/***/ "./src/template.ts":
/*!*************************!*\
  !*** ./src/template.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "register": () => (/* binding */ register)
/* harmony export */ });
function register() {
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
        shouldUpdates: shouldUpdate || [],
        shouldExports: shouldExport || []
    };
    if (isComputedProperty(result))
        result.cache = undefined;
    return result;
}
function addExport(proxy, dataInstance, func, target) {
    const sE = dataInstance.shouldExports, funcString = func.toString();
    if (funcString.match(/^\([^\(\)]*\)[\s]*=>/))
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("func", "exportFunc", func, "export function must not be an arrow function");
    let isDuplicated = false;
    for (let i = 0; i < sE.length; i++)
        if (sE[i][0] === func) {
            isDuplicated = true;
            break;
        }
    if (isDuplicated)
        console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    else {
        const instance = [func, target];
        sE.push(instance);
        (func.bind(proxy))(instance, dataInstance.value);
    }
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
                if (sE[i][0].name === func)
                    _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.precisePop(sE[i], sE);
    }
    else if (typeof func == "function")
        for (let i = 0; i < sE.length; i++)
            if (sE[i][0] === func)
                _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.precisePop(sE[i], sE);
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
/* harmony export */   "misc": () => (/* reexport module object */ _misc__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "type": () => (/* reexport module object */ _type__WEBPACK_IMPORTED_MODULE_2__)
/* harmony export */ });
/* harmony import */ var _data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data */ "./src/utils/data.ts");
/* harmony import */ var _misc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./misc */ "./src/utils/misc.ts");
/* harmony import */ var _type__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./type */ "./src/utils/type.ts");








/***/ }),

/***/ "./src/utils/misc.ts":
/*!***************************!*\
  !*** ./src/utils/misc.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "advancedStringify": () => (/* binding */ advancedStringify),
/* harmony export */   "compatibleToString": () => (/* binding */ compatibleToString),
/* harmony export */   "eliminateSymbol": () => (/* binding */ eliminateSymbol)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/index */ "../utils/index.ts");
/* harmony import */ var _libs_cycle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../libs/cycle */ "./src/libs/cycle.ts");


function eliminateSymbol(property) {
    if (typeof property == "symbol")
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E(property.toString(), "string", property, "index of Dynamic.data must not be a Symbol");
    return property;
}
const toString = Object.prototype.toString;
function advancedStringify(input) {
    if (typeof input != "object")
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("input", "object", input);
    if (input === null)
        return "null";
    else {
        let result = "{";
        const properties = Object.keys(input), toStringed = compatibleToString(input);
        if (properties.length == 0) {
            if (toStringed != "[object Object]")
                return toStringed;
            else
                return "{}";
        }
        else {
            const input_ = _libs_cycle__WEBPACK_IMPORTED_MODULE_1__.decycle(input);
            for (let i = 0; i < properties.length; i++) {
                const key = properties[i], value = input_[key], type = typeof value;
                if (type == "undefined" || type == "number" || type == "boolean")
                    addResult(value);
                else if (type == "string")
                    addResult(`"${value}"`);
                else if (type == "bigint")
                    addResult(value + "n");
                else if (type == "symbol")
                    addResult(value.toString());
                else if (type == "function")
                    addResult(compatibleToString(value));
                else if (type == "object")
                    addResult(advancedStringify(value));
                if (i < properties.length - 1)
                    result += ", ";
                function addResult(input2) {
                    result += `${key}: ${input2}`;
                }
            }
            result += "}";
            return result;
        }
    }
}
function compatibleToString(input2) {
    return "toString" in input2 ? input2.toString() : toString.call(input2);
}


/***/ }),

/***/ "./src/utils/type.ts":
/*!***************************!*\
  !*** ./src/utils/type.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



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
/* harmony export */   "getInnerNodesClone": () => (/* binding */ getInnerNodesClone),
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
    return possibleParent.contains(possibleDescendant);
}
function isInDocument(node) {
    return (e("html")[0]).contains(node);
}
function isChild(node, target) {
    return Array.from(target.childNodes).indexOf(node) != -1;
}
function toHTML(HTML) {
    if (HTML === "" || typeof HTML != "string")
        _index__WEBPACK_IMPORTED_MODULE_0__.generic.E("HTML", "string", HTML);
    const ele = document.createElement("div");
    ele.innerHTML = HTML;
    return getInnerNodesClone(ele);
}
function getInnerNodesClone(el) {
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
function render(HTML, element, insertAfter, append) {
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
/*!*************************************!*\
  !*** ./src/dynamic.defineGlobal.ts ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dynamic_export__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dynamic.export */ "./src/dynamic.export.ts");

Object.defineProperty(window, "Dynamic", {
    configurable: false,
    writable: false,
    enumerable: true,
    value: _dynamic_export__WEBPACK_IMPORTED_MODULE_0__["default"]
});

})();

/******/ })()
;
//# sourceMappingURL=dynamic.js.map