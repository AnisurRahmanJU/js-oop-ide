// parent class Course.js
class Course {
    constructor(title, baseDurationWeeks) {
        this.title = title;
        this.baseDurationWeeks = baseDurationWeeks;
    }
    getSummary() { return `Course "${this.title}" spans ${this.baseDurationWeeks} weeks.`; }
}

// child class Bootcamp.js
class Bootcamp extends Course {
    constructor(title, baseDurationWeeks, weeklyHours) {
        super(title, baseDurationWeeks);
        this.weeklyHours = weeklyHours;
    }
    getTotalHours() { return this.baseDurationWeeks * this.weeklyHours; }
    displayDetails() {
        console.log(`[Curriculum Analysis Mode]`);
        return this.getSummary() + ` This intensive bootcamp track requires ${this.getTotalHours()} total hours.`;
    }
}

// Main.js
console.log("--- Executing Course OOP Flow ---");
const webDev = new Bootcamp("Full-Stack JavaScript", 12, 40);
console.log(webDev.displayDetails());
