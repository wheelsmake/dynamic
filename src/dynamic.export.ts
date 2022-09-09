/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";

//分文件开发
import App from "./app";
import * as template from "./template";
import * as spa from "./spa";
import * as manifest from "./manifest";


//禁用开发者工具的hack变量
const cI = clearInterval;
var dtInterval :number;
//禁用开发者工具（不推荐，因此在API指引里没写）
function __disableDevTools__() :void{
    dtInterval = (()=>{
        return setInterval(()=>{
            debugger;
        }, 20) as unknown as number; //怎么默认在NodeJS环境下呢？？？
    })();
    //hack clearInterval，让它不清除我们的这个
    //Proxy中毒太深了，Proxy只在一大堆对象的代理上有性能优势，就这一个还不如用function
    (clearInterval as any) = (id: number | undefined) :void=>{
        if(id != dtInterval) cI.call(window, id);
    }
    /*(clearInterval as any) = new Proxy(clearInterval, {
        apply(target, thisArg, argArray){
            if(argArray[0] != dtInterval) return Reflect.apply(target, thisArg, argArray);
        }
    });*/
}
function __enableDevTools__() :void{
    (clearInterval as any) = cI;
    clearInterval(dtInterval);
}

//构造导出对象
const Dynamic :Dynamic = (rootNode :Elementy)=>{return App(rootNode);}
    //引入模块
Dynamic.template = template;
Dynamic.spa = spa;
Dynamic.manifest = manifest;
    //工具方法
Dynamic.e = (s: string, scope?: Element | Document) :Node | Node[]=>{return utils.element.e(s, scope);};
Dynamic.render = (args :{
    HTML :string | Element | HTMLCollection | Element[] | Node | NodeList | Node[];
    element :Element, insertAfter? :boolean, append? :boolean
}) :Node[]=>{return utils.element.render(args.HTML, args.element, args.insertAfter, args.append);};
Dynamic.toHTML = (HTML :string) :Node[]=>{return utils.element.toHTML(HTML)};
Dynamic.hatch = (element :Element, remove? :boolean) :Node[]=>{return utils.element.hatch(element, remove);};
Dynamic.compose = ()=>{}; //todo:
    //hack
Dynamic.__disableDevTools__ = __disableDevTools__;
Dynamic.__enableDevTools__ = __enableDevTools__;

//导出
utils.generic.constantize(Dynamic);
export default Dynamic;