"use strict";
// function decoratorFactory () {
//     return function decorator(target: any, descriptor: any) {
//         // const firstTemplate = new Input('project-input');
//         console.log('target: ', target);
//         console.log('descriptor: ', descriptor)
//     }
// }
// @decoratorFactory()
class Input {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.render();
    }
    render() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
const test = new Input;
