export default class App {
    #private;
    constructor(rootNode: Elementy);
    get rootNode(): Element;
    get data(): anyObject;
    get _(): anyObject;
    addExport(dataProperty: string, func: exportFunc, target: Node): shouldExportA;
    removeExport(dataProperty: string, func: string | exportFunc): shouldExportA;
    getExports(dataProperty: string): shouldExportA;
    get methods(): functionObject;
    get $(): functionObject;
    hydrate(node: Nody): void;
}
//# sourceMappingURL=app.d.ts.map