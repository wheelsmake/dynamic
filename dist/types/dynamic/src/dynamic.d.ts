declare class App {
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
import * as template from "./template";
import * as spa from "./spa";
import * as manifest from "./manifest";
declare const Dynamic: {
    new(rootNode: Elementy): App;
    template: typeof template;
    spa: typeof spa;
    manifest: typeof manifest;
    e(s: string, scope?: Element | Document): Node | Node[];
    render(args: {
        HTML: string | Element | HTMLCollection | Element[] | Node | NodeList | Node[];
        element: Element;
        insertAfter?: boolean;
        append?: boolean;
    }): Node[];
    toHTML(HTML: string): Node[];
    hatch(element: Element, remove?: boolean): Node[];
    compose(): void;
    __disableDevTools__(): void;
    __enableDevTools__(): void;
};
export default Dynamic;
//# sourceMappingURL=dynamic.d.ts.map