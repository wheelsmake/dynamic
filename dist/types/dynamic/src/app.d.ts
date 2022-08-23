export default class App {
    #private;
    constructor(rootNode: Elementy);
    get rootNode(): Element;
    get data(): anyObject;
    get _(): anyObject;
    get __DEV_data__(): dataObject;
    addExport(dataProperty: string, func: exportFunc, target: Node): shouldExportA;
    removeExport(dataProperty: string, func: string | exportFunc): shouldExportA;
    addMethods(): void;
    removeMethods(): void;
    hydrate(node: Node): void;
}
//# sourceMappingURL=app.d.ts.map