/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as lUtils from "./index";
const FtoString = Function.prototype.toString;
/**这里只负责创建对象并赋值，不负责任何值处理！*/
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
    if(typeof result.value == "function") result.cache = undefined;
    return result;
}
/**这里如果添加成功会自动引发一次针对性的export*/
export function addExport<T>(proxy :anyObject, dataInstance :data<T>, func :exportFunc, target? :Node) :shouldExportA{
    const sE = dataInstance.shouldExports;
    checkArrowFunction(func);
    //检测shouldExport里是不是已经有了完全相同的函数。很不幸，由于添加了target，我们需要手动遍历数组了
    //important:这里的函数还是原函数，不能bind，不然后面查重就失效了，我们等到用的时候再bind也不迟，并且分析函数还需要bind不同的东西
    let isDuplicated = false;
    for(let i = 0; i < sE.length; i++) if(sE[i][0] === func){
        isDuplicated = true;
        break;
    }
    if(isDuplicated) console.warn("Duplicated function", func, "is blocked being added to data", dataInstance);
    else{
        const exportInstance :exportInstance = [func, target];
        sE.push(exportInstance);
        //在这里会立即引发一次针对性的export，oldValue与现在的value相同
        //内置export方法大部分已经通过对比value和oldValue过滤掉了这次调用（但不能完全过滤）
        (func.bind(proxy))(exportInstance, dataInstance.value);
    }
    //不要让外部获取真正的引用地址
    return [...sE];
}
/**检测函数是否是箭头函数。箭头函数拿不到this，一定会出错*/
export function checkArrowFunction(func :Function) :void{
    if(FtoString.call(func).match(/^\([^\(\)]*\)[\s]*=>/)) utils.generic.E("func", undefined, func, "this function must not be an arrow function");
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
    //不要让外部获取真正的引用地址
    return [...sE];
}
/**@deprecated return typeof data.value == "function";*/
export function isComputedProperty<T>(data :data<T>) :boolean{
    return typeof data.value == "function";
}
/**静态分析目标函数访问了哪些this属性，不要对此寄予厚望！*/
//fixme:有很多地方不健壮，需要修复
export function detectShouldUpdate(string :string) :shouldUpdateA{
    const inQuote = {double: false, single: false, reversed: false}, result = [];
    var functionStarted = false, resultAdding = false, subCursor = 0;
    for(let i = 0; i < string.length; i++){
        if(string[i] == "{" && !functionStarted) functionStarted = true;
        if(functionStarted){
            if(string[i] == "\\n"){
                inQuote.double = false;
                inQuote.single = false;
            }
            if(string[i] == "`" && !inQuote.single && !inQuote.double) inQuote.reversed = !inQuote.reversed;
            if(string[i] == '"' && !inQuote.single && !inQuote.reversed) inQuote.double = !inQuote.double;
            if(string[i] == "'" && !inQuote.double && !inQuote.reversed) inQuote.single = !inQuote.single;
            //todo:字符串插值
            if(inQuote.reversed && string[i] == "$" && string[i + 1] == "{") processTemplate(i);
            //console.log(string.substring(i - 5, i+5), inQuote);
            //if(string[i] == "]" && subCursor != 0 && !inQuote.single && !inQuote.double && !inQuote.reversed){
                //result.push(string.substring(subCursor, i - 2));
                //subCursor = 0;
            //}
            if(!string[i].match(/[\w$]/) && subCursor != 0 && !inQuote.single && !inQuote.double && !inQuote.reversed){
                //console.log(string.substring(subCursor - 5, i + 5), string[subCursor], string[i]);
                result.push(string.substring(subCursor, i));
                subCursor = 0;
            }
            if(!inQuote.single && !inQuote.double && !inQuote.reversed 
             && string[i] == "t" && string[i + 1] == "h" && string[i + 2] == "i" && string[i + 3] == "s"
             && string[i + 4] == "." //我们决定不支持[]使用变量来访问this了，因为可能引用了外部变量，我们完全不可能知道
            ){
                subCursor = i + 5;
                i += 4; //跳过this.，不然在.那里就会出来
                //if(string[i + 4] == "["
                // && (string[i + 5] == '"' || string[i + 5] == "'" || string[i + 5] == "`")
                // ){ //fixme:
                    
                //}
            }
        }    
    }
    return utils.generic.noRepeat(result);
    function processTemplate(i :number){
        //todo:
    }
}