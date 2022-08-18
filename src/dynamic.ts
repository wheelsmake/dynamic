/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";
const isBeta = true;


//开发模式
console.info(
`dynamic(dnJS) ©LJM12914. https://github.com/wheelsmake/dynamic
You are using the unminified build of dynamic. Make sure to use the minified build for production.`);
const isDEVMode = "__dn_DEV__" in window && (window as anyObject).__dn_DEV__ === true && isBeta;


//字符串重用
const s :string[] = [
    "鬼片出现了！",
    "Access to deleted property was blocked: "
];


//主类
class App{
    #rootNode :Element;
    #data :dataObject = {};
    #proxy :dataObject;
    constructor(rootNode :Elementy){
        this.#rootNode = utils.arguments.reduceToElement(rootNode)!;
        console.info("creating new dynamic instance with rootNode", rootNode);
        //note:sharpData === this.#data
        this.#proxy = new Proxy(this.#data, {
            get(sharpData :dataObject, property :string | symbol, proxy :dataObject) :any{
                property = lUtils.misc.eliminateSymbol(property);
                console.log("get", property);
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
                //该属性已被删除
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                else return undefined;
            },
            set(sharpData :dataObject, property :string | symbol, newValue :unknown, proxy :dataObject) :boolean{
                property = lUtils.misc.eliminateSymbol(property);
                console.log("set", property, newValue);
                //正常存在该属性
                if(property in sharpData && !sharpData[property].deleted){
                    //如果传入的是函数，那么就收集函数中需要的属性，将这些属性的shouldUpdate中推一个这个属性
                    //argument_solved: `a.shouldUpdate[number] = "b"` 的意思是：当属性a发生改变时，要去更新b
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
                //该属性已被删除
                else if(sharpData[property].deleted) console.warn(`${s[1]}${property}.`);
                //尚未有该属性，新建
                else{
                    sharpData[property] = lUtils.data.createData(newValue, [], []);
                    if(lUtils.data){
                        //todo:
                    }
                }
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
        this.#detectInsert(this.#rootNode);
    }

    get rootNode(){return this.#rootNode;}
    //proxy本身没有不可变性，必须再用一个data只读伪属性保护
    //内部不要引用这个data！内部为什么不直接引用#proxy呢？？？？？
    get data(){return this.#proxy;}
    //缩写
    get _(){return this.#proxy;}
    //开发模式
    get __privateData__(){
        if(isDEVMode) return this.#data;
        else return "BLOCKED IN NON-DEV MODE";
    }

    addExport(dataProperty :string, func :exportFunc){
        return lUtils.data.addExport(this.#data[dataProperty], func);
    }
    removeExport(dataProperty :string, func :string | exportFunc){
        return lUtils.data.removeExport(this.#data[dataProperty], func);
    }
    //note:没有做:_ _:语法的东西，看看需不需要做吧
    #detectInsert(node :Node) :void{
        if(node instanceof Element){
            const attrs = node.attributes, children = Array.from(node.childNodes) as Node[];
            //别写in，否则出一大堆方法，NameNodeMap可以用数组那套，NameNodeMap.length返回的是正确的长度
            for(let i = 0; i < attrs.length; i++){
                //检查属性名和属性值，它们都要求全部是，不允许中途插入
                if(attrs[i].name.match(/:_[^:]+_:/)){
                    const property = attrs[i].name.substring(2, attrs[i].name.length - 2);
                    if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();
                    const __addedByDynamic__ = function(this :anyObject, oldValue :any){ //参数里放this不影响函数的参数
                        const valueOfAttr = node.getAttribute(oldValue)!; //review:可不可能得到null？
                        node.setAttribute(this[property], valueOfAttr);
                        node.removeAttribute(oldValue);
                    }
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //这个用来引发一次导出过程，将:__:标识变成开发者赋的值或undefined
                    (this.#proxy[property] as any) = undefined;
                }
                if(attrs[i].value.match(/:_[^:]+_:/)){
                    //name变量用于将属性名转换为值类型，取消响应性
                    const property = attrs[i].value.substring(2, attrs[i].value.length - 2), name = attrs[i].name;
                    if(!(property in this.#data)) this.#data[property] = lUtils.data.createData();
                    const __addedByDynamic__ = function(this :anyObject){ //参数里放this不影响函数的参数
                        node.setAttribute(name, this[property]);
                    }
                    lUtils.data.addExport(this.#data[property], __addedByDynamic__);
                    //这个用来引发一次导出过程，将:__:标识变成开发者赋的值或undefined
                    (this.#proxy[property] as any) = undefined;
                }
            }
            //进入子节点
            for(let i = 0; i < node.childNodes.length; i++) this.#detectInsert(node.childNodes[i]);
        }
        else if(node instanceof Text){
            //fixed:如果修改Element的textContent则会覆盖所有子元素，所以我们仅在文本节点上执行这边的代码
            //fixme:但是文本节点很容易被浏览器乱扔，这个目前没想到好的方法
            if(node.textContent){
                const inserts = [...node.textContent.matchAll(/:_[^:]+_:/g)];
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
                    if(offsets.length != properties.length) console.error(s[0], offsets, properties); //鬼片检验
                    //构造并记录export方法
                    const NRproperties = utils.generic.noRepeat(properties);
                    const __addedByDynamic__ = function(this :anyObject){ //参数里放this不影响函数的参数
                        var t = text; //为了保证它是值类型，node.textContent是引用类型，会变
                        for(let i = 0; i < NRproperties.length; i++) t = t.replaceAll(`:_${NRproperties[i]}_:`, this[NRproperties[i]]);
                        node.textContent = t;
                    }
                    for(let i = 0; i < NRproperties.length; i++){
                        lUtils.data.addExport(this.#data[NRproperties[i]], __addedByDynamic__);
                        //这个用来引发一次导出过程，将:__:标识变成开发者赋的值或undefined
                        (this.#proxy[NRproperties[i]] as any) = undefined;
                    }
                }
                //else
            }
            //else
        }
        else console.error(s[0], node);
    }
}


//分文件开发
import * as spa from "./spa";
import * as manifest from "./manifest";
//构造导出对象
const Dynamic = {
    //主方法
    new(rootNode :Elementy){
        return new App(rootNode);
    },
    spa, manifest,
    //实用方法
    e(s: string, scope?: Element | Document): Node | Node[]{return utils.element.e(s, scope);},
    debugger() :number{
        return setInterval(()=>{
            debugger;
        }, 20) as unknown as number; //™怎么默认NodeJS环境了？？？？？
    }
}
utils.generic.constantize(Dynamic);


//对象导出
export default Dynamic;