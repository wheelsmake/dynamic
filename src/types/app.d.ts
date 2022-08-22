/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
type functionObject = Record<string, Function>;
type Elementy = Element | string;
type dataObject = Record<string, data>;

type exportFunc = (oldValue? :any)=>void;
type shouldExportA = exportFunc[];
type shouldUpdateA = string[];
interface data{
    value :any;
    cache? :any;
    deleted :boolean;
    shouldUpdates :shouldUpdateA;
    shouldExports :shouldExportA;
}