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

const
//字符串重用
    s :string[] = [
        "鬼片出现了！",
        "Access to deleted property was blocked: "
    ],
//HTML声明式语法设置（不喜欢目前语法的开发者可以fork后自己直接改动这里！）
    HTMLDSLs = {
        twoWayBinding :{
            leftBracket: "_:",
            rightBracket: ":_"
        },
        oneWayBinding :{
            leftBracket: "_-",
            rightBracket: "-_"
        },
        attrAdditional: ":" //这个玩意的位置配置不在这里，在#hydrate里面，懒得提出来了
    },
    twoWayBindingRegExp = new RegExp(`^${HTMLDSLs.twoWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.twoWayBinding.rightBracket}$`),
    oneWayBindingRegExp = new RegExp(`^${HTMLDSLs.oneWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.oneWayBinding.rightBracket}$`),
    //这个不使用
    //nStwoWayBindingRegExp = new RegExp(`${HTMLDSLs.twoWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.twoWayBinding.rightBracket}`, "g"),
    nSoneWayBindingRegExp = new RegExp(`${HTMLDSLs.oneWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.oneWayBinding.rightBracket}`, "g");


//主类
export default class App{
//#region 基本功能
    constructor(rootNode :Elementy){
        this.#rootNode = utils.arguments.reduceToElement(rootNode)!;
        console.info("creating new dynamic instance with rootNode", rootNode);
        this.#initData();
        this.#hydrate(this.#rootNode);
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
//#endregion

//#region 数据管理
    #data :dataObject = {};
    //proxy虽然代理了#data这个dataObject，但它的表现其实就是一个典型的、完整的anyObject
    #proxy :anyObject = {};
    //proxy本身没有不可变性，必须再用一个data只读伪属性保护
    get data(){return this.#proxy;} //class内部不要引用这个data！内部为什么不直接引用#proxy呢？？？？？
    get _(){return this.#proxy;} //缩写
    get __DEV_data__(){return this.#data;}
    #initData(){
        //note:sharpData === this.#data
        this.#proxy = new Proxy(this.#data, {
            get(sharpData :dataObject, property :string | symbol, proxy :dataObject) :any{
                property = lUtils.misc.eliminateSymbol(property);
                //console.log("get", property);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    let result :any;
                    //如果是“计算”属性就“计算”它，获得返回值
                    if(lUtils.data.isComputedProperty(sharpData[property])){
                        result = (sharpData[property].value.bind(proxy))(proxy);
                        sharpData[property].value
                    }
                    else result = sharpData[property].value;
                    //不要在这边优化object显示，这边是有啥输出啥！人家传一个object进来，你给他一个string回去？？？正确的方法是在textContent替换中写object！
                    return result;
                }
                //不用创建属性！
                else if(!(property in sharpData)) return undefined;
                //该属性已被删除fixed:这个不能放在没有该属性前，reading undefined警告
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                else console.error(s[0], "get", property); //不可能有else了……？
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
                    if(oldValue !== newValue){ //要是前后相同，为什么还要更新呢？——嫖怪
                        //更新依赖方法
                        const exportInstances = sharpData[property].shouldExports, updates = sharpData[property].shouldUpdates;
                        for(let i = 0; i < updates.length; i++){
                            
                        }
                        for(let i = 0; i < exportInstances.length; i++){
                            (exportInstances[i][0].bind(proxy))(exportInstances[i], oldValue);
                        }
                    }
                }
                //尚未有该属性，新建
                else if(!(property in sharpData)){
                    if(typeof newValue == "function"){
                        //todo:“计算”属性
                    }
                    else if(typeof newValue == "object"){

                    }
                    sharpData[property] = lUtils.data.createData(newValue);
                }
                //该属性已被删除fixed:这个不能放在没有该属性前，reading undefined警告
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                else console.error(s[0], "set", property); //不可能有else了
                return true;
            },
            //用has拦截in运算没必要，因其不会导致#data状态的改变，并且in是可以完全正常使用的
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
    //这两个必须使用#data得到完整的data实例
    addExport(dataProperty :string, func :exportFunc, target :Node) :shouldExportA{return lUtils.data.addExport(this.#proxy, this.#data[dataProperty], func, target);}
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
    //外部访问
    hydrate(node :Node) :void{
        //不要扩展作用域
        if(/*utils.element.isDescendant(node, this.#rootNode)*/this.#rootNode.contains(node)) this.#hydrate(node);
        else utils.generic.E("node", undefined, node, "the input node must be a descendant of the rootNode");
    }
    #hydrate(node :Node) :void{
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
            //fixed:Element.attributes是一个实时集合，而我们在循环中有删除元素，会导致缺陷for循环！
            const attrs = Array.from(node.attributes), children = Array.from(node.childNodes) as Node[];
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
                https://javascript.info/dom-attributes-and-properties#:~:text=But%20there%20are%20exclusions
                https://stackoverflow.com/questions/57475325
                https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
                */
                //#endregion
                //检查属性名和属性值，它们都要求全部是插值，不允许中途插值；其中属性值支持双向绑定
                let name = attrs[i].name, value = attrs[i].value; //???:这里不能用var？不同次for之间居然能共享var变量？
                if(name.match(twoWayBindingRegExp) || name.match(oneWayBindingRegExp)){
                    //属性名双向绑定是不合理的，警告开发者
                    if(name.match(twoWayBindingRegExp)) console.warn(`It's not rational to declare a two-way binding attribute name: ${name}, automatically treated as one-way binding. Use "${HTMLDSLs.oneWayBinding.leftBracket}${name.substring(2, name.length - 2)}${HTMLDSLs.oneWayBinding.rightBracket}" instead.`);
                    //不允许双重动态attribute
                    if(value.match(twoWayBindingRegExp) || value.match(oneWayBindingRegExp)) console.warn("Cannot set an attribute with both name and value dynamic. Dynamic will make only attribute name dynamic.");
                    const property = name.substring(2, name.length - 2);
                    //更新attribute的名称，值不改变；但是本质上是删除旧attribute，添加新attribute；因此必须需要一个参数，否则无从得知是哪个attribute
                    const __addedByDynamic__ :exportFunc = function(this :anyObject, exportInstance :exportInstance, oldValue :string){ //参数里放this不影响函数的参数
                        const newValue = this[property];
                        if(oldValue !== newValue){
                            const thisNode = exportInstance[1]! as Element,
                            valueOfAttr = thisNode.getAttribute(oldValue)!;
                            //要先删除，因为setAttribute可能会出错，出错了就会多一个attribute
                            //出错后再次设置数据属性的值时，如果成功设置了attr，attr值也会是null，因为上次没有成功，旧的attr值直接没了，这完全符合预期！
                            thisNode.removeAttribute(oldValue);
                            if(newValue !== ""){
                                //警告开（我）发（自）者（己）不要传大写字母进属性名
                                if(typeof newValue == "string" && newValue !== newValue.toLowerCase()) console.warn(`Attribute names are case insensitive, don't pass string with upper-case letters which may cause bugs: ${newValue}`);
                                thisNode.setAttribute(newValue, valueOfAttr);
                            }
                            //else ""不是有效的属性名称，所以我们将它视为属性被动态删除了
                        }
                        //else return; //值没有改变，直接返回
                    };
                    //很不幸，由于更新时有值改变的检测，并且必须通过值来确定set哪个attr，我们没法依靠export，必须自己上阵干掉标识
                    node.removeAttribute(name); //删除旧value
                    //如果开发者没有赋值，那么插值标识将留下undefined，反正不要留下标识。这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                    if(!(property in this.#proxy)) this.#proxy[property] = undefined; //创建属性
                    //如果已经存在数据属性那么不要随便赋值，只需要添加export即可
                    lUtils.data.addExport(this.#proxy, this.#data[property], __addedByDynamic__, node);
                    node.setAttribute(this.#proxy[property], value); //将value搬迁到新的attribute中
                }
                //如果name已经被处理了，那么就不处理value了，现在不允许双重动态attribute了
                else if(value.match(twoWayBindingRegExp) || value.match(oneWayBindingRegExp)){ //其实双向绑定就是加了个补丁，可以一起
                    const property = value.substring(2, value.length - 2);
                    node.removeAttribute(name); //这个不会有任何问题，因为会立即set回去，如果带${HTMLDSLs.attrAdditional}会被set不带${HTMLDSLs.attrAdditional}的attr
                    //检测规避属性
                    if(name[name.length - 1] == HTMLDSLs.attrAdditional) name = name.substring(0, name.length - 1);
                    //不要再改动name了，后面要用没有处理过default的name变量
                    let name_default_processed = name, __addedByDynamic__ :exportFunc;
                    //特殊处理a/p。这里实际上只需要处理完全不能通过attribute做到的东西，class反而是不能通过property（因其名字不同）做到的……
                    if(
                        (name_default_processed == "value" || name_default_processed == "checked")
                     && node instanceof HTMLInputElement //避免其他元素上可能存在这些开发者自定义的属性，造成干扰
                     && name_default_processed in node //这个东西感觉没啥作用，其实只是加个保险。检测是否存在对应property，似乎value真的在input的原型链上而不是它本身的属性
                    ) __addedByDynamic__ = function(this :anyObject, exportInstance :exportInstance, oldValue :any){
                        (node as anyObject)[name_default_processed] = this[property];
                    }
                    else{
                        //处理上一个if过滤掉的对称情况
                        if(node instanceof HTMLInputElement){
                            //快死了，乱转大写小写的
                            if(name_default_processed == "defaultvalue" && "defaultValue" in node) name_default_processed = "value";
                            else if(name_default_processed == "defaultchecked" && "defaultChecked" in node) name_default_processed = "checked";
                        }
                        __addedByDynamic__ = function(this :anyObject, exportInstance :exportInstance, oldValue :any){
                            const newValue = this[property];
                            if(oldValue !== newValue){
                                //我们将null视为属性被动态删除了
                                if(newValue === null) node.removeAttribute(name_default_processed); //setAttribute删不掉
                                else node.setAttribute(name_default_processed, newValue);
                            } 
                            //else 值没有改变，直接返回
                        }
                    }
                    //如果开发者没有赋值，那么插值标识将留下undefined，反正不要留下标识。这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                    if(!(property in this.#proxy)) this.#proxy[property] = undefined; //创建属性
                    //如果已经存在数据属性那么不要随便赋值，只需要添加export即可
                    lUtils.data.addExport(this.#proxy, this.#data[property], __addedByDynamic__, node);
                    node.setAttribute(name_default_processed, this.#proxy[property]); //在这里不会自动创建property！
                    if(value.match(twoWayBindingRegExp)){ //打个双向同步补丁
                        //特别处理这几个东西，就是这里需要用到原始的name
                        if(node instanceof HTMLInputElement){
                            if(name == "value"){
                                node.addEventListener("input", (e :Event)=>{
                                    if(e.target === node) this.#proxy[property] = node.value;
                                });
                            }
                            else if(name == "checked"){
                                node.addEventListener("input", (e :Event)=>{
                                    if(e.target === node) this.#proxy[property] = node.checked;
                                });
                            }
                            //else if(name == "defaultValue") 不需要了，跟着下面去监听就行了
                        }
                        else{
                            this.#aOProcessorStore.set(node, (record: MutationRecord)=>{
                                if(
                                    record.attributeName === name_default_processed
                                //只有在attribute值和数据属性的值不一样的时候才需要同步，否则会导致无限同步
                                 && node.getAttribute(record.attributeName!) !== this.#proxy[property]
                                ) this.#proxy[property] = node.getAttribute(record.attributeName!);
                            });
                        }
                    }
                }
                //else
            }
            //进入子节点
            for(let i = 0; i < children.length; i++) this.#hydrate(children[i]);
        }
        else if(node instanceof Text){ //fixed:如果修改Element的textContent则会覆盖所有子元素，所以我们仅在文本节点上执行这边的代码
            if(node.textContent){
                //只有单向绑定支持模板，双向绑定是不支持的，必须全都是
                const text = node.textContent, inserts = [...text.matchAll(nSoneWayBindingRegExp)];
                //没有匹配到则为null，匹配到则[n]为${HTMLDSLs.oneWayBinding.leftBracket}example${HTMLDSLs.oneWayBinding.rightBracket}
                if(inserts.length > 0){
                    //我们先确定这一段文字中所有需要的属性，然后保存好这一段文字，然后给这些属性添加export方法
                    //方法的具体内容是收集所有需要的属性，用保存好的文字作模板进行逐个属性的替换，最后塞回节点里
                    //fixed:note:已经验证：chromium和Gecko都会在一个文本节点textContent被清空后直接删除这个文本节点。
                    //succeed:通过exportInstance参数和一大堆定位常量，我们成功实现了文本节点被删除后的精确重建+正常更新！
                    const offsets = [], properties = [],
                          parent = node.parentNode!, nextNode = node.nextSibling; //不可能没有parentNode！https://developer.mozilla.org/zh-CN/docs/Web/API/Node/parentNode#%E5%A4%87%E6%B3%A8
                    //收集数据并创建尚未创建的属性
                    for(let i = 0; i < inserts.length; i++){
                        const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                        offsets.push(inserts[i].index);
                        properties.push(property);
                        //统一使用#proxy创建属性
                        if(!(property in this.#proxy)) this.#proxy[property] = undefined; //this.#data[property] = lUtils.data.createData();
                    }
                    //构造并记录export方法
                    const NRproperties = utils.generic.noRepeat(properties);
                    const __addedByDynamic__ :exportFunc = function(this :anyObject, exportInstance :exportInstance){ //参数里放this不影响函数的参数
                        let t = text; //为了保证它是值类型，node.textContent是引用类型，会变
                        if(!document.contains(exportInstance[1]!)){ //弄一个新的文本节点出来，必定存在
                            exportInstance[1] = document.createTextNode(text); //text是模板字符串，要用text才能replaceAll
                            parent.insertBefore(exportInstance[1], nextNode);
                        }
                        let thisNode = exportInstance[1]!;
                        for(let i = 0; i < NRproperties.length; i++){
                            let data = this[NRproperties[i]];
                            //fixed:见initData()->Proxy->set
                            if(typeof data == "object") data = lUtils.misc.advancedStringify(data);
                            t = t.replaceAll(`${HTMLDSLs.oneWayBinding.leftBracket}${NRproperties[i]}${HTMLDSLs.oneWayBinding.rightBracket}`, data);
                        }
                        //不修改innerText而是修改textContent，因为innerText会触发更多的浏览器绘制过程
                        //测试：执行for(let i = 0;i < 1000; i++){$0.innerText += "a"}
                        //innerText：144.42ms 每次都要触发一次重新计算样式——布局（强制自动重排）
                        //textContent：4.6ms 最后一次设置后再进行重新计算样式——布局
                        thisNode.textContent = t;
                    }
                    for(let i = 0; i < NRproperties.length; i++){
                        //数据属性流程。如果开发者没有赋值，那么插值标识将留下undefined，反正不要留下标识。这里是与Dynamic.new一样的同步操作，不存在覆盖开发者设置的值的问题！
                        if(!(NRproperties[i] in this.#proxy)) this.#proxy[NRproperties[i]] = undefined; //创建属性
                        //有可能是之前遍历的节点也插入了这个属性，我们不要随便赋值，只需要添加export即可，会自动引发的
                        lUtils.data.addExport(this.#proxy, this.#data[NRproperties[i]], __addedByDynamic__, node);
                    }
                }
                //textContent双向绑定
                else if(text.match(twoWayBindingRegExp)){
                    if( //fuck:我要爆粗口了！TS没十年脑溢血写不出来啊！你™parentElement返回类型HTMLElement？？？
                        //有生之年我居然在判断HTMLElement instanceof HTMLElement！
                        //并且ts还号称要平衡生产力和准确性，不修这个问题！2015年的老issue了https://github.com/microsoft/TypeScript/issues/4689#issuecomment-146324456
                        !(node.parentElement! instanceof HTMLElement)
                    ) console.warn("It's no use adding a two-way binding insert to an SVGElement, but dynamic will continue anyway.");
                    //todo:
                }
            }
            //else 一般不可能走到这浏览器就给你删了
        }
        //else console.error(s[0], node); //这里没有鬼片，注释节点会走到这里
    }
//#endregion

//#region DOM监控
    //WeakMap：96.59%（2022.8.22）
    #aOProcessorStore = new WeakMap<Element, MRProcessorFn>();
    #dOProcessorStore = new WeakMap<Node, MRProcessorFn>();
    #cOProcessorStore = new WeakMap<Element, MRProcessorFn>();
    //简单的DOM监控回调机制，全看对面MRProcessorFn设计得如何
    #observer :MutationObserver = new MutationObserver((records :MutationRecord[])=>{
        for(let i = 0; i < records.length; i++){
            const record = records[i], type = record.type;
            console.log(record);
            //既然有attribute那肯定是Element
            if(type == "attributes" && this.#aOProcessorStore.has(record.target as Element)) this.#aOProcessorStore.get(record.target as Element)!(record);
            else if(type == "characterData" && this.#dOProcessorStore.has(record.target)) this.#dOProcessorStore.get(record.target)!(record);
            //既然有childList那肯定是Element
            else if(type == "childList" && this.#cOProcessorStore.has(record.target as Element)) this.#cOProcessorStore.get(record.target as Element)!(record);
            //else
        }
    });
//#endregion
}