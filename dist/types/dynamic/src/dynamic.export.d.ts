import App from "./app";
import * as template from "./template";
import * as spa from "./spa";
import * as manifest from "./manifest";
declare function __disableDevTools__(): void;
declare function __enableDevTools__(): void;
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
    __disableDevTools__: typeof __disableDevTools__;
    __enableDevTools__: typeof __enableDevTools__;
};
export default Dynamic;
//# sourceMappingURL=dynamic.export.d.ts.map