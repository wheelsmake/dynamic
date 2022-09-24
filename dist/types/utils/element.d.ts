export declare function e(s: string, scope?: Element | Document): Node[] | Node;
export declare function isDescendant(possibleDescendant: Node, possibleParent: Node): boolean;
export declare function isInDocument(node: Node): boolean;
export declare function isChild(node: Node, target: Element): boolean;
export declare function toHTML(HTML: string): Node[];
export declare function getInnerNodesClone(el: Node): Node[];
export declare function hatch(element: Element, remove?: boolean): Node[];
export declare function render(HTML: string | Element | HTMLCollection | Element[] | Node | NodeList | Node[], element: Element, insertAfter?: boolean, append?: boolean): Node[];
export declare function processNLIText(textNode: Text): string | null;
//# sourceMappingURL=element.d.ts.map