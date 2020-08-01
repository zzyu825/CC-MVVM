import VNode from "../vdom/vnode.js";

// 挂载函数
export default function mount(vm, el) {
    // 进行挂载
    vm._vnode = constructVNode(vm, el, null);
    // 进行预备渲染
}

// $mount实现
export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        const rootDom = document.getElementById(el);
        mount(this, rootDom);
    }
}

// 得到虚拟节点
function constructVNode(vm, el, parent) {
    // 深度优先搜索
    let vnode;
    const tag = el.nodeName;
    let children = [];
    const text = getNodeText(el);
    let data = null;
    const nodeType = el.nodeType;

    vnode = new VNode(tag, el, children, text, data, parent, nodeType);

    for (const item of el.childNodes) {
        let childNodes = constructVNode(vm, item, vnode)
        if (childNodes instanceof VNode) {
            vnode.children.push(childNodes)
        } else { // 返回节点数组
            vnode.children = vnode.children.concat(childNodes);
        }
    }
    
    return vnode;
}

// 得到当前节点中的文本
function getNodeText(el) {
    if (el.nodeType === 3) {
        return el.nodeValue;     
    } else {
        return "";
    }
}

