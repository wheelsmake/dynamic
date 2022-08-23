/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as lUtils from "./index";
import * as cycle from "../libs/cycle";
export function eliminateSymbol(property :string | Symbol) :string{
    if(typeof property == "symbol") utils.generic.E(property.toString(), "string", property,  "index of Dynamic.data must not be a Symbol");
    return property as string;
}
const toString = Object.prototype.toString;
/**Not `JSON.stringify`, more than `JSON.stringify`.*/
export function advancedStringify(input :object) :string{
    if(typeof input != "object") utils.generic.E("input", "object", input);
    //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#%E5%BC%82%E5%B8%B8
    //用这个记录事后将不应该加双引号的类型去除双引号，避免如"undefined"（typeof string）和undefined（typeof undefined）都变成"undefined"的情况
    //const patchList :[string[], string[], object[]] = [[], [], []];
    if(input === null) return "null"; //不要{}了
    else{
        var result :string = "{";
        //我们只对元素本身的、可枚举的属性进行提取，即Object.keys得到的东西。
        const properties = Object.keys(input), toStringed = compatibleToString(input);
        if(properties.length == 0){
            if(toStringed != "[object Object]") return toStringed;
            else return "{}";
        }
        else{
            const input_ = cycle.decycle(input) as anyObject;
            for(let i = 0; i < properties.length; i++){
                const key = properties[i], value = input_[key], type = typeof value;
                if(type == "undefined" || type == "number" || type == "boolean") addResult(value);
                else if(type == "string") addResult(`"${value}"`); //字符串是带双引号的
                else if(type == "bigint") addResult(value + "n");
                else if(type == "symbol") addResult(value.toString()); //symbol不能隐式转换为字符串，又不能用in运算符
                else if(type == "function") addResult(compatibleToString(value));
                else if(type == "object") addResult(advancedStringify(value));
                //else utils.generic.EE("?"); 这个如果真走到了那世界可以毁灭了
                if(i < properties.length - 1) result += ", ";
                function addResult(input2 :any) :void{
                    result += `${key}: ${input2}`;
                }
            }
            result += "}";
            return result;
        }
    }
}
export function compatibleToString(input2 :object) :string{
    //typeof undefined不能in
    //typeof number™也不能in？？？那只能在前面兼容了
    return "toString" in input2 ? input2.toString() : toString.call(input2);
}