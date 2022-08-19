export default class App {
    #private;
    constructor(rootNode: Elementy);
    get rootNode(): Element;
    get data(): anyObject;
    get _(): anyObject;
    addExport(dataProperty: string, func: exportFunc): shouldExportA;
    removeExport(dataProperty: string, func: string | exportFunc): shouldExportA;
    addMethods(): void;
    removeMethods(): void;
    parseHTML(node: Node): void;
}
//# sourceMappingURL=main.d.ts.map