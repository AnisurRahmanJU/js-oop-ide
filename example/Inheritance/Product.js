// parent class Product.js
class Product {
    constructor(id, price) {
        this.id = id;
        this.price = price;
    }
    getBasePrice() { return `Product ${this.id} original price: $${this.price}.`; }
}

// child class DiscountedProduct.js
class DiscountedProduct extends Product {
    constructor(id, price, discountPercentage) {
        super(id, price);
        this.discountPercentage = discountPercentage;
    }
    getFinalPrice() { return this.price * (1 - this.discountPercentage / 100); }
    displayDetails() {
        console.log(`[Pricing Analysis Mode]`);
        return this.getBasePrice() + ` Sale price is $${this.getFinalPrice().toFixed(2)}.`;
    }
}

// Main.js
console.log("--- Executing Product OOP Flow ---");
const item = new DiscountedProduct("PROD-99", 120, 20);
console.log(item.displayDetails());
