import constructProxy from './proxy.js';
import mount from './mount.js';

let uid = 0;

/**
 * 初始化
 * @export
 * @param {*} Due 实例
 */
export default function init(Due) {
    Due.prototype._init = function (options) {
        this.uid = uid ++; // uid属性保证Due实例唯一
        this._isDue = true; // 是否是Due实例

        // 初始化data
        if (options && options.data) {
            this._data = constructProxy(this, options.data, '');
        }
        // 初始化created
        // 初始化methods
        // 初始化computed
        // 初始化el并挂载
        if (options && options.el) {
            const rootDom = document.getElementById(options.el);
            mount(this, rootDom);
        }
    }
}