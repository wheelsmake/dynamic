/* dynamic
 * ©2022 LJM12914. https://github.com/wheelsmake/dynamic
 * Licensed under MIT License. https://github.com/wheelsmake/dynamic/blob/main/LICENSE
*/
type anyObject = Record<string, any>;
type kvObject = Record<string, string | undefined | null>;
type SSkvObject = Record<string, string>;
type Elementy = Element | string;
type Nody = Node | string;
interface Dynamic{
    (rootNode_ :Elementy, options_? :anyObject) :anyObject;
    template :typeof import("../template");
    spa :typeof import("../spa");
    manifest :typeof import("../manifest");
    e(s :string, scope? :Element | Document) :Node | Node[];
    render(args :{
        HTML :string | Element | HTMLCollection | Element[] | Node | NodeList | Node[];
        element :Element;
        insertAfter? :boolean;
        append? :boolean;
    }) :Node[];
    toHTML(HTML :string) :Node[];
    hatch(element :Element, remove? :boolean) :Node[];
    compose() :void;
}