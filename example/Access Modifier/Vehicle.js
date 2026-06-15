class Shape {
    constructor(name, color) {
        this.name = name;
        this.color = color;
    }

    describe() {
        return `This is a ${this.color} ${this.name}.`;
    }
}

class Rectangle extends Shape {
    #width;
    #height;

    constructor(color, width, height) {
        super("Rectangle", color);
        this.#width = width;
        this.#height = height;
    }

    get width() {
        return this.#width;
    }

    getArea() {
        return this.#width * this.#height;
    }

    displayDetails() {
        console.log(`Shape Analysis Mode:`);
        return this.describe() + ` It has an area of ` + this.getArea() + ` square units.`;
    }
}

console.log("Executing Shape & Rectangle OOP Flow: ");

const myBox = new Rectangle("Neon Blue", 10, 5);
console.log(myBox.displayDetails());

console.log("\nTesting Direct Instance Property State:");
console.log("Width of Rectangle:", myBox.width);
console.log("Color of Shape:", myBox.color);
