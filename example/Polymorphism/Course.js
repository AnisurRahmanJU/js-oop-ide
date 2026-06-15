// Method Overloading Polymorphism
class Course {
    constructor(title, baseDurationWeeks) {
        this.title = title;
        this.baseDurationWeeks = baseDurationWeeks;
    }

    // This method simulates overloading based on the number of arguments
    displayDetails(...args) {
        if (args.length === 0) {
            // Case 1: No arguments - return basic summary
            return `Course "${this.title}" spans ${this.baseDurationWeeks} weeks.`;
        } 
        else if (args.length === 1) {
            // Case 2: One argument (weeklyHours) - return total hours
            const weeklyHours = args[0];
            const total = this.baseDurationWeeks * weeklyHours;
            return `Course "${this.title}" requires ${total} total hours.`;
        } 
        else {
            return "Invalid number of arguments.";
        }
    }
}

// Executing with different signatures
const webDev = new Course("Full-Stack JavaScript", 12);

console.log("--- Executing Course OOP Flow ---");
// Signature 1: No arguments
console.log(webDev.displayDetails()); 

// Signature 2: One argument
console.log(webDev.displayDetails(40));
