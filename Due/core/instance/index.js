import init from './init.js';
import { initMount } from './mount.js';
import render from './render.js';

class Due {
    constructor(options) {
        this._init(options);
        this._render();
    }
}

init(Due);
initMount(Due);
render.render(Due);

export default Due;