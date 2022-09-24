export * as misc from "./vdom.misc";
export * as get from "./vdom.get";
export * as build from "./vdom.build";
export * as diff from "./vdom.diff";
export declare function createVElement(id: string, tagName: string, attrs: SSkvObject | null, events: eventRecord | null, children: childrenArray, instance: Element | null): vElement;
export declare function createVText(id: string, text: string, instance: Text | null): vText | void;
export declare function parseNode(node: Node): vDOM | void;
export declare function buildNode(vDOM: vDOM): instance;
//# sourceMappingURL=vdom.d.ts.map