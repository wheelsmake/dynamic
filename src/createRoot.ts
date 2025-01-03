﻿/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
import * as utils from "../../utils/index";
import * as lUtils from "./utils/index";
import {render} from "./render";

export function createRoot(el_ :Elementy){
    const el = utils.arguments.reduceToElement(el_)!;
    return{
        render
    };
}