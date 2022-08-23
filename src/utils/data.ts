/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as lUtils from "./index";
export function createData<T>(
    value? :T,
    shouldUpdate? :shouldUpdateA,
    shouldExport? :shouldExportA
) :data<T>{
    const result :data<T> = {
        value,
        deleted: false,
        shouldUpdates: shouldUpdate || [],
        shouldExports: shouldExport || []
    }
    if(isComputedProperty(result)) result.cache = undefined;
    return result;
}
/**这里如果添加成功会自动引发一次针对性的export*/
export function addExport<T>(proxy :anyObject, dataInstance :data<T>, func :exportFunc, target? :Node) :shouldExportA{
    const sE = dataInstance.shouldExports, funcString = func.toString();
    //检测函数是否是箭头函数，箭头函数拿不到this，一定会出错
    if(funcString.match(/^\([^\(\)]*\)[\s]*=>/)) utils.generic.E("func", "exportFunc", func, "export function must not be an arrow function");
    //检测shouldExport里是不是已经有了完全相同的函数。很不幸，由于添加了target，我们需要手动遍历数组了
    //important:这里的函数还是原函数，不能bind，不然后面查重就失效了，我们等到用的时候再bind也不迟，并且分析函数还需要bind不同的东西
    let isDuplicated = false;
    for(let i = 0; i < sE.length; i++) if(sE[i][0] === func){
        isDuplicated = true;
        break;
    }
    if(isDuplicated) console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    else{
        const instance :exportInstance = [func, target];
        sE.push(instance);
        //在这里会立即引发一次针对性的export，oldValue与现在的value相同
        (func.bind(proxy))(instance, dataInstance.value);
    }
    return sE;
}
export function removeExport<T>(dataInstance :data<T>, func :string | exportFunc) :shouldExportA{
    const sE = dataInstance.shouldExports;
    if(typeof func == "string"){
        if(func == "__addedByDynamic__") utils.generic.E("func", "string | exportFunc", func, "this name is reserved");
        else if(func == "") console.warn("Operation blocked trying to remove ALL annoymous functions. Use the function itself for argument instead.");
        //注意这里会删除所有同名函数！
        else for(let i = 0; i < sE.length; i++) if(sE[i][0].name === func) utils.generic.precisePop(sE[i], sE);
    }
    //由于添加了target，这里需要遍历数组
    else if(typeof func == "function") for(let i = 0; i < sE.length; i++) if(sE[i][0] === func) utils.generic.precisePop(sE[i], sE); //不是exportFunc没关系；precisePop已经处理了-1
    else utils.generic.E("func", "string | exportFunc", func);
    return sE;
}
/**return typeof data.value == "function";*/
export function isComputedProperty<T>(data :data<T>) :boolean{
    return typeof data.value == "function";
}
export function pushCache(){

}