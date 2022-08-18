declare class App {
    #private;
    constructor(rootNode: Elementy);
    get rootNode(): Element;
    get data(): dataObject;
    get _(): dataObject;
    get __privateData__(): dataObject | "BLOCKED IN NON-DEV MODE";
    addExport(dataProperty: string, func: exportFunc): shouldExportA;
    removeExport(dataProperty: string, func: string | exportFunc): shouldExportA;
}
import * as spa from "./spa";
import * as manifest from "./manifest";
declare const Dynamic: {
    new(rootNode: Elementy): App;
    spa: typeof spa;
    manifest: typeof manifest;
    e(s: string, scope?: Element | Document): Node | Node[];
    debugger(): number;
};
export default Dynamic;
//# sourceMappingURL=dynamic.d.ts.map