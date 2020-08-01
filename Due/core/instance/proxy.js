// 通过代理的方式实现监听属性修改
function constructObjectProxy(vm, target, namespace) {
    let proxyObj = {}; // 观察者
    for (const prop in target) {
        // 代理给_data属性
        Object.defineProperty(proxyObj, prop, {
            configurable: true,
            get() {
                return target[prop];
            },
            set(val) {
                console.log(getNamespace(namespace, prop));
                target[prop] = val;
            }
        });
        // 代理给Due实例自身
        Object.defineProperty(vm, prop, {
            configurable: true,
            get() {
                return target[prop];
            },
            set(val) {
                console.log(getNamespace(namespace, prop));
                target[prop] = val;
            }
        });
        // 嵌套代理
        if (target[prop] instanceof Object) {
            proxyObj[prop] = constructProxy(vm, target[prop], getNamespace(namespace, prop));
        }
    }
    return proxyObj;
}

// 代理数组本身
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: 'Array',
        toString() {
            let result = '';
            for (const item of arr) {
                result += `${item}, `;
            }
            return result.substring(0, arr.length - 2);
        },
        push() {},
        unshift() {},
        pop() {},
        shift() {}
    };
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);

    arr.__proto__ = obj;
    return arr;
}

// 监听数组变异方法调用
function defArrayFunc(obj, type, namespace, vm) {
    const arrProto = Array.prototype;
    Object.defineProperty(obj, type, {
        enumerable: true,
        configurable: true,
        value(...args) {
            const result = arrProto[type].apply(this, args);
            console.log(getNamespace(namespace, ''))
            return result;
        }
    });
}

/**
 * 获取命名空间
 * @param {*} nowNamespace
 * @param {*} prop
 */
function getNamespace(nowNamespace, prop) {
    if (nowNamespace === null || nowNamespace === '') {
        return prop;
    } else if (prop === null || prop === '') {
        return nowNamespace;
    } else {
        return `${nowNamespace}.${prop}`;
    }
}


/**
 * 代理
 * @export
 * @param {*} vm Due实例
 * @param {*} target 要代理的目标
 * @param {*} namespace 命名空间
 */
export default function constructProxy(vm, target, namespace) {
    // 递归
    let proxy = null;
    if (target instanceof Array) { // 判断目标是否为数组
        proxy = new Array(target.length);
        // 每一个子元素代理
        target.forEach((ele, i) => {
            proxy[i] = constructProxy(vm, ele, namespace); 
        });
        // 数组本身代理
        proxy = proxyArr(vm, target, namespace);
    } else if (target instanceof Object) { // 判断目标是否为对象
        proxy = constructObjectProxy(vm, target, namespace)
    } else {
        throw new Error('error');
    }
    return proxy;
}