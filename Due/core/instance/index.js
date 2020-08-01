import _init from './init.js';
import {initMount} from './mount.js';

class Due {
    constructor(options) {
        this.init(options);
    }
}

_init(Due);
initMount(Due);

export default Due;