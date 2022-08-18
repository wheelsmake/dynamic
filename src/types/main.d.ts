/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
type anyObject = Record<string, any>;
type kvObject = Record<string, string | undefined | null>;
type SSkvObject = Record<string, string>;
type functionObject = Record<string, Function>;

type Elementy = Element | string;

type dataObject = Record<string, data>;

type exportFunc = (oldValue? :any)=>void;
type shouldExportA = exportFunc[];
type shouldUpdateA = string[];
//type exportTargetA = (Node | undefined)[];
interface data{
    value :any;
    cache? :any;
    deleted :boolean;
    shouldUpdates :shouldUpdateA;
    shouldExports :shouldExportA;
    //exportTarget :exportTargetA;
}