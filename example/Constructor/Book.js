class Audiobook {
    // Parameterized: Requires arguments to be passed
    constructor(title, author, durationMinutes) {
        this.title = title;
        this.author = author;
        this.durationMinutes = durationMinutes;
    }

    getBio() { 
        return `"${this.title}" was written by ${this.author}.`; 
    }

    getDurationHours() { 
        return (this.durationMinutes / 60).toFixed(1); 
    }

    displayDetails() {
        console.log(`[Media Analysis Mode]`);
        return `${this.getBio()} The audiobook format lasts ${this.getDurationHours()} hours.`;
    }
}

console.log("--- Executing Book OOP Flow ---");
const audio = new Audiobook("The Hobbit", "J.R.R. Tolkien", 660); // Arguments passed
console.log(audio.displayDetails());
