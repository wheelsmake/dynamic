declare const instances: ScopeInstance[], eventStore: eventStore;
export { instances, eventStore };
declare class ScopeInstance {
    #private;
    constructor(rootNode: Elementy, options?: fdOptions);
    get rootNode(): Element;
    get options(): fdOptions | undefined;
    get vDOM(): vElement | undefined;
    m(location: string | vElement, index: number | string, subTree: vDOM): void;
    mount(location: string | vElement, index: number | string, subTree: vDOM): void;
    u(): void;
    unmount(): void;
    s(): void;
    sync(): void;
    r(): void;
    rsync(): void;
}
declare const FreeDOM: {
    new(rootNode: Elementy, options?: fdOptions): ScopeInstance;
    readonly instances: ScopeInstance[];
    readonly eventStore: Map<Element, eventRecord>;
    c(tagName: string, attrs?: SSkvObject | null, children?: childrenArray): vElement;
    createVElement(tagName: string, attrs?: SSkvObject | null, children?: childrenArray): vElement;
    h(tagName: string, attrs?: SSkvObject | null, children?: childrenArray): vElement;
    t(text: string): vText | null;
    createVText(text: string): vText | null;
    p(node: Node): vDOM | null;
    parseNode(node: Node): vDOM | null;
    b(vElement: vDOM): instance;
    buildNode(vElement: vDOM): instance;
    d(): void;
    diff(): void;
    e(s: string, scope?: Element | Document): Node | Node[];
};
export default FreeDOM;
//# sourceMappingURL=freedom.d.ts.map