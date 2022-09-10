/******/ (() => { // webpackBootstrap
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


const version = "2.0.0";
console.info(`dynamic(dnJS) v${version} ©LJM12914. https://github.com/wheelsmake/dynamic
    You are using the unminified build of dynamic. Make sure to use the minified build for production.`);
const DSL = {
    two: {
        l: "_:",
        r: ":_"
    },
    one: {
        l: "_-",
        r: "-_"
    },
    attr: ":"
}, twoWayBindingRegExp = new RegExp(`^${DSL.two.l}[a-zA-Z$_][\\w$]*${DSL.two.r}$`), oneRegExp = new RegExp(`^${DSL.one.l}[a-zA-Z$_][\\w$]*${DSL.one.r}$`), nStwoWayBindingRegExp = new RegExp(`${DSL.two.l}[a-zA-Z$_][\\w$]*${DSL.two.r}`, "g"), nSoneRegExp = new RegExp(`${DSL.one.l}[a-zA-Z$_][\\w$]*${DSL.one.r}`, "g"), $ = [
    "鬼片出现了！",
    "",
    ", automatically treated as one-way binding.",
    "function",
    "DO NOT USE ",
    " in Dynamic instance.",
    " is a reserved property."
];
function App(rootNode_, options_) {
    const rootNode = _utils_index__WEBPACK_IMPORTED_MODULE_0__.arguments.reduceToElement(rootNode_);
    const dataStore = {};
    const publics = {
        rootNode,
        hydrate,
        addExport,
        removeExport,
        getExports
    };
    const aOProcessorStore = new WeakMap();
    const dOProcessorStore = new WeakMap();
    const cOProcessorStore = new WeakMap();
    const observer = new MutationObserver((records) => {
        for (let i = 0; i < records.length; i++) {
            const record = records[i], type = record.type;
            if (type == "attributes" && aOProcessorStore.has(record.target))
                aOProcessorStore.get(record.target)(record);
            else if (type == "characterData" && dOProcessorStore.has(record.target))
                dOProcessorStore.get(record.target)(record);
            else if (type == "childList" && cOProcessorStore.has(record.target))
                cOProcessorStore.get(record.target)(record);
        }
    });
    const proxy = new Proxy(function () {
    }, {
        get(target, property, proxy) {
            if (property in publics)
                return publics[property];
            else if (property in dataStore) {
                let result;
                if (typeof dataStore[property].value == $[3])
                    result = dataStore[property].cache;
                else
                    result = dataStore[property].value;
                return result;
            }
            else
                return undefined;
        },
        set(target, property, newValue, proxy) {
            if (property in publics)
                _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.EE(`${property}${$[6]}`);
            else if (property in dataStore) {
                const oldValue = dataStore[property].value;
                if (oldValue !== newValue) {
                    dataStore[property].value = newValue;
                    processComputedProperty(dataStore[property]);
                    const exportInstances = dataStore[property].shouldExports;
                    for (let i = 0; i < exportInstances.length; i++)
                        exportInstances[i][0].call(proxy, exportInstances[i], oldValue);
                    for (let i = 0; i < dataStore[property].shouldUpdates.length; i++)
                        dfsUpdate(dataStore[property].shouldUpdates[i]);
                    function dfsUpdate(prop) {
                        if (prop in dataStore && typeof dataStore[prop].value == $[3]) {
                            const dfsOldValue = dataStore[prop].cache;
                            dataStore[prop].cache = dataStore[prop].value.call(proxy);
                            const exportInstances = dataStore[prop].shouldExports;
                            for (let i = 0; i < exportInstances.length; i++)
                                exportInstances[i][0].call(proxy, exportInstances[i], dfsOldValue);
                            for (let i = 0; i < dataStore[prop].shouldUpdates.length; i++)
                                dfsUpdate(dataStore[prop].shouldUpdates[i]);
                        }
                    }
                }
                else
                    console.log(`Update skipped in ${property} for same value ${newValue}`);
            }
            else {
                dataStore[property] = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.createData(newValue);
                processComputedProperty(dataStore[property]);
            }
            return true;
            function processComputedProperty(dataInstance) {
                if (typeof newValue == $[3]) {
                    _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.checkArrowFunction(newValue);
                    dataInstance.cache = newValue.call(proxy);
                    const shouldUpdateThis = _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.detectShouldUpdate(Function.prototype.toString.call(newValue));
                    for (let i = 0; i < shouldUpdateThis.length; i++) {
                        if (!(shouldUpdateThis[i] in dataStore))
                            proxy[shouldUpdateThis[i]] = undefined;
                        if (dataStore[shouldUpdateThis[i]].shouldUpdates.indexOf(property) == -1)
                            dataStore[shouldUpdateThis[i]].shouldUpdates.push(property);
                    }
                }
                else
                    delete dataInstance.cache;
            }
        },
        deleteProperty(target, property) {
            const exists = property in dataStore;
            if (property in publics)
                _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.EE(`${property}${$[6]}`);
            else if (exists)
                delete dataStore[property];
            return exists;
        },
        apply(target, thisArg, argArray) {
            console.log("update all computed data properties");
        },
        construct(target, argArray, newTarget) {
            return { argArray, newTarget };
        },
        defineProperty() { _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.EE(`${$[4]}defineProperty${$[5]}`); return false; },
        preventExtensions() { _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.EE(`${$[4]}preventExtensions${$[5]}`); return false; },
        setPrototypeOf() { _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.EE(`${$[4]}setPrototypeOf${$[5]}`); return false; }
    });
    function hydrate(node) {
        if (node instanceof Element) {
            _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.noErrorDefineProperties(node, {
                _: {
                    configurable: false,
                    enumerable: true,
                    get() { return proxy; }
                }
            });
            const attrs = Array.from(node.attributes), children = Array.from(node.childNodes);
            const tasks = [];
            for (let i = 0; i < attrs.length; i++) {
                let name = attrs[i].name, value = attrs[i].value;
                const nameOne = !!name.match(oneRegExp), nameTwo = !!name.match(twoWayBindingRegExp), valueOne = !!value.match(oneRegExp), valueTwo = !!value.match(twoWayBindingRegExp), nameInserted = nameOne || nameTwo, valueInserted = valueOne || valueTwo;
                let name_property, value_property, processed_avoidance_name, processed_avoidance_defaultTrap_name;
                if (nameTwo)
                    console.warn(`It's not rational to declare a two-way binding attribute name: ${name}${$[2]} Use "${DSL.one.l}${name.substring(2, name.length - 2)}${DSL.one.r}" instead.`);
                if (nameInserted && valueInserted)
                    console.warn("Cannot set an attribute with both name and value dynamic. Dynamic will make only attribute name dynamic.");
                if (nameInserted) {
                    name_property = name.substring(2, name.length - 2);
                    const symbol = Symbol();
                    const funcObj = {
                        [symbol]: function (exportInstance, oldValue) {
                            const newValue = this[name_property];
                            if (oldValue !== newValue) {
                                const thisNode = exportInstance[1], valueOfAttr = thisNode.getAttribute(oldValue);
                                thisNode.removeAttribute(oldValue);
                                if (newValue !== "") {
                                    if (typeof newValue == "string" && newValue !== newValue.toLowerCase())
                                        console.warn(`Attribute names are case insensitive, don't pass string with upper-case letters which may cause bugs: ${newValue}`);
                                    thisNode.setAttribute(newValue, valueOfAttr);
                                }
                            }
                        }
                    };
                    if (!(name_property in proxy))
                        proxy[name_property] = undefined;
                    _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(proxy, dataStore[name_property], funcObj[symbol], node);
                }
                else if (valueInserted) {
                    value_property = value.substring(2, value.length - 2);
                    if (name[name.length - 1] == DSL.attr)
                        processed_avoidance_name = name.substring(0, name.length - 1);
                    else
                        processed_avoidance_name = name;
                    let funcObj = {};
                    if ((processed_avoidance_name == "value" || processed_avoidance_name == "checked")
                        && node instanceof HTMLInputElement
                        && processed_avoidance_name in node)
                        funcObj.func = function (exportInstance, oldValue) {
                            const newValue = this[value_property];
                            if (oldValue !== newValue)
                                node[processed_avoidance_name] = newValue;
                        };
                    else {
                        if (node instanceof HTMLInputElement) {
                            if (processed_avoidance_name == "defaultvalue" && "defaultValue" in node)
                                processed_avoidance_defaultTrap_name = "value";
                            else if (processed_avoidance_name == "defaultchecked" && "defaultChecked" in node)
                                processed_avoidance_defaultTrap_name = "checked";
                            else
                                processed_avoidance_defaultTrap_name = processed_avoidance_name;
                        }
                        else
                            processed_avoidance_defaultTrap_name = processed_avoidance_name;
                        funcObj.func = function (exportInstance, oldValue) {
                            const newValue = this[value_property];
                            if (oldValue !== newValue) {
                                if (newValue === null)
                                    node.removeAttribute(processed_avoidance_defaultTrap_name);
                                else
                                    node.setAttribute(processed_avoidance_defaultTrap_name, newValue);
                            }
                        };
                    }
                    if (!(value_property in proxy))
                        proxy[value_property] = undefined;
                    _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(proxy, dataStore[value_property], funcObj.func, node);
                    if (valueTwo) {
                        if (node instanceof HTMLInputElement) {
                            if (name == "value") {
                                node.addEventListener("input", (e) => {
                                    if (e.target === node)
                                        proxy[value_property] = node.value;
                                });
                            }
                            else if (name == "checked") {
                                node.addEventListener("input", (e) => {
                                    if (e.target === node)
                                        proxy[value_property] = node.checked;
                                });
                            }
                        }
                        else {
                            aOProcessorStore.set(node, (record) => {
                                if (record.attributeName === processed_avoidance_defaultTrap_name
                                    && record.target.getAttribute(record.attributeName) !== proxy[value_property])
                                    proxy[value_property] = record.target.getAttribute(record.attributeName);
                            });
                        }
                    }
                }
                if (nameInserted)
                    tasks.push([1, name, name_property, value]);
                else if (valueInserted)
                    tasks.push([2, name, processed_avoidance_defaultTrap_name, value_property]);
            }
            for (let i = 0; i < tasks.length; i++) {
                const taskInstance = tasks[i];
                if (taskInstance[0] == 1) {
                    node.removeAttribute(taskInstance[1]);
                    node.setAttribute(proxy[taskInstance[2]], taskInstance[3]);
                }
                else if (taskInstance[0] == 2) {
                    if (taskInstance[2] === undefined)
                        node[taskInstance[1]] = proxy[taskInstance[3]];
                    else {
                        node.removeAttribute(taskInstance[1]);
                        node.setAttribute(taskInstance[2], proxy[taskInstance[3]]);
                    }
                }
            }
            for (let i = 0; i < children.length; i++)
                hydrate(children[i]);
        }
        else if (node instanceof Text) {
            if (node.textContent) {
                const text = node.textContent, twoWayInserts = [...text.matchAll(nStwoWayBindingRegExp)], inserts = [...text.matchAll(nSoneRegExp), ...twoWayInserts], matchTwoWayBinding = !!text.match(twoWayBindingRegExp), matchone = !!text.match(oneRegExp);
                if (twoWayInserts.length > 0 && !matchTwoWayBinding)
                    console.warn(`Two-way bindings in "${text}" cannot be used in textContent template${$[2]}`);
                if (matchTwoWayBinding) {
                    if (!(node.parentElement instanceof HTMLElement))
                        console.warn("It's no use adding a two-way binding insert to an SVGElement, but dynamic will continue anyway.");
                    const property = text.substring(2, text.length - 2), parent = node.parentNode;
                    if (parent.childNodes.length == 1) {
                        const symbol = Symbol();
                        const funcObj = {
                            [symbol]: function () {
                                const data = this[property];
                                if (parent.textContent !== data) {
                                    if (data instanceof Element || (data instanceof Array && data[0] instanceof Element)) {
                                        parent.innerHTML = "";
                                        if (data instanceof Element)
                                            parent.appendChild(data);
                                        else
                                            for (let i = 0; i < data.length; i++) {
                                                if (data[i] instanceof Element)
                                                    parent.appendChild(data[i]);
                                                else
                                                    parent.appendChild(document.createTextNode(_utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.advancedStringify(data[i])));
                                            }
                                        return;
                                    }
                                    else
                                        parent.textContent = data;
                                }
                            }
                        };
                        if (!(property in proxy))
                            proxy[property] = undefined;
                        _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(proxy, dataStore[property], funcObj[symbol], node);
                        parent.addEventListener("input", (e) => {
                            if (e.target === parent && parent.textContent !== proxy[property])
                                proxy[property] = parent.textContent;
                        });
                        node.textContent = proxy[property];
                    }
                    else
                        console.error("The parent element of a two-way binding text node must only have this text node.");
                }
                else if (inserts.length > 0) {
                    const properties = [], parent = node.parentNode, nextNode = node.nextSibling;
                    for (let i = 0; i < inserts.length; i++) {
                        const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                        properties.push(property);
                        if (!(property in dataStore))
                            proxy[property] = undefined;
                    }
                    const NRproperties = _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.noRepeat(properties);
                    const symbol = Symbol();
                    const funcObj = {
                        [symbol]: function (exportInstance) {
                            const data = this[NRproperties[0]];
                            if ((data instanceof Element
                                || (data instanceof Array && data[0] instanceof Element))
                                && matchone) {
                                exportInstance[2] = true;
                                parent.innerHTML = "";
                                if (data instanceof Element)
                                    parent.appendChild(data);
                                else
                                    for (let i = 0; i < data.length; i++) {
                                        if (data[i] instanceof Element)
                                            parent.appendChild(data[i]);
                                        else
                                            parent.appendChild(document.createTextNode(_utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.advancedStringify(data[i])));
                                    }
                            }
                            else {
                                let template = text;
                                if (exportInstance[2]) {
                                    parent.innerHTML = "";
                                    exportInstance[1] = document.createTextNode(template);
                                    parent.insertBefore(exportInstance[1], nextNode);
                                }
                                else if (!document.contains(exportInstance[1])) {
                                    exportInstance[1] = document.createTextNode(template);
                                    parent.insertBefore(exportInstance[1], nextNode);
                                }
                                let thisNode = exportInstance[1];
                                exportInstance[2] = false;
                                for (let i = 0; i < NRproperties.length; i++) {
                                    let data = this[NRproperties[i]];
                                    if (typeof data == "object")
                                        data = _utils_index__WEBPACK_IMPORTED_MODULE_1__.misc.advancedStringify(data);
                                    template = template
                                        .replaceAll(`${DSL.one.l}${NRproperties[i]}${DSL.one.r}`, data)
                                        .replaceAll(`${DSL.two.l}${NRproperties[i]}${DSL.two.r}`, data);
                                }
                                if (thisNode.textContent !== template)
                                    thisNode.textContent = template;
                            }
                        }
                    };
                    for (let i = 0; i < NRproperties.length; i++)
                        _utils_index__WEBPACK_IMPORTED_MODULE_1__.data.addExport(proxy, dataStore[NRproperties[i]], funcObj[symbol], node);
                }
            }
        }
    }
    function addExport() {
    }
    function removeExport() {
    }
    function getExports() {
    }
    console.info("creating new dynamic instance with rootNode", rootNode);
    hydrate(rootNode);
    observer.observe(rootNode, {
        attributes: true,
        attributeOldValue: true,
        characterData: true,
        characterDataOldValue: true,
        childList: true,
        subtree: true
    });
    return proxy;
}


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





const Dynamic$ = _app__WEBPACK_IMPORTED_MODULE_1__["default"];
Dynamic$.template = _template__WEBPACK_IMPORTED_MODULE_2__;
Dynamic$.spa = _spa__WEBPACK_IMPORTED_MODULE_3__;
Dynamic$.manifest = _manifest__WEBPACK_IMPORTED_MODULE_4__;
Dynamic$.e = _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.e;
Dynamic$.render = (args) => { return _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.render(args.HTML, args.element, args.insertAfter, args.append); };
Dynamic$.toHTML = _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.toHTML;
Dynamic$.hatch = _utils_index__WEBPACK_IMPORTED_MODULE_0__.element.hatch;
Dynamic$.compose = () => { };
const Dynamic = Dynamic$;
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
/* harmony export */   "checkArrowFunction": () => (/* binding */ checkArrowFunction),
/* harmony export */   "createData": () => (/* binding */ createData),
/* harmony export */   "detectShouldUpdate": () => (/* binding */ detectShouldUpdate),
/* harmony export */   "isComputedProperty": () => (/* binding */ isComputedProperty),
/* harmony export */   "removeExport": () => (/* binding */ removeExport)
/* harmony export */ });
/* harmony import */ var _utils_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../utils/index */ "../utils/index.ts");

const FtoString = Function.prototype.toString;
function createData(value, shouldUpdate, shouldExport) {
    const result = {
        value,
        shouldUpdates: shouldUpdate || [],
        shouldExports: shouldExport || []
    };
    if (typeof result.value == "function")
        result.cache = undefined;
    return result;
}
function addExport(proxy, dataInstance, func, target) {
    const sE = dataInstance.shouldExports;
    checkArrowFunction(func);
    let isDuplicated = false;
    for (let i = 0; i < sE.length; i++)
        if (sE[i][0] === func) {
            isDuplicated = true;
            break;
        }
    if (isDuplicated)
        console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    else {
        const exportInstance = [func, target, false];
        sE.push(exportInstance);
        func.call(proxy, exportInstance, dataInstance.value);
    }
    return [...sE];
}
function checkArrowFunction(func) {
    if (FtoString.call(func).match(/^\([^\(\)]*\)[\s]*=>/))
        _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.E("func", undefined, func, "this function must not be an arrow function");
}
function removeExport(dataInstance, func) {
    const sE = dataInstance.shouldExports;
    if (typeof func == "string") {
        if (func == "")
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
    return [...sE];
}
function isComputedProperty(data) {
    return typeof data.value == "function";
}
function detectShouldUpdate(string) {
    const inQuote = { double: false, single: false, reversed: false }, result = [];
    var resultAdding = false, subCursor = 0;
    for (let i = 0; i < string.length; i++) {
        if (string[i] == "\\n") {
            inQuote.double = false;
            inQuote.single = false;
        }
        if (string[i] == "`" && !inQuote.single && !inQuote.double)
            inQuote.reversed = !inQuote.reversed;
        if (string[i] == '"' && !inQuote.single && !inQuote.reversed)
            inQuote.double = !inQuote.double;
        if (string[i] == "'" && !inQuote.double && !inQuote.reversed)
            inQuote.single = !inQuote.single;
        if (inQuote.reversed && string[i] == "$" && string[i + 1] == "{")
            processTemplate(i);
        if (!string[i].match(/[\w$]/) && subCursor != 0 && !inQuote.single && !inQuote.double && !inQuote.reversed) {
            result.push(string.substring(subCursor, i));
            subCursor = 0;
        }
        if (!inQuote.single && !inQuote.double && !inQuote.reversed
            && string[i] == "t" && string[i + 1] == "h" && string[i + 2] == "i" && string[i + 3] == "s"
            && string[i + 4] == ".") {
            subCursor = i + 5;
            i += 4;
        }
    }
    return _utils_index__WEBPACK_IMPORTED_MODULE_0__.generic.noRepeat(result);
    function processTemplate(i) {
    }
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
/* harmony export */   "advancedStringify": () => (/* binding */ advancedStringify),
/* harmony export */   "compatibleToString": () => (/* binding */ compatibleToString),
/* harmony export */   "eliminateSymbol": () => (/* binding */ eliminateSymbol),
/* harmony export */   "noErrorDefineProperties": () => (/* binding */ noErrorDefineProperties)
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
function compatibleToString(input) {
    return "toString" in input ? input.toString() : toString.call(input);
}
function noErrorDefineProperties(obj, properties) {
    for (let i in properties)
        if (!(i in obj))
            Object.defineProperty(obj, i, properties[i]);
}


/***/ }),

/***/ "../utils/arguments.ts":
/*!*****************************!*\
  !*** ../utils/arguments.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "reduceToElement": () => (/* binding */ reduceToElement),
/* harmony export */   "reduceToNode": () => (/* binding */ reduceToNode)
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
function reduceToNode(input) {
    if (input instanceof Node)
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

/***/ "../utils/devTools.ts":
/*!****************************!*\
  !*** ../utils/devTools.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ devTools)
/* harmony export */ });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "../utils/index.ts");
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _devTools_dtInterval;

const cI = clearInterval;
class devTools {
    constructor() {
        _devTools_dtInterval.set(this, 0);
        this.disable();
    }
    enable() {
        clearInterval = cI;
        clearInterval(__classPrivateFieldGet(this, _devTools_dtInterval, "f"));
    }
    disable() {
        if (clearInterval !== cI)
            _index__WEBPACK_IMPORTED_MODULE_0__.generic.EE("DevTools has been disabled.");
        __classPrivateFieldSet(this, _devTools_dtInterval, (() => {
            return setInterval(() => {
                debugger;
            }, 20);
        })(), "f");
        clearInterval = (id) => {
            if (id != __classPrivateFieldGet(this, _devTools_dtInterval, "f"))
                cI.call(window, id);
        };
    }
}
_devTools_dtInterval = new WeakMap();


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
/* harmony export */   "devTools": () => (/* reexport safe */ _devTools__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   "element": () => (/* reexport module object */ _element__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   "generic": () => (/* reexport module object */ _generic__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _generic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./generic */ "../utils/generic.ts");
/* harmony import */ var _element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./element */ "../utils/element.ts");
/* harmony import */ var _arguments__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./arguments */ "../utils/arguments.ts");
/* harmony import */ var _devTools__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./devTools */ "../utils/devTools.ts");










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