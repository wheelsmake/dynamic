declare class App {
    #private;
    constructor(rootNode: Elementy);
    get rootNode(): Element;
    get data(): anyObject;
}
declare const Dynamic: {
    new(rootNode: Elementy): App;
    SPA: {};
    SW: {};
};
export default Dynamic;
//# sourceMappingURL=dynamic.d.ts.map