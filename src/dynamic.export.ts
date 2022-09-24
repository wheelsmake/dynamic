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

//构造导出对象
const Dynamic$ = App as Dynamic;
    //引入模块
Dynamic$.template = template;
Dynamic$.spa = spa;
Dynamic$.manifest = manifest;
    //工具方法
Dynamic$.e = utils.element.e;
Dynamic$.render = (args :{
    HTML :string | Element | HTMLCollection | Element[] | Node | NodeList | Node[];
    element :Element, insertAfter? :boolean, append? :boolean
}) :Node[]=>{return utils.element.render(args.HTML, args.element, args.insertAfter, args.append);};
Dynamic$.toHTML = utils.element.toHTML;
Dynamic$.hatch = utils.element.hatch;
Dynamic$.compose = ()=>{}; //todo:

//导出
const Dynamic :Dynamic = Dynamic$;
utils.generic.constantize(Dynamic);
export default Dynamic;