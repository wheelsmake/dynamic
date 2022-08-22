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
        //不用观察自己对DOM的修改
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
                //console.log("get", property);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    var result :any;
                    //如果value是函数就先执行它，获得返回值，这是约定
                    if(typeof sharpData[property].value == "function") result = (sharpData[property].value.bind(proxy))();
                    else result = sharpData[property].value;
                    //不要在这边优化object显示，这边是object输出！人家传一个object进来，你给他一个string回去？？？ //优化object显示，不要显示[object Object]；如果转换出错，那么result不会被更改，还是[object Object]
                    //正确的方法是在textContent替换中写object
                    //if(typeof result == "object") try{result = JSON.stringify(result);}catch{}

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
                //console.log("set", property, newValue);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    //如果传入的是函数，那么就收集函数中需要的属性，将这些属性的shouldUpdate中推一个这个属性
                    //`a.shouldUpdate[number] = "b"` 的意思是：当属性a发生改变时，要去更新b
                    //更新b并不是运行一次b.value函数，而是去更新b.shouldExport，重新运行一遍这些方法，将DOM中的b更新
                    //我们也要同样地去b.shouldUpdate里将它们的shouldExport运行了，因为它们的值也“应该”改变了
                    //这是一个递归过程，一直从shouldUpdate下去，一直运行shouldExport
                    if(typeof newValue == "function"){
                        //todo:“计算”属性
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
                    if(typeof newValue == "function"){
                        //todo:“计算”属性
                    }
                    else if(typeof newValue == "object"){

                    }
                    sharpData[property] = lUtils.data.createData(newValue, [], []);
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
                //reviewed:不要真正删除而是标记删除
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

//#region todo:实例内方法
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
                //#region 关于attribute与property的讨论
            /*important:fixed:-warning:对于某些attribute来说，它们本身只是一个默认值，想要获得真正的值需要访问节点的对应property！
            但是我们无法知道哪些attribute有这种阴间问题，到时候一味更新attribute没更新到property就没用了
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
            由此可见pa组合一定存在双向同步，这和whatwg.org的标准是完全相符的。
            但是可能名字不同。这个名字不同问题很大，因为有的只是kebab转camel，有的整个都变了，如value->defaultValue，class->className。
            并且有的不同组合的a和p存在一次性的同步，这个“一次性”发生在第一次加载页面（Gecko和IE）或每次刷新页面（chromium）
            例如value(a)和value(p)，它们不是一个组合（value(a)和defaultValue(p)才是一对的），一次性同步方向为value(a)->value(p)。
            important:我们的目的是：能够做到属性值与data双向同步，即修改属性值会触发data修改且触发data should*事件，修改data触发属性值的修改。
            那么，有一个很好玩的方案：data是典型的引用/代理类型，属性(p)是标准JavaScript属性，那为什么不直接把属性(p)改成data呢？
            哦，不行，属性(p)本质上是一个使用getter和setter的伪属性，不能变成其他值。
            还有方案：用observer监控DOM（就是最开始的“上传”实现策略）。
            但是observer只能监测attributes，对于没有与attribute组合的property它无能为力了。
            所以，真的要放弃了吗……
            fixme:我们目前只能做到specific处理，general处理等我再想想。
            特殊处理限于class、<input>中的value和checked。style不用。
            参考链接：
            https://javascript.info/dom-attributes-and-properties#:~:text=But%20there%20are%20exclusions%2C%20for%20instance%20input.value%20synchronizes%20only%20from%20attribute%20%E2%86%92%20to%20property%2C%20but%20not%20back%3A
            https://stackoverflow.com/questions/57475325
            https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
            */
            //#endregion
                
                //检查属性名和属性值，它们都要求全部是插值，不允许中途插值；important:todo:并且都需要双向绑定
                if(attrs[i].name.match(/^:_[a-zA-Z$_][\w$]*_:$/)){
                    const property = attrs[i].name.substring(2, attrs[i].name.length - 2);

                    //添加尚未添加的属性，与下文引发导出过程的作用重复，不需要了
                    //if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();

                    //更新attribute的名称，值不改变；但是本质上是删除旧attribute，添加新attribute
                    //fixme:因此必须需要一个参数，否则无从得知是哪个attribute
                    const __addedByDynamic__ = function(this :anyObject, oldValue :any){ //参数里放this不影响函数的参数
                        const valueOfAttr = node.getAttribute(oldValue)!;
                        node.setAttribute(this[property], valueOfAttr);
                        node.removeAttribute(oldValue);
                    }
                    //这个用来引发一次导出过程，如果开发者没有赋值，那么:__:标识将变成undefined，反正不要留下标识
                    //这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                    //需要先引发再添加export（reading undefined警告）
                    this.#proxy[property] = undefined;
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //™还要再引发一次，不然export当时是没有的。怎么又写出了这种s**t代码啊！
                    this.#proxy[property] = undefined;
                }
                if(attrs[i].value.match(/^:_[a-zA-Z$_][\w$]*_:$/)){
                    //name变量用于将属性名转换为值类型，取消引用类型同步性
                    const property = attrs[i].value.substring(2, attrs[i].value.length - 2);
                    var name = attrs[i].name;

                    //将规避属性添加方法归化到正常方法
                    node.removeAttribute(name); //这个不会有任何问题，因为后面会立即set回去，如果带:会被set不带:的attr
                    if(name[name.length - 1] == ":") name = name.substring(0, name.length - 1);

                    //添加尚未添加的属性，与下文引发导出过程的作用重复，不需要了
                    //if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();

                    var __addedByDynamic__ :exportFunc; //下面：参数里放this不影响函数的参数
                    //特殊处理a/p。这里实际上只需要处理完全不能通过attribute做到的东西，class反而是不能通过property（因其名字不同）做到
                    if(
                        (/*name == "class" || */name == "value" || name == "checked")
                     && node instanceof HTMLInputElement //避免小天才把这俩属性写在其他元素上
                    ) __addedByDynamic__ = function(this :anyObject){
                        if(node.hasOwnProperty(name)){ //检测是否存在对应property，不要用in，检测仅限于它本身，不要扩展到奇怪的原型链
                            
                        }
                    }
                    else __addedByDynamic__ = function(this :anyObject){
                        node.setAttribute(name, this[property]);
                    }
                    //这个用来引发一次导出过程，如果开发者没有赋值，那么:__:标识将变成undefined，反正不要留下标识
                    //这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                    //需要先引发再添加export（reading undefined警告）
                    this.#proxy[property] = undefined;
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //™还要再引发一次，不然export当时是没有的。怎么又写出了这种s**t代码啊！
                    this.#proxy[property] = undefined;
                }
            }
            //进入子节点
            for(let i = 0; i < node.childNodes.length; i++) this.#processInsert(node.childNodes[i]);
        }
        else if(node instanceof Text){
            //fixed:如果修改Element的textContent则会覆盖所有子元素，所以我们仅在文本节点上执行这边的代码

            //fixme:但是文本节点（特别是空文本节点）很容易被浏览器乱扔，这个目前没想到好的方法
            //note:已经验证：chromium和Gecko都会在一个文本节点textContent被清空后直接删除这个文本节点。
            //所以要不我们手动hack它，要不提醒开发者
            //如果hack的话，可行的方法是自动插入零宽字符，不过这样做显然会导致一些问题（如字数统计等）
            //所以我们还是去提醒开发者吧，毕竟DOM编辑这个需求算是冷门需求。我也是被提醒的对象，因为造dynamic就是为了造oe。

            //不修改innerText而是修改textContent，因为innerText会触发更多的浏览器绘制过程
            //(可见local_tests/performance_test) 执行 for(let i=0;i<1000;i++){$0.innerText += "a"}
            //innerText：144.42ms 每次都要触发一次重新计算样式——布局（强制自动重排）
            //textContent：4.6ms 最后一次设置后再进行重新计算样式——布局
            if(node.textContent){
                const inserts = [...node.textContent.matchAll(/:_[a-zA-Z$_][\w$]*_:/g)];
                //没有匹配到则为null，匹配到则[n]为:_example_:
                if(inserts.length > 0){
                    /*note:这里所做的事和一个字符串模板引擎没有什么区别。
                     * 我们先确定这一段文字中所有的插入点在哪里；
                     * 然后保存好这一段文字，更新时要用的；
                     * 然后确定要使用哪些属性，给它们都添加新建的一个方法；
                     * 这个新建的方法是一个标准的属性shouldExport方法，但是它被多个属性共用（这个不足为奇）；
                     * 方法的具体内容是：收集所有需要的属性，用保存好的文字加上模板，然后塞回节点里；
                     * 简单来说就是新建一个函数，塞语句和文字进去，把它记录成所有依赖属性的shouldExport方法*/
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
                        for(let i = 0; i < NRproperties.length; i++){
                            var data = this[NRproperties[i]];
                            //console.log(data);
                            //fixed:见initData()->Proxy->set
                            if(typeof data == "object") data = lUtils.misc.advancedStringify(data);
                            t = t.replaceAll(`:_${NRproperties[i]}_:`, data);
                        }
                        node.textContent = t;
                    }
                    for(let i = 0; i < NRproperties.length; i++){
                        //这个用来引发一次导出过程，如果开发者没有赋值，那么:__:标识将变成undefined，反正不要留下标识
                        //这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                        //需要先引发再添加export（reading undefined警告）
                        this.#proxy[NRproperties[i]] = undefined;
                        lUtils.data.addExport(this.#data[NRproperties[i]], __addedByDynamic__);
                        //™还要再引发一次，不然export当时是没有的。怎么又写出了这种s**t代码啊！
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

//#region todo:DOM监控
    #observer :MutationObserver = new MutationObserver((records :MutationRecord[])=>{
        for(let i = 0; i < records.length; i++){
            console.log(records[i]);
        }
    });
    #shouldAnnounceAttrs :[] = [];
    #registerOCB(){

    }
    #deleteOCB(){

    }
//#endregion
}