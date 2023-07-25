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

// Interface for input checking objects:
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number,
    max?: number;
}

// Function for input checking objects:

function isValid(validatableInput: Validatable) {
    let thisIsValid = true;

    if(validatableInput.required) {
        thisIsValid = thisIsValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        thisIsValid = thisIsValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        thisIsValid = thisIsValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number') {
        thisIsValid = thisIsValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number') {
        thisIsValid = thisIsValid && validatableInput.value <= validatableInput.max;
    }
    return thisIsValid;
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

        const titleObject: Validatable = {
            value: enteredTitle,
            required: true,
            minLength: 2,
            maxLength: 20
        }
        const descriptionObject: Validatable = {
            value: enteredDescription,
            required: true,
            minLength: 5,
            maxLength: 50
        }
        const peopleObject: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 9
        }
        if(!isValid(titleObject) ||
        !isValid(descriptionObject) ||
        !isValid(peopleObject)) {
            alert('Invalid input. Please try again.');
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople]
    }
    }

    private clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }

    @autobindDecorator     
    submitForm(e: Event) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        } else {
            return;
            // this code was added to try and fix an error and needs updating.
        }
    }
}


const test = new Input;








