/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";


//开发模式
console.info(
`dynamic(dnJS) ©LJM12914. https://github.com/wheelsmake/dynamic
You are using the unminified build of dynamic. Make sure to use the minified build for production.`);


//字符串重用
const s :string[] = [
    "鬼片出现了！",
    "Access to deleted property was blocked: "
];


//主类
export default class App{
    constructor(rootNode :Elementy){
        this.#rootNode = utils.arguments.reduceToElement(rootNode)!;
        console.info("creating new dynamic instance with rootNode", rootNode);
        this.#initData();
        this.#processInsert(this.#rootNode);
        this.#observer = new MutationObserver(this.#observerCB);
        this.#observer.observe(this.#rootNode, {
            attributes: true,
            attributeOldValue: true,
            characterData: true,
            characterDataOldValue: true,
            childList: true,
            subtree: true
        });
    }
    #rootNode :Element;
    get rootNode(){return this.#rootNode;}

//#region 属性数据
    #data :dataObject = {};
    //proxy虽然代理了#data这个dataObject，但它的表现其实就是一个典型的、完整的anyObject
    #proxy :anyObject = {};
    //proxy本身没有不可变性，必须再用一个data只读伪属性保护
    get data(){return this.#proxy;} //class内部不要引用这个data！内部为什么不直接引用#proxy呢？？？？？
    get _(){return this.#proxy;} //缩写
    #initData(){
        //note:sharpData === this.#data
        this.#proxy = new Proxy(this.#data, {
            get(sharpData :dataObject, property :string | symbol, proxy :dataObject) :any{
                property = lUtils.misc.eliminateSymbol(property);
                console.log("get", property);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    var result :any;
                    //如果value是函数就先执行它，获得返回值，这是约定
                    if(typeof sharpData[property].value == "function") result = (sharpData[property].value.bind(proxy))();
                    else result = sharpData[property].value;
                    //优化object显示，不要显示[object Object]；如果转换出错，那么result不会被更改，还是[object Object]
                    if(typeof result == "object") try{result = JSON.stringify(result);}catch{}
                    //symbol不能隐式转换为字符串，浏览器会抛出错误，但是我们不应该吞掉开发者的错误，所以不用管它
                    //else if(typeof result == "symbol")
                    return result;
                }
                //不用创建属性！
                else if(!(property in sharpData)) return undefined;
                //该属性已被删除fixed:这个不能放在没有该属性前，reading undefined警告
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                else console.error(s[0], "get", property); //不可能有else了
            },
            set(sharpData :dataObject, property :string | symbol, newValue :unknown, proxy :dataObject) :boolean{
                property = lUtils.misc.eliminateSymbol(property);
                console.log("set", property, newValue);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    //如果传入的是函数，那么就收集函数中需要的属性，将这些属性的shouldUpdate中推一个这个属性
                    //`a.shouldUpdate[number] = "b"` 的意思是：当属性a发生改变时，要去更新b
                    //更新b并不是运行一次b.value函数，而是去更新b.shouldExport，重新运行一遍这些方法，将DOM中的b更新
                    //我们也要同样地去b.shouldUpdate里将它们的shouldExport运行了，因为它们的值也“应该”改变了
                    //这是一个递归过程，一直从shouldUpdate下去，一直运行shouldExport
                    if(typeof newValue == "function"){
                        //newValue = (newValue.bind(proxy))();
                    
                    }
                    const oldValue = sharpData[property].value;
                    sharpData[property].value = newValue;
                    //更新依赖方法
                    const exports = sharpData[property].shouldExports,
                          updates = sharpData[property].shouldUpdates;
                    for(let i = 0; i < updates.length; i++){
                    
                    }
                    for(let i = 0; i < exports.length; i++) (exports[i].bind(proxy))(oldValue);
                }
                //尚未有该属性，新建
                else if(!(property in sharpData)){
                    sharpData[property] = lUtils.data.createData(newValue, [], []);
                    if(lUtils.data){
                        //todo:
                    }
                }
                //该属性已被删除fixed:这个不能放在没有该属性前，reading undefined警告
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                else console.error(s[0], "set", property); //不可能有else了
                return true;
            },
            //用has拦截in运算没必要，因其不会导致#data状态的改变
            //Proxy的defineProperty只会在Object.defineProperty走到，别听MDN的
            //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/defineProperty#:~:text=proxy.property%3D%27value%27
            //只要警告他们不要用Object.defineProperty往data里扔东西就好了
            deleteProperty(sharpData :dataObject, property :string | symbol) :boolean{
                //review:不要真正删除而是标记删除
                property = lUtils.misc.eliminateSymbol(property);
                const exists = property in sharpData;
                if(exists) sharpData[property].deleted = true;
                return exists;
            }
        });
    }
    addExport(dataProperty :string, func :exportFunc) :shouldExportA{return lUtils.data.addExport(this.#data[dataProperty], func);}
    removeExport(dataProperty :string, func :string | exportFunc) :shouldExportA{return lUtils.data.removeExport(this.#data[dataProperty], func);}
//#endregion

//#region 实例内方法
    #methods :functionObject = {};
    addMethods(){

    }
    removeMethods(){

    }
//#endregion

//#region HTML声明式语法
    parseHTML(node :Node) :void{this.#processInsert(node);}
    #processInsert(node :Node) :void{
        if(node instanceof Element){
            //hack:超级hack完美解决作用域内部元素on*事件必须访问全局App才能访问数据的问题
            //给作用域内每个元素的data和_都弄上这个data，然后只要this一下就出来了！
            const data = this.data;
            Object.defineProperty(node, "data", {
                configurable: false,
                enumerable: true,
                get(){return data;}
            });
            Object.defineProperty(node, "_", {
                configurable: false,
                enumerable: true,
                get(){return data;}
            });
            const attrs = node.attributes, children = Array.from(node.childNodes) as Node[];
            //别写in，否则出一大堆方法，NameNodeMap可以用数组那套，NameNodeMap.length返回的是正确的长度
            for(let i = 0; i < attrs.length; i++){
                //important:todo:这里要求双向绑定！！！！！！！！！！！
                
            //#region
            /*important:fixme:-warning:对于某些attribute来说，它们本身只是一个默认值，想要获得真正的值需要访问节点的对应property！
            https://javascript.info/dom-attributes-and-properties#:~:text=But%20there%20are%20exclusions%2C%20for%20instance%20input.value%20synchronizes%20only%20from%20attribute%20%E2%86%92%20to%20property%2C%20but%20not%20back%3A
            但是我们无法知道哪些attribute有这种阴间问题，到时候一味更新attribute没更新到property就没用了
            https://stackoverflow.com/questions/57475325 的解决方案
            const setAttribute = (node, name, value) => {
                if (name in node) {
                node[name] = value;
                } else {
                node.setAttribute(name, value);
                }
                };
            等于是优先使用property，没property再用attribute。这样可以处理value这种单向不完全同步的东西，也可以处理class/className这种名称不同但可以双向同步的东西。
            但是如果出现了一个名称不同但又不能双向同步的attribute/property组合，那么就完蛋了
            //更新
            value原来真的有组合，叫defaultValue！
            
            目前看了看标准和文档，来试图真正说清楚这个。
            我们将property/attribute组合叫pa组合。
            我们将 $0[property] = x会导致$0.getAttribute("property") === x 称为 拥有完整的p->a同步。
            我们将 $0.setAttribute("property", x)会导致$0[property] === x 称为 拥有完整的a->p同步。
            我们将拥有完整的p->a同步和拥有完整的a->p同步称为完全双向同步，拥有两者中任一种称为单向同步。
            如果存在同步，但property的值需要改变，那么称为非同名同步。
            pa组合一共有以下几种：
            1. 同名且完全双向同步，如accept。
            2. 不同名且完全双向同步，如value(a)和defaultValue(p)。
            3. 不同名且不可能双向同步，因为两边的格式不同，如style。但是这种情况下浏览器已经做好了转换，可以近似视作第二种。
            由此可见pa组合一定存在双向同步，这和whatwg.org的标准是完全相符的。https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
            但是可能名字不同。这个名字不同问题很大，因为有的只是kebab转camel，有的整个都变了，如value->defaultValue，class->className。
            
            并且有的不同组合的a和p存在一次性的同步，这个“一次性”发生在第一次加载页面（Gecko和IE）或每次刷新页面（chromium）
            例如value(a)和value(p)，它们不是一个组合（value(a)和defaultValue(p)才是一对的），一次性同步方向为value(a)->value(p)。
            
            important:我们的目的是：能够做到属性值与data双向同步，即修改属性值会触发data修改且触发data should*事件，修改data触发属性值的修改。
            那么，有一个很好玩的方案：data是典型的引用/代理类型，属性(p)是标准JavaScript属性，那为什么不直接把属性(p)改成data呢？
            哦，不行，属性(p)是有严格类型的，不能变成其他值。
            还有方案：用observer监控DOM（就是最开始的“上传”实现策略）
            
            
            
            */
            //#endregion

                //检查属性名和属性值，它们都要求全部是插值，不允许中途插值；并且都是双向绑定
                if(attrs[i].name.match(/:_[a-zA-Z$_][\w$]*_:/)){
                    const property = attrs[i].name.substring(2, attrs[i].name.length - 2);
                    if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();
                    //更新attribute的名称，值不改变
                    const __addedByDynamic__ = function(this :anyObject, oldValue :any){ //参数里放this不影响函数的参数
                        const valueOfAttr = node.getAttribute(oldValue)!;
                        node.setAttribute(this[property], valueOfAttr);
                        node.removeAttribute(oldValue);
                    }
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //这个用来引发一次导出过程，如果开发者没有赋值，那么将:__:标识变成undefined，反正不要留下标识
                    this.#proxy[property] = undefined;
                }
                if(attrs[i].value.match(/:_[a-zA-Z$_][\w$]*_:/)){
                    //name变量用于将属性名转换为值类型，取消引用类型同步性
                    const property = attrs[i].value.substring(2, attrs[i].value.length - 2), name = attrs[i].name;
                    if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();
                    const __addedByDynamic__ = function(this :anyObject){ //参数里放this不影响函数的参数
                        node.setAttribute(name, this[property]);
                    }
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //这个用来引发一次导出过程，如果开发者没有赋值，那么将:__:标识变成undefined，反正不要留下标识
                    this.#proxy[property] = undefined;
                }
            }
            //进入子节点
            for(let i = 0; i < node.childNodes.length; i++) this.#processInsert(node.childNodes[i]);
        }
        else if(node instanceof Text){
            //fixed:如果修改Element的textContent则会覆盖所有子元素，所以我们仅在文本节点上执行这边的代码
            //fixme:但是文本节点很容易被浏览器乱扔，这个目前没想到好的方法

            //不修改innerText而是修改textContent，因为innerText会触发更多的浏览器绘制过程
            //(可见local_tests/performance_test) 执行 for(let i=0;i<1000;i++){$0.innerText += "a"}
            //innerText：144.42ms 每次都要触发一次重新计算样式——布局（强制自动重排）
            //textContent：4.6ms 最后一次设置后再进行重新计算样式——布局
            if(node.textContent){
                const inserts = [...node.textContent.matchAll(/:_[a-zA-Z$_][\w$]*_:/g)];
                //没有匹配到则为null，匹配到则[n]为:_example_:
                if(inserts.length > 0){
                    /*note:
                     * 这里所做的事和一个字符串模板引擎没有什么区别。
                     * 我们先确定这一段文字中所有的插入点在哪里；
                     * 然后保存好这一段文字，更新时要用的；
                     * 然后确定要使用哪些属性，给它们都添加新建的一个方法；
                     * 这个新建的方法是一个标准的属性shouldExport方法，但是它被多个属性共用（这个不足为奇）；
                     * 方法的具体内容是：收集所有需要的属性，用保存好的文字加上模板，然后塞回节点里；
                     * 
                     * 简单来说就是新建一个函数，塞语句和文字进去，把它记录成所有依赖属性的shouldExport方法
                     */
                    const offsets = [], properties = [], text = node.textContent;
                    //收集数据并创建尚未创建的属性
                    for(let i = 0; i < inserts.length; i++){
                        const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                        offsets.push(inserts[i].index);
                        properties.push(property);
                        if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();
                    }
                    //if(offsets.length != properties.length) console.error(s[0], offsets, properties); //鬼片检验
                    //构造并记录export方法
                    const NRproperties = utils.generic.noRepeat(properties);
                    const __addedByDynamic__ = function(this :anyObject){ //参数里放this不影响函数的参数
                        var t = text; //为了保证它是值类型，node.textContent是引用类型，会变
                        for(let i = 0; i < NRproperties.length; i++) t = t.replaceAll(`:_${NRproperties[i]}_:`, this[NRproperties[i]]);
                        node.textContent = t;
                    }
                    for(let i = 0; i < NRproperties.length; i++){
                        lUtils.data.addExport(this.#data[NRproperties[i]], __addedByDynamic__);
                        //这个用来引发一次导出过程，如果开发者没有赋值，那么将:__:标识变成undefined，反正不要留下标识
                        this.#proxy[NRproperties[i]] = undefined;
                    }
                }
                //else
            }
            //else
        }
        else console.error(s[0], node);
    }
//#endregion

//#region DOM监控
    #observer :MutationObserver;
    #shouldAnnounceAttrs :[] = []; //todo:
    #observerCB(records :MutationRecord[]){
        for(let i = 0; i < records.length; i++){
            console.log(records[i]);
        }
    }
    #registerOCB(){

    }
    #deleteOCB(){

    }
//#endregion
}