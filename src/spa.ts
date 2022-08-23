/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";
export function getSearch() :SSkvObject | null{
    var s = location.search;
    if(s != ""){
        s = s.substring(1);
        const result :SSkvObject = {};
        s.split("&").forEach(value=>{
            const sp = value.split("=");
            result[sp[0]] = sp[1];
        });
        return result;
    }
    else return null;
}
export function getHash() :string{
    return location.hash.substring(1);
}