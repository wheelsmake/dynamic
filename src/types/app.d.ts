/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
type functionObject = Record<string, Function>;
type Elementy = Element | string;
type dataObject = Record<string, data>;
type MRProcessorFn = (record :MutationRecord)=>void;