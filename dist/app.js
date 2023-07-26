"use strict";
// Project State Management:
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
class ProjectState {
    constructor() {
        this.projects = [];
        this.listeners = [];
    }
    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }
    addProject(title, description, numOfPeople) {
        const newProject = {
            id: Math.random().toString(),
            title: title,
            description: description,
            people: numOfPeople
        };
        this.projects.push(newProject);
        for (const fn of this.listeners) {
            fn(this.projects.slice());
        }
    }
    addListener(fn) {
        this.listeners.push(fn);
    }
}
// Project State Instance:
const projectState = ProjectState.getInstance();
// Decorator for autobind:
function autobindDecorator(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedDescriptor;
}
// Function for input checking objects:
function isValid(validatableInput) {
    let thisIsValid = true;
    if (validatableInput.required) {
        thisIsValid = thisIsValid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        thisIsValid = thisIsValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        thisIsValid = thisIsValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if (validatableInput.min != null && typeof validatableInput.value === 'number') {
        thisIsValid = thisIsValid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null && typeof validatableInput.value === 'number') {
        thisIsValid = thisIsValid && validatableInput.value <= validatableInput.max;
    }
    return thisIsValid;
}
// Input Class:
class Input {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = 'user-input';
        this.attach();
        this.titleInput = this.element.querySelector('#title');
        this.descriptionInput = this.element.querySelector('#description');
        this.peopleInput = this.element.querySelector('#people');
        this.listen();
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
    listen() {
        this.element.addEventListener('submit', this.submitForm);
    }
    gatherUserInput() {
        const enteredTitle = this.titleInput.value;
        const enteredDescription = this.descriptionInput.value;
        const enteredPeople = this.peopleInput.value;
        const titleObject = {
            value: enteredTitle,
            required: true,
            minLength: 2,
            maxLength: 20
        };
        const descriptionObject = {
            value: enteredDescription,
            required: true,
            minLength: 5,
            maxLength: 50
        };
        const peopleObject = {
            value: +enteredPeople,
            required: true,
            min: 1,
            max: 9
        };
        if (!isValid(titleObject) ||
            !isValid(descriptionObject) ||
            !isValid(peopleObject)) {
            alert('Invalid input. Please try again.');
            return undefined;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInput.value = '';
        this.descriptionInput.value = '';
        this.peopleInput.value = '';
    }
    submitForm(e) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if (Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            this.clearInputs();
            projectState.addProject(title, description, people);
        }
        else {
            return;
        }
    }
}
__decorate([
    autobindDecorator
], Input.prototype, "submitForm", null);
// Project List Class:
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
        this.element.id = `${this.type}-projects`;
        projectState.addListener((projects) => {
            this.assignedProjects = projects;
            this.renderProjects(this.assignedProjects);
        });
        this.attach();
        this.renderContent();
    }
    attach() {
        this.hostElement.insertAdjacentElement('beforeend', this.element);
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    renderProjects(projectList) {
        this.list = this.element.querySelector('ul');
        projectList.forEach(projectObj => {
            this.list.insertAdjacentElement('beforeend', projectObj.title);
        });
    }
}
// Input instance
const inputInstance = new Input;
// Project list instance 1
const activeProjectListInstance = new ProjectList('active');
// Project list instance 2
const finishedProjectListInstance = new ProjectList('finished');
