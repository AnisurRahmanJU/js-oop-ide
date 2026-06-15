class SavingsAccount {
    constructor(accountNumber, balance, interestRate) {
        this.accountNumber = accountNumber;
        this.balance = balance;
        this.interestRate = interestRate;
    }

    // Encapsulated logic
    getStatus() {
        return `Account ${this.accountNumber} balance: $${this.balance}.`;
    }

    calculateInterest() {
        return this.balance * (this.interestRate / 100);
    }

    displayDetails() {
        console.log(`[Financial Analysis Mode]`);
        return `${this.getStatus()} Annual generated interest will be $${this.calculateInterest()}.`;
    }
}

const savings = new SavingsAccount("ACT-4452", 5000, 4.5);
console.log(savings.displayDetails());
