/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../../utils/index";
import * as localUtils from "../utils/index";
export function eliminateSymbol(property :string | Symbol) :string{
    if(typeof property == "symbol") utils.generic.E(property.toString(), "string", property,  "index of Dynamic.data must not be a Symbol");
    return property as string;
}