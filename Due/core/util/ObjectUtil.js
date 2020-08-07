export function getValue(obj, name) {
    if (!obj) {
        return obj;
    }
    let nameList = name.trim().split('.');
    let value = obj;
    for (const item of nameList) {
        if (item) {
            value = value[item]; // 层层递进
        } else {
            return undefined;
        }
    }
    return value;
}