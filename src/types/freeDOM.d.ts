/* freeDOM
 * ©2022 LJM12914. https://github.com/wheelsmake/freeDOM
 * Licensed under MIT License. https://github.com/wheelsmake/freeDOM/blob/main/LICENSE
*/

/*通用缩写类型*/
type anyObject = Record<string, any>;
type kvObject = Record<string, string | undefined | null>;
type SSkvObject = Record<string, string>;

/*缩写类型*/
type Elementy = Element | string;
type instance = Element | Text;
type vDOM = vElement | vText;
type childrenArray = (vText | vElement)[];

/*参数类型*/
interface fdOptions{

}

/*定义类型*/
type searchStore = [string[], instance[], vDOM[]];
type searchBlock = [string, instance, vDOM];
interface eventRecordInstance{
    handler: Function,
    arg1: boolean | AddEventListenerOptions | undefined,
    arg2: boolean | undefined
};
type eventRecord = Record<string, eventRecordInstance[]>;
type eventStore = Map<Element, eventRecord>;
interface vElement{
    id :string;
    instance :Element | null;
    tagName :string;
    attrs :SSkvObject | null;
    events :eventRecord | null;
    children :childrenArray;
}
interface vText{
    id :string;
    instance :Text | null;
    text :string;
    //events :eventRecord | null; //Text注册的事件只能通过程序触发，用户无法触发，故不检测
}