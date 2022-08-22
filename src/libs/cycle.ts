/* cycle.js
 * 2021-05-31
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 * This code should be minified before deployment.
 * See https://www.crockford.com/jsmin.html
 * USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO NOT CONTROL.
*/
/* library of dynamic
 * dynamic ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
 * [edited]
*/
import * as utils from "../../../utils/index";
import * as lUtils from "../utils/index";
/**Make a deep copy of an object or array, assuring that there is at most one instance of each object or array in the resulting structure. The duplicate references (which might be forming cycles) are replaced with an object of the form {"$ref": PATH} where the PATH is a JSONPath string that locates the first occurance.
 * 
 * So,`var a = [];a[0] = a;return JSON.stringify(JSON.decycle(a));`produces the string '[{"$ref":"$"}]'.
 * 
 * JSONPath is used to locate the unique object. $ indicates the top level of the object or array.
 * 
 * [NUMBER] or [STRING] indicates a child element or property.*/
export function decycle(object :object) :object{
    const objects = new WeakMap<object, string>(); //WeakMap：96.59%
    return(function checkCycle(object :object, path :string){
        if( //过滤阴间object
            typeof object === "object"
         && object !== null
         && !(object instanceof Boolean)
         && !(object instanceof Date)
         && !(object instanceof Number)
         && !(object instanceof RegExp)
         && !(object instanceof String)
        ){
            const prev_path = objects.get(object);
            //如果在存储中已经有了对应的唯一值，那么就存在循环引用…………………………？，返回$ref：那个值的路径
            //fixed:仅当路径存在相同部分时，我们才能走回原点，这样才存在循环引用
            if(prev_path !== undefined && path.indexOf(prev_path) != -1) return {$ref: prev_path};
            else objects.set(object, path); //否则加入将这个值和路径加入存储
            //进入对象或数组，递归
            if(object instanceof Array){
                const newObj :any[] = [];
                for(let i = 0; i < object.length; i++) newObj[i] = checkCycle(object[i], path + "[" + i + "]");
                return newObj;
            }
            else{
                const newObj :anyObject = {}, keys = Object.keys(object);
                if(keys.length != 0) for(let i = 0; i < keys.length; i++) newObj[keys[i]] = checkCycle((object as anyObject)[keys[i]], path + "[" + JSON.stringify(keys[i]) + "]");
                else{
                    const toStringed = lUtils.misc.compatibleToString(object);
                    if(toStringed != "[object Object]") return object;
                    //else return newObj;
                }
                return newObj;
            }
        }
        else return object;
    }(object, "$"));
};
/*export function retrocycle($: any){
// Restore an object that was reduced by decycle. Members whose values are
// objects of the form
//      {$ref: PATH}
// are replaced with references to the value found by the PATH. This will
// restore cycles. The object will be mutated.

// The eval function is used to locate the values described by a PATH. The
// root object is kept in a $ variable. A regular expression is used to
// assure that the PATH is extremely well formed. The regexp contains nested
// * quantifiers. That has been known to have extremely bad performance
// problems on some browsers for very long strings. A PATH is expected to be
// reasonably short. A PATH is allowed to belong to a very restricted subset of
// Goessner's JSONPath.

// So,
//      var s = '[{"$ref":"$"}]';
//      return JSON.retrocycle(JSON.parse(s));
// produces an array containing a single element which is the array itself.
    const px = /^\$(?:\[(?:\d+|"(?:[^\\"\u0000-\u001f]|\\(?:[\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*")\])*$/;
    (function rez(value){
// The rez function walks recursively through the object looking for $ref
// properties. When it finds one that has a value that is a path, then it
// replaces the $ref object with a reference to the value that is found by
// the path.
        if(value && typeof value === "object"){
            if(Array.isArray(value)){
                value.forEach((element, i)=>{
                    if(typeof element === "object" && element !== null){
                        const path = element.$ref;
                        if(typeof path === "string" && px.test(path)) value[i] = eval(path);
                        else rez(element);
                    }
                });
            }
            else{
                Object.keys(value).forEach(key=>{
                    const item = value[key];
                    if(typeof item === "object" && item !== null){
                        const path = item.$ref;
                        if(typeof path === "string" && px.test(path)) value[key] = eval(path);
                        else rez(item);
                    }
                });
            }
        }
    })($);
    return $;
};*/