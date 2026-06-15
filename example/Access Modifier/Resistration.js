class Student {
    // Private data
    #id;
    #name;

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    // Public method to safely expose info
    getProfile() {
        return `Student: ${this.#name} (ID: ${this.#id})`;
    }
}

class Course {
    // Private data
    #courseCode;
    #capacity;
    #enrolled = [];

    constructor(courseCode, capacity) {
        this.#courseCode = courseCode;
        this.#capacity = capacity;
    }

    // Public method: Encapsulated logic for registration
    register(student) {
        if (this.#enrolled.length < this.#capacity) {
            this.#enrolled.push(student);
            return `${student.getProfile()} successfully registered for ${this.#courseCode}.`;
        } else {
            return `Registration failed: ${this.#courseCode} is full.`;
        }
    }
}

// Execution
const student1 = new Student("S101", "Alice");
const cs101 = new Course("CS101", 30);

console.log(cs101.register(student1));
