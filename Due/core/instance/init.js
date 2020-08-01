let uid = 0;

export default Due => {
    Due.prototype.init = function (options) {
        this.uid = uid ++; // uid属性保证Due实例唯一
        this._isDue = true; // 是否是Due实例

        // 初始化data
        // 初始化created
        // 初始化methods
        // 初始化computed
        // 初始化el并挂载
    }
}