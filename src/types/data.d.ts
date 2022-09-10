/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
type exportFunc =
    ((this :anyObject)=>void)
  | ((this :anyObject, exportInstance :exportInstance)=>void)
  | ((this :anyObject, exportInstance :exportInstance, oldValue :any)=>void);
type exportInstance = [exportFunc, Node | undefined, boolean];
type shouldExportA = exportInstance[];
type shouldUpdateA = string[];
interface data<T>{
    value :T | undefined | null;
    cache? :T | undefined | null;
    //deleted :boolean;
    shouldUpdates :shouldUpdateA;
    shouldExports :shouldExportA;
}