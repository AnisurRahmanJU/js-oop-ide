// parent class Subscription.js
class Subscription {
    constructor(planName, monthlyCost) {
        this.planName = planName;
        this.monthlyCost = monthlyCost;
    }
    getPlanInfo() { return `The ${this.planName} plan costs $${this.monthlyCost}/month.`; }
}

// child class AnnualSubscription.js
class AnnualSubscription extends Subscription {
    constructor(planName, monthlyCost, discountPercent) {
        super(planName, monthlyCost);
        this.discountPercent = discountPercent;
    }
    getAnnualCost() { return (this.monthlyCost * 12) * (1 - this.discountPercent / 100); }
    displayDetails() {
        console.log(`[Subscription Analysis Mode]`);
        return this.getPlanInfo() + ` Upgrading to an annual lock-in reduces cost to $${this.getAnnualCost()}/year.`;
    }
}

// Main.js
console.log("--- Executing Subscription OOP Flow ---");
const premiumPlan = new AnnualSubscription("Premium Video", 15, 15);
console.log(premiumPlan.displayDetails());
