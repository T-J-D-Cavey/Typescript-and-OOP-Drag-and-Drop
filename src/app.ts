
// function decoratorFactory () {
//     return function decorator(target: any, descriptor: any) {
//         // const firstTemplate = new Input('project-input');
//         console.log('target: ', target);
//         console.log('descriptor: ', descriptor)

//     }
// }

// @decoratorFactory()
class Input {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLElement;
    element: HTMLFormElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.render();
    }

    render() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}


const test = new Input;







