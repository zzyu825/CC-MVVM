export default class VNode {
    // tag 标签类型 ele 对应的真实节点 children 当前节点下所有的子节点 text当前节点中的文本
    // parent 父级节点 nodeType 节点类型
    constructor(tag, ele, children, text, data, parent, nodeType) {
        this.tag = tag;
        this.ele = ele;
        this.children = children;
        this.text = text;
        this.data = data;
        this.parent = parent;
        this.nodeType = nodeType;
        this.env = {}; // 当前节点的环境变量
        this.instructions = null; // 存放指令的
        this.template = []; // 存放模板的
    }
}