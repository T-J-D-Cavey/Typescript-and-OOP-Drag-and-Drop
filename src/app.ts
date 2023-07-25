// Decorator for autobind:
function autobindDecorator(_: any, _2: any, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn
        }
    }
    return adjustedDescriptor;
}

// Input Class:
class Input {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLElement;
    element: HTMLFormElement;
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.hostElement = document.getElementById('app')! as HTMLElement;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as HTMLFormElement;
        this.element.id = 'user-input'
        this.render();
        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.element.querySelector('#people')! as HTMLInputElement;
        this.listen();

    }

    private render() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }

    private listen() {
        this.element.addEventListener('submit', this.submitForm)
    }

    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;
        if(enteredTitle.trim().length === 0) {
            alert('Title field must have an input');
            return;
        }
        else if(enteredDescription.trim().length === 0) {
            alert('Description field must have an input');
            return;
        }
        else if(enteredPeople.trim().length === 0) {
            alert('People field must have an input');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
        }
    }

    @autobindDecorator
    submitForm(e: Event) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
        }
    }
}


const test = new Input;








