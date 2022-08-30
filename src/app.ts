/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";
const version = "1.0.0";

//开发模式
console.info(
`dynamic(dnJS) v${version} ©LJM12914. https://github.com/wheelsmake/dynamic
You are using the unminified build of dynamic. Make sure to use the minified build for production.`);

const
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
    //下面这个是用来检查开发者的错误的
    nStwoWayBindingRegExp = new RegExp(`${HTMLDSLs.twoWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.twoWayBinding.rightBracket}`, "g"),
    nSoneWayBindingRegExp = new RegExp(`${HTMLDSLs.oneWayBinding.leftBracket}[a-zA-Z$_][\\w$]*${HTMLDSLs.oneWayBinding.rightBracket}`, "g"),

//字符串重用
    s :string[] = [
        "鬼片出现了！",
        "Access to deleted property was blocked: ",
        ", automatically treated as one-way binding.",
        "function"
    ];


//主类
export default class App{
//#region 基本功能
    constructor(rootNode :Elementy){
        this.#rootNode = utils.arguments.reduceToElement(rootNode)!;
        console.info("creating new dynamic instance with rootNode", rootNode);
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

//#region DOM监控系统
    //WeakMap：96.59%（2022.8.22）
    #aOProcessorStore = new WeakMap<Element, MRProcessorFn>();
    #dOProcessorStore = new WeakMap<Node, MRProcessorFn>();
    #cOProcessorStore = new WeakMap<Element, MRProcessorFn>();
    get dOProcessorStore(){return this.#dOProcessorStore};
    //简单的DOM监控回调机制，全看对面MRProcessorFn设计得如何
    #observer :MutationObserver = new MutationObserver((records :MutationRecord[])=>{
        for(let i = 0; i < records.length; i++){
            const record = records[i], type = record.type;
            //console.log(record);
            //既然有attribute那肯定是Element
            if(type == "attributes" && this.#aOProcessorStore.has(record.target as Element)) this.#aOProcessorStore.get(record.target as Element)!(record);
            else if(type == "characterData" && this.#dOProcessorStore.has(record.target)) this.#dOProcessorStore.get(record.target)!(record);
            //既然有childList那肯定是Element
            else if(type == "childList" && this.#cOProcessorStore.has(record.target as Element)) this.#cOProcessorStore.get(record.target as Element)!(record);
            //else
        }
    });
//#endregion

//#region 数据管理
    #data :dataObject = {};
    //proxy本身没有不可变性，必须再用一个data只读伪属性保护 //class内部不要引用这个data！内部为什么不直接引用#proxy呢？？？？？
    get data(){return this.#proxy;}
    get _(){return this.#proxy;}
    //proxy虽然代理了#data这个dataObject，但它的表现其实就是一个典型的、完整的anyObject
    #proxy :anyObject = new Proxy(this.#data, {
        get(sharpData :dataObject, property :string | symbol, proxy :anyObject) :any{
            property = lUtils.misc.eliminateSymbol(property);
            //console.log("get", property);
            //正常存在该属性
            if(property in sharpData && !sharpData[property].deleted){
                let result :any;
                //如果是“计算”属性就返回缓存值
                if(typeof sharpData[property].value == s[3]) result = sharpData[property].cache;
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
        set(sharpData :dataObject, property :string | symbol, newValue :unknown, proxy :anyObject) :boolean{
            property = lUtils.misc.eliminateSymbol(property);
            //console.log("set", property, newValue);
            //正常存在该属性
            if(property in sharpData && !sharpData[property].deleted){
                //如果传入的是函数，那么就收集函数中需要的属性，将这些属性的shouldUpdate中推一个这个属性
                //`a.shouldUpdate[number] = "b"` 的意思是：当属性a发生改变时，要去更新b
                //更新b并不是运行一次b.value函数，而是去更新b.shouldExport，重新运行一遍这些方法，将DOM中的b更新
                //我们也要同样地去b.shouldUpdate里将它们的shouldExport运行了，因为它们的值也“应该”改变了
                //这是一个递归过程，一直从shouldUpdate下去，一直运行shouldExport
                const oldValue = sharpData[property].value;
                if(oldValue !== newValue){ //要是前后相同，那为什么还要更新呢？——嫖怪
                    sharpData[property].value = newValue;
                    processComputedProperty(sharpData[property]);
                    //导出数据
                    const exportInstances = sharpData[property].shouldExports;
                    for(let i = 0; i < exportInstances.length; i++) exportInstances[i][0].call(proxy, exportInstances[i], oldValue);
                    //更新需要更新的属性
                    //console.log("update"+property, sharpData[property].shouldUpdates);
                    for(let i = 0; i < sharpData[property].shouldUpdates.length; i++) dfsUpdate(sharpData[property].shouldUpdates[i]);
                    function dfsUpdate(prop :string) :void{
                        if(prop in sharpData && typeof sharpData[prop].value == s[3]){ //找到计算属性
                            const dfsOldValue = sharpData[prop].cache; //记录旧数据
                            sharpData[prop].cache = sharpData[prop].value.call(proxy); //更新“计算”属性的缓存
                            //导出数据
                            const exportInstances = sharpData[prop].shouldExports;
                            for(let i = 0; i < exportInstances.length; i++) exportInstances[i][0].call(proxy, exportInstances[i], dfsOldValue);
                            //递归
                            for(let i = 0; i < sharpData[prop].shouldUpdates.length; i++) dfsUpdate(sharpData[prop].shouldUpdates[i]);
                        }
                    }
                }
                //阴间功能：将计算属性赋值给它自己会触发重新计算lUtils.data.checkArrowFunction(newValue as Function);
                //太阴间了，会导致将cache赋给value，不要了
                //else if(typeof newValue == s[3]) sharpData[property].cache = 
                else console.log(`Update skipped in ${property} for same value ${newValue}`);
            }
            //尚未有该属性，新建
            else if(!(property in sharpData)){
                sharpData[property] = lUtils.data.createData(newValue);
                processComputedProperty(sharpData[property]);
            }
            //该属性已被删除fixed:这个不能放在没有该属性前，reading undefined警告
            else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
            else console.error(s[0], "set", property); //不可能有else了
            return true;
            /**建立cache，执行计算，分析函数，修改shouldUpdates，否则删除cache*/
            function processComputedProperty<T>(dataInstance :data<T>) :void{
                property = lUtils.misc.eliminateSymbol(property);
                if(typeof newValue == s[3]){
                    lUtils.data.checkArrowFunction(newValue as Function);
                    dataInstance.cache = (newValue as Function).call(proxy);
                    const shouldUpdateThis = lUtils.data.detectShouldUpdate(Function.prototype.toString.call(newValue));
                    //console.log(shouldUpdateThis, property);
                    for(let i = 0; i < shouldUpdateThis.length; i++){
                        //如果函数中访问了还没有创建的属性，那么我们只能去创建它，因为shouldUpdateA不能在之后补上。其实正确的做法是先不创建的
                        if(!(shouldUpdateThis[i] in sharpData)) proxy[shouldUpdateThis[i]] = undefined;
                        if(sharpData[shouldUpdateThis[i]].shouldUpdates.indexOf(property) == -1) sharpData[shouldUpdateThis[i]].shouldUpdates.push(property);
                    }
                }
                //将“计算”属性变成普通属性，反正delete不报错，随便操作
                else delete dataInstance.cache;
            }
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
    //这几个必须使用#data得到完整的data实例
    addExport(dataProperty :string, func :exportFunc, target :Node) :shouldExportA{return lUtils.data.addExport(this.#proxy, this.#data[dataProperty], func, target);}
    removeExport(dataProperty :string, func :string | exportFunc) :shouldExportA{return lUtils.data.removeExport(this.#data[dataProperty], func);}
    getExports(dataProperty :string) :shouldExportA{return [...this.#data[dataProperty].shouldExports];}
//#endregion

//#region 实例内方法
    #methods :functionObject = {};
    #methodsProxy = new Proxy(this.#methods, {
        //review:为了获取#proxy我们只能使用箭头函数了，不知道会不会出问题
        get: (sharpMethods, property, proxy)=>{
            property = lUtils.misc.eliminateSymbol(property);
            if(property in sharpMethods) return sharpMethods[property].bind(this.#proxy);
            else return undefined;
        }/*,
        set(sharpMethods, property, newValue, proxy){
            property = lUtils.misc.eliminateSymbol(property);
            //if(property in sharpMethods) console.warn(`Avoid changing methods`); //感觉改方法挺常见的
            sharpMethods[property] = newValue;
            return true;
        }*/
    });
    get methods(){return this.#methodsProxy;}
    get $(){return this.#methodsProxy;}
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
            const data = this.data, methods = this.methods;
            lUtils.misc.noErrorDefineProperties(node, {
                data: {
                    configurable: false,
                    enumerable: true,
                    get(){return data;}
                },
                _: {
                    configurable: false,
                    enumerable: true,
                    get(){return data;}
                },
                methods: {
                    configurable: false,
                    enumerable: true,
                    get(){return methods;}
                },
                $: {
                    configurable: false,
                    enumerable: true,
                    get(){return methods;}
                }
            });
            const attrs = Array.from(node.attributes), children = Array.from(node.childNodes) as Node[];
            //记录必要信息，在遍历完所有属性后再执行破坏性操作，保证这个for循环是纯函数
            const tasks :[1 | 2, string, string, string][] = [];
            for(let i = 0; i < attrs.length; i++){
                //#region 关于attribute与property的讨论
                /*important:fixed:对于某些attribute来说，它们本身只是一个默认值，想要获得真正的值需要访问节点的对应property！
                但是我们无法知道哪些attribute有这种阴间问题，到时候一味更新attribute没更新到property就没用了
                目前看了看标准和文档，来试图真正说清楚这个。
                我们将property/attribute组合叫pa组合，将 $0[property] = x会导致$0.getAttribute("property") === x 称为 拥有完整的p->a同步，将 $0.setAttribute("property", x)会导致$0[property] === x 称为 拥有完整的a->p同步，将拥有完整的p->a同步和拥有完整的a->p同步称为完全双向同步，拥有两者中任一种称为单向同步。
                如果存在同步，但property的值需要改变，那么称为非同名同步。
                pa组合一共有以下几种：1. 同名且完全双向同步，如accept。2. 不同名且完全双向同步，如value(a)和defaultValue(p)。3. 不同名且不可能双向同步，因为两边的格式不同，如style。但是这种情况下浏览器已经做好了转换，可以近似视作第二种。
                由此可见pa组合一定存在双向同步，这和whatwg.org的标准是完全相符的；但是可能名字不同。这个名字不同问题很大，因为有的只是kebab转camel，有的整个都变了，如value->defaultValue，class->className。
                并且有的不同组合的a和p存在一次性的同步，这个“一次性”发生在第一次加载页面（Gecko和IE）或每次刷新页面（chromium）
                例如value(a)和value(p)，它们不是一个组合（value(a)和defaultValue(p)才是一对的），一次性同步方向为value(a)->value(p)。
                我们的目的是：能够做到属性值与data双向同步，即修改属性值会触发data修改且触发data should*事件，修改data触发属性值的修改。
                然而property不能被监控，只有attribute可以用observer监控，所以我们只能用常规方法做到存在与之对应的attribute的property的响应式
                像<input>中的value和checked这两个property，没有对应的attribute，于是我们必须用另一种方法：直接设置property。
                我们也不能通过observer实现双向绑定，但还好浏览器提供了oninput事件，可以用这个补回去。
                于是可以做了！
                参考链接：
                https://javascript.info/dom-attributes-and-properties#:~:text=But%20there%20are%20exclusions
                https://stackoverflow.com/questions/57475325
                https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes
                */
                //#endregion
                
                let name = attrs[i].name, value = attrs[i].value; //???:这里不能用var？不同次for之间居然能共享var变量？
                const nameOne = !!name.match(oneWayBindingRegExp),
                      nameTwo = !!name.match(twoWayBindingRegExp),
                      valueOne = !!value.match(oneWayBindingRegExp),
                      valueTwo = !!value.match(twoWayBindingRegExp),
                      nameInserted = nameOne || nameTwo,
                      valueInserted = valueOne || valueTwo;
                let name_property :string,
                    value_property :string,
                    //这两个和name一起构成了一个筛查链条：如果有${HTMLDSLs.attrAdditional}，那么%2和%1不同，如果有default陷阱那么%3也和%2不同
                    //最终%3是真正在设置的东西
                    processed_avoidance_name :string,
                    processed_avoidance_defaultTrap_name :string;
                
                //各种警告
                if(nameTwo) console.warn(`It's not rational to declare a two-way binding attribute name: ${name}${s[2]} Use "${HTMLDSLs.oneWayBinding.leftBracket}${name.substring(2, name.length - 2)}${HTMLDSLs.oneWayBinding.rightBracket}" instead.`);
                //这个还是不能允许
                if(nameInserted && valueInserted) console.warn("Cannot set an attribute with both name and value dynamic. Dynamic will make only attribute name dynamic.");
                
                //属性名和属性值都要求全部是插值，不允许中途插值；其中属性值支持双向绑定
                if(nameInserted){ //处理属性名
                    name_property = name.substring(2, name.length - 2);
                    //更新attribute的名称，值不改变；但是本质上是删除旧attribute，添加新attribute；因此必须需要一个参数，否则无从得知是哪个attribute
                    const __addedByDynamic__ :exportFunc = function(this :anyObject, exportInstance :exportInstance, oldValue :string){ //参数里放this不影响函数的参数
                        const newValue = this[name_property];
                        //过滤oldValue和newValue相同的情况（类型不同的话不能做到完全过滤）
                        if(oldValue !== newValue){
                            const thisNode = exportInstance[1] as Element,
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
                    if(!(name_property in this.#proxy)) this.#proxy[name_property] = undefined; //创建属性
                    lUtils.data.addExport(this.#proxy, this.#data[name_property], __addedByDynamic__, node); //如果已经存在数据属性那么不要随便赋值，只需要添加export即可
                }
                else if(valueInserted){ //处理属性值
                    value_property = value.substring(2, value.length - 2);
                    //筛查规避属性
                    if(name[name.length - 1] == HTMLDSLs.attrAdditional) processed_avoidance_name = name.substring(0, name.length - 1);
                    else processed_avoidance_name = name;
                    let __addedByDynamic__ :exportFunc;
                    if( //特殊attribute/property处理
                        (processed_avoidance_name == "value" || processed_avoidance_name == "checked")
                     && node instanceof HTMLInputElement //避免其他元素上可能存在这些开发者自定义的属性，造成干扰
                     && processed_avoidance_name in node //这个东西感觉没啥作用，其实只是加个保险。检测是否存在对应property，似乎value真的在input的原型链上而不是它本身的属性
                    ) __addedByDynamic__ = function(this :anyObject, exportInstance :exportInstance, oldValue :any){
                        const newValue = this[value_property];
                        //过滤oldValue和newValue相同的情况（类型不同的话不能做到完全过滤）
                        if(oldValue !== newValue) (node as anyObject)[processed_avoidance_name] = newValue;
                    }
                    else{
                        //处理上一个if过滤掉的对称情况
                        if(node instanceof HTMLInputElement){
                            //快死了，乱转大写小写的
                            if(processed_avoidance_name == "defaultvalue" && "defaultValue" in node) processed_avoidance_defaultTrap_name = "value";
                            else if(processed_avoidance_name == "defaultchecked" && "defaultChecked" in node) processed_avoidance_defaultTrap_name = "checked";
                            else processed_avoidance_defaultTrap_name = processed_avoidance_name;
                        }
                        else processed_avoidance_defaultTrap_name = processed_avoidance_name;
                        __addedByDynamic__ = function(this :anyObject, exportInstance :exportInstance, oldValue :any){
                            const newValue = this[value_property];
                            //过滤oldValue和newValue相同的情况（类型不同的话不能做到完全过滤）
                            if(oldValue !== newValue){
                                //我们将null视为属性被动态删除了
                                if(newValue === null) node.removeAttribute(processed_avoidance_defaultTrap_name); //setAttribute删不掉
                                else node.setAttribute(processed_avoidance_defaultTrap_name, newValue);
                            } 
                            //else 值没有改变，直接返回
                        }
                    }
                    if(!(value_property in this.#proxy)) this.#proxy[value_property] = undefined; //创建属性
                    lUtils.data.addExport(this.#proxy, this.#data[value_property], __addedByDynamic__, node); //如果已经存在数据属性那么不要随便赋值，只需要添加export即可
                    //#region 双向绑定补丁
                    if(valueTwo){
                        //特别处理这几个东西，就是这里需要用到原始的name
                        if(node instanceof HTMLInputElement){
                            if(name == "value"){
                                node.addEventListener("input", (e :Event)=>{
                                    if(e.target === node) this.#proxy[value_property] = node.value;
                                });
                            }
                            else if(name == "checked"){
                                node.addEventListener("input", (e :Event)=>{
                                    if(e.target === node) this.#proxy[value_property] = node.checked;
                                });
                            }
                            //else if(name == "defaultValue") 不需要了，跟着下面去监听就行了
                        }
                        else{
                            this.#aOProcessorStore.set(node, (record: MutationRecord)=>{
                                //使用record.target而不是node，否则会增加内存占用
                                if(
                                    record.attributeName === processed_avoidance_defaultTrap_name
                                //只有在attribute值和数据属性的值不一样的时候才需要同步，否则会导致无限同步
                                 && (record.target as Element).getAttribute(record.attributeName!) !== this.#proxy[value_property]
                                ) this.#proxy[value_property] = (record.target as Element).getAttribute(record.attributeName!);
                            });
                        }
                    }
                    //#endregion
                }
                //else

                //录入破坏性任务
                if(nameInserted) tasks.push([1, name, name_property!, value]);
                else if(valueInserted) tasks.push([2, name, processed_avoidance_defaultTrap_name!, value_property!]);
            }

            //执行破坏性任务
            for(let i = 0; i < tasks.length; i++){
                const taskInstance = tasks[i];
                if(taskInstance[0] == 1){ //属性名匹配
                    node.removeAttribute(taskInstance[1]); //删除旧属性
                    //这个不能用__addedByDynamic__代替，因为它出于性能原因会检查属性值是否没有改变
                    node.setAttribute(this.#proxy[taskInstance[2]], taskInstance[3]); //将value搬迁到新的attribute中
                }
                else if(taskInstance[0] == 2){ //属性值匹配
                    //是特殊attribute/property，不应setAttr而应修改property
                    if(taskInstance[2] === undefined) (node as anyObject)[taskInstance[1]] = this.#proxy[taskInstance[3]];
                    //这个不能用__addedByDynamic__代替，因为它出于性能原因会检查属性值是否没有改变
                    else{
                        node.removeAttribute(taskInstance[1]); //使用最初的name来删除旧属性
                        node.setAttribute(taskInstance[2], this.#proxy[taskInstance[3]]); //将数据属性的值export一次
                    }
                }
                //else
            }

            //进入子节点
            for(let i = 0; i < children.length; i++) this.#hydrate(children[i]);
        }
        else if(node instanceof Text){ //fixed:如果修改Element的textContent则会覆盖所有子元素，所以我们仅在文本节点上执行这边的代码
            if(node.textContent){
                //双向绑定直接视为单向绑定并警告
                const text = node.textContent, twoWayInserts = [...text.matchAll(nStwoWayBindingRegExp)],
                      inserts = [...text.matchAll(nSoneWayBindingRegExp),...twoWayInserts],
                      matchTwoWayBinding = text.match(twoWayBindingRegExp);
                if(twoWayInserts.length > 0 && !matchTwoWayBinding) console.warn(`Two-way bindings in "${text}" cannot be used in textContent template${s[2]}`);

                //textContent双向绑定，只有单向绑定支持模板，双向绑定是不支持的，必须全都是并且是整个元素全都是，不允许出现其他兄弟节点
                //这种情况需要先判断，因为后一种情况包含了这一种情况
                if(matchTwoWayBinding){
                    //fuck:我要爆粗口了！TS没十年脑溢血写不出来啊！你™parentElement返回类型HTMLElement？？？
                    //有生之年我居然在判断HTMLElement instanceof HTMLElement！
                    //并且ts还号称要平衡生产力和准确性，不修这个问题！2015年的老issue了https://github.com/microsoft/TypeScript/issues/4689#issuecomment-146324456
                    if(!(node.parentElement! instanceof HTMLElement)) console.warn("It's no use adding a two-way binding insert to an SVGElement, but dynamic will continue anyway.");
                    const property = text.substring(2, text.length - 2),
                          parent = node.parentNode!; //不可能没有parentNode！
                    if(parent.childNodes.length == 1){
                        const __addedByDynamic__ :exportFunc = function(this :anyObject){
                            //fixme:由于目前parent里只有一个只有一个插值Element，我们完全可以直接将内容写进parent；
                            //但要输出HTML DOM就不能这样做了
                            if(parent.textContent !== this[property]) parent.textContent = this[property];
                            /*let t = text;
                            if(!document.contains(exportInstance[1]!)){ //检查旧文本节点还在不在，这个别过滤，常回家看看他不香吗？
                                let oldNode = exportInstance[1]!;
                                exportInstance[1] = document.createTextNode(t); //text是模板字符串，要用text才能replaceAll
                                parent.appendChild(exportInstance[1]); //随便，反正就一个节点
                            }
                            let thisNode = exportInstance[1]!, data = this[property];
                            //过滤oldValue和newValue相同的情况（类型不同的话不能做到完全过滤）
                            if(data !== oldValue){
                                //fixed:见initData()->Proxy->set
                                if(typeof data == "object") data = lUtils.misc.advancedStringify(data);
                                //todo:输出HTML DOM
                                t = t.replaceAll(`${HTMLDSLs.twoWayBinding.leftBracket}${property}${HTMLDSLs.twoWayBinding.rightBracket}`, data);
                                //上面不能做到完全过滤，所以这里来个终极过滤
                                if(thisNode.textContent !== t) thisNode.textContent = t; //不修改innerText而是修改textContent，因为innerText会每次都触发浏览器绘制过程
                            }*/
                        }
                        if(!(property in this.#proxy)) this.#proxy[property] = undefined; //创建属性
                        lUtils.data.addExport(this.#proxy, this.#data[property], __addedByDynamic__, node);
        //fixed:note:已经验证：chromium会乱搞文本节点，具体内容是：
        //仅在chromium中：两个文本节点在一起，在开发者工具中编辑前面那个后后面那个的内容会加到前面，后面那个被删，编辑后面那个会将前面那个删掉。
        //设置textContent = ""，文本节点不会被删。
        //contenteditable后内容被用户清空，文本节点不会被删。仅在chromium中：再输入内容时重建的是另一个文本节点，即使设置了webkit-user-modify: read-write-plaintext-only。
        //因此会出现contenteditable内容清空后新内容输入到新节点的情况
        //succeed:有解决方案了！可以通过input事件从父元素获取数据！不用抓着文本节点不放了！
                        parent.addEventListener("input", (e :Event)=>{
                            if(e.target === parent && parent.textContent !== this.#proxy[property]) this.#proxy[property] = parent.textContent;
                            //todo:目前只支持文本，要支持HTML DOM双向绑定可能需要重构上面的代码
                        });
                        //这边需要自己上阵干掉标识
                        node.textContent = this.#proxy[property];
                        //console.log(document.contains(node));
                    }
                    else console.error("The parent element of a two-way binding text node must only have this text node.");
                }
                //没有匹配到则为null，匹配到则[n]为${HTMLDSLs.oneWayBinding.leftBracket}example${HTMLDSLs.oneWayBinding.rightBracket}
                else if(inserts.length > 0){
                    //我们先确定这一段文字中所有需要的属性，然后保存好这一段文字，然后给这些属性添加export方法
                    //方法的具体内容是收集所有需要的属性，用保存好的文字作模板进行逐个属性的替换，最后塞回节点里
                    //succeed:通过exportInstance参数和一大堆定位常量，我们成功实现了文本节点被删除后的精确重建+正常更新！
                    const /*offsets = [],*/ properties = [],
                          parent = node.parentNode!, nextNode = node.nextSibling; //不可能没有parentNode！https://developer.mozilla.org/zh-CN/docs/Web/API/Node/parentNode#%E5%A4%87%E6%B3%A8
                    //收集数据并创建尚未创建的属性
                    for(let i = 0; i < inserts.length; i++){
                        const property = inserts[i][0].substring(2, inserts[i][0].length - 2);
                        //offsets.push(inserts[i].index);
                        properties.push(property);
                        if(!(property in this.#proxy)) this.#proxy[property] = undefined; //统一使用#proxy创建属性
                    }
                    //构造并记录export方法
                    const NRproperties = utils.generic.noRepeat(properties);
                    const __addedByDynamic__ :exportFunc = function(this :anyObject, exportInstance :exportInstance){ //参数里放this不影响函数的参数
                        let t = text; //为了保证它是值类型，node.textContent是引用类型，会变
                        if(!document.contains(exportInstance[1]!)){ //检查旧文本节点还在不在
                            exportInstance[1] = document.createTextNode(t); //text是模板字符串，要用text才能replaceAll
                            parent.insertBefore(exportInstance[1], nextNode);
                        }
                        let thisNode = exportInstance[1]!;
                        //由于不知道调用该函数的数据属性（caller）是哪个，无法过滤数据并未改动的情况，也因此会收到addExport的调用而不需要自己上阵干掉标识了
                        for(let i = 0; i < NRproperties.length; i++){
                            let data = this[NRproperties[i]];
                            //fixed:见initData()->Proxy->set
                            if(typeof data == "object") data = lUtils.misc.advancedStringify(data);
                            //todo:输出HTML DOM
                            t = t //这里也需要处理双向绑定，因为模板中的双向绑定被当作是单向绑定了
                            .replaceAll(`${HTMLDSLs.oneWayBinding.leftBracket}${NRproperties[i]}${HTMLDSLs.oneWayBinding.rightBracket}`, data)
                            .replaceAll(`${HTMLDSLs.twoWayBinding.leftBracket}${NRproperties[i]}${HTMLDSLs.twoWayBinding.rightBracket}`, data);
                        }
                        if(thisNode.textContent !== t) thisNode.textContent = t; //不修改innerText而是修改textContent，因为innerText会每次都触发浏览器绘制过程
                    }
                    for(let i = 0; i < NRproperties.length; i++) lUtils.data.addExport(this.#proxy, this.#data[NRproperties[i]], __addedByDynamic__, node); //如果已经存在数据属性那么不要随便赋值，只需要添加export即可
                }
                //else 其他情况不用判断
            }
            //else 一般不可能走到这浏览器就给你删了
        }
        //else console.error(s[0], node); //这里没有鬼片，注释节点会走到这里
    }
//#endregion
}