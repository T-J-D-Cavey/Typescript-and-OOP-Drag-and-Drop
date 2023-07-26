// Project type:
enum ProjectStatus {
    Active, Finished
}

class Project {
    constructor(
        public id: string, 
        public title: string, 
        public description: string, 
        public people: number,
        public status: ProjectStatus
        ) {
    }
}
// Listener Function Type: 
type Listener<T> = (items: T[]) => void;

// State class:
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(fn: Listener<T>) {
        this.listeners.push(fn);
    }
}


// Project State Class:
class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        } else {
            this.instance = new ProjectState();
            return this.instance;
        }
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title, 
            description, 
            numOfPeople,
            ProjectStatus.Active)
        this.projects.push(newProject);
        for(const fn of this.listeners) {
            fn(this.projects.slice());
        }
    }
}

// Project State Instance:
const projectState = ProjectState.getInstance();
 
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

// Component Base Class:
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;

    constructor(
        templateId: string, 
        hostElementId: string,
        insertAtStart: boolean, 
        newElementId?: string) {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild as U;
        if(newElementId) {
            this.element.id = newElementId;
        }
        
        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        this.hostElement.insertAdjacentElement(insertAtStart === true ? 'afterbegin' : 'beforeend', this.element);
    }
    abstract renderContent(): void;
    abstract configure(): void;
}

// Project Item Class:
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>{
    private project: Project;
    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;
        this.configure();
        this.renderContent();
    }

    configure() {}
    renderContent() {
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.project.people.toString();
        this.element.querySelector('p')!.textContent = this.project.description;
    }


}

// Project List Class:
class ProjectList extends Component<HTMLElement, HTMLElement> {
    assignedProjects: any[];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `${type}-projects`)
        this.assignedProjects = [];
        this.configure();
        this.renderContent();
    }

    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listEl.innerHTML = '';
        for(const prjItem of this.assignedProjects) {
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }

    configure() {
        projectState.addListener((projects: Project[]) => {
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active') {
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            })
            this.assignedProjects = relevantProjects;
            this.renderProjects();
        });
    }
}

// Input Class:
class Input extends Component<HTMLElement, HTMLFormElement> {
    titleInput: HTMLInputElement;
    descriptionInput: HTMLInputElement;
    peopleInput: HTMLInputElement;

    constructor() {
        super('project-input', 'app', true, 'user-input')
        this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInput = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInput = this.element.querySelector('#people')! as HTMLInputElement;
        this.configure()

    }

    renderContent() {}

    configure() {
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
        if(
            !isValid(titleObject) ||
            !isValid(descriptionObject) ||
            !isValid(peopleObject)
        ) {
            alert('Invalid input. Please try again.')
            return undefined;
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
    private submitForm(e: Event) {
        e.preventDefault();
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            this.clearInputs();
            projectState.addProject(title, description, people);
        } else {
            return;
        }
    }
}


// Input instance
const inputInstance = new Input;
// Project list instance 1
const activeProjectListInstance = new ProjectList('active');
// Project list instance 2
const finishedProjectListInstance = new ProjectList('finished');





