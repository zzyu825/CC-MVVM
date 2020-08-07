import { getValue } from '../util/ObjectUtil.js';

// 通过模板，找到哪些节点用到了这个模板
let template2Vnode = new Map();
// 通过节点，找到该节点下有哪些模板
let vnode2Template = new Map();

// 渲染
function render(Due) {
    Due.prototype._render = function() {
        renderNode(this, this._vnode);
    }
}

// 数据修改后渲染视图
function renderData(vm, namespace) {
    // console.log(namespace);
    const vnodes = template2Vnode.get(namespace);
    if (vnodes != null) {
        for (const item of vnodes) {
            renderNode(vm, item);  
        }
    }
}

// 渲染节点
function renderNode(vm, vnode) {
    if (vnode.nodeType === 3) {
        let templates = vnode2Template.get(vnode);
        if (templates) {
            let result = vnode.text;
            for (const item of templates) {
                const templateValue = getTemplateValue([vm._data, vnode.env], item);
                if (templateValue) {
                    result = result.replace(`{{ ${item} }}`, templateValue);
                }
            }
            vnode.ele.nodeValue = result;
        }
    } else {
        for (const item of vnode.children) {
            renderNode(vm, item);
        }
    }
}

// 得到模板数据
function getTemplateValue(objs, templateName) {
    for (const item of objs) {
        let value = getValue(item, templateName);
        if (value !== null) {
            return value;
        }
    }
    return null;
}

/**
 * 预备渲染
 * @param {*} vm
 * @param {*} vnode 根节点
 * @returns
 */
function prepareRender(vm, vnode) {
    if (vnode === null) return;
    if (vnode.nodeType === 3) { // 文本节点
        analysisTemplateString(vnode);
    }
    if (vnode.nodeType === 1) { // 标签
        for (const item of vnode.children) {
            prepareRender(vm, item);
        }
    }
}

// 分析模板字符串
function analysisTemplateString(vnode) {
    let templateStrList = vnode.text.match(/{{[\sa-zA-Z0-9_.]+}}/g);
    if (templateStrList) {
        for (const item of templateStrList) {
            setTemplate2Vnode(item, vnode);
            setVnode2Template(item, vnode);
        }
    }
}

// 设置映射关系
function setTemplate2Vnode(template, vnode) {
    let vnodeSet = template2Vnode.get(getTemplateName(template));
    if (vnodeSet) {
        vnodeSet.push(vnode);
    } else {
        template2Vnode.set(getTemplateName(template), [vnode]);
    }
}

function setVnode2Template(template, vnode) {
    let templateSet = vnode2Template.get(vnode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vnode2Template.set(vnode, [getTemplateName(template)]);
    }
}

// 去掉模板字符串{{}}
function getTemplateName(template) {
    if (template.substring(0, 2) === "{{" && template.substring(template.length - 2, template.length) === "}}") {
        return template.substring(2, template.length - 2).trim();
    } else {
        return template;
    }
}

export default {
    prepareRender,
    template2Vnode,
    vnode2Template,
    render,
    renderData
}