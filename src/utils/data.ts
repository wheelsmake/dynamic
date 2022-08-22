/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as lUtils from "../utils/index";
export function createData(
    value? :any,
    shouldUpdate? :string[],
    shouldExport? :((node? :Node)=>void)[]
) :data{
    const result :data = {
        value,
        deleted: false,
        shouldUpdates: shouldUpdate ? shouldUpdate : [],
        shouldExports: shouldExport ? shouldExport : []
    }
    if(isComputedProperty(result)) result.cache = undefined;
    return result;
}
export function addExport(dataInstance :data, func :exportFunc) :shouldExportA{
    const sE = dataInstance.shouldExports, funcString = func.toString();
    //检测函数是否是箭头函数，箭头函数拿不到this，一定会出错
    if(funcString.match(/^\([^\(\)]*\)[\s]*=>/)) utils.generic.E("func", "exportFunc", func, "export function must not be an arrow function");
    //检测shouldExport里是不是已经有了完全相同的函数。indexOf()使用全等（===）进行比较。
    //important:这里的函数还是原函数，不能bind，不然后面查重就失效了，我们等到用的时候再bind也不迟
    //并且分析函数还需要bind不同的东西
    if(sE.indexOf(func) == -1) sE.push(func);
    else console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    return sE;
}
export function removeExport(dataInstance :data, func :string | exportFunc) :shouldExportA{
    const sE = dataInstance.shouldExports;
    if(typeof func == "string"){
        if(func == "__addedByDynamic__") utils.generic.E("func", "string | exportFunc", func, "this name is reserved");
        else if(func == "") console.warn("Operation blocked trying to remove ALL annoymous functions. Use the function itself for argument instead.");
        //注意这里会删除所有同名函数！
        else for(let i = 0; i < sE.length; i++) if(sE[i].name === func) utils.generic.precisePop(sE[i], sE);
    }
    else if(typeof func == "function") utils.generic.precisePop(func, sE); //不是exportFunc没关系；precisePop已经处理了-1
    else utils.generic.E("func", "string | exportFunc", func);
    return sE;
}
/**return typeof data.value == "function";*/
export function isComputedProperty(data :data) :boolean{
    return typeof data.value == "function";
}
export function pushCache(){

}