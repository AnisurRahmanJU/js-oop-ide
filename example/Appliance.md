```js
// parent class  Appliance.js
class Appliance {
    constructor(brand, powerRating) {
        this.brand = brand;
        this.powerRating = powerRating; // in watts
    }
    getSpecs() { return `This ${this.brand} appliance uses ${this.powerRating}W.`; }
}

// child class Refrigerator.js
class Refrigerator extends Appliance {
    constructor(brand, powerRating, capacity) {
        super(brand, powerRating);
        this.capacity = capacity; // in liters
    }
    calculateDailyUsage() { return (this.powerRating * 24) / 1000; }
    displayDetails() {
        console.log(`[Appliance Analysis Mode]`);
        return this.getSpecs() + ` It consumes approx ${this.calculateDailyUsage()} kWh per day.`;
    }
}

// Main.js
console.log("--- Executing Appliance OOP Flow ---");
const fridge = new Refrigerator("Samsung", 150, 400);
console.log(fridge.displayDetails());



```
