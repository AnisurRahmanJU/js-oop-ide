// method overriding Polymorphism
class Employee {
    constructor(name, salary) {
        this.name = name;
        this.salary = salary;
    }
    getPayDetails() { return `${this.name} earns a base salary of $${this.salary}.`; }
}

// child class Manager.js
class Manager extends Employee {
    constructor(name, salary, bonus) {
        super(name, salary);
        this.bonus = bonus;
    }
    getTotalCompensation() { return this.salary + this.bonus; }
    displayDetails() {
        console.log(`[Corporate Analysis Mode]`);
        return this.getPayDetails() + ` Total compensation package is $${this.getTotalCompensation()}.`;
    }
}

// Main.js
console.log("--- Executing Employee OOP Flow ---");
const manager = new Manager("Alice Smith", 95000, 15000);
console.log(manager.displayDetails());

