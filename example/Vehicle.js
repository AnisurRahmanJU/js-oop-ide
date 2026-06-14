// parent class is Vehicle.js
class Vehicle {
    constructor(make, model) {
        this.make = make;
        this.model = model;
    }
    getInfo() { return `This is a ${this.make} ${this.model}.`; }
}

// child class is ElectricCar.js
class ElectricCar extends Vehicle {
    constructor(make, model, batteryCapacity) {
        super(make, model);
        this.batteryCapacity = batteryCapacity;
    }
    getRange() { return this.batteryCapacity * 5; }
    displayDetails() {
        console.log(`[Vehicle Analysis Mode]`);
        return this.getInfo() + ` It has an estimated range of ${this.getRange()} km.`;
    }
}

// Main.js
console.log("--- Executing Vehicle OOP Flow ---");
const myCar = new ElectricCar("Tesla", "Model 3", 75);
console.log(myCar.displayDetails());

