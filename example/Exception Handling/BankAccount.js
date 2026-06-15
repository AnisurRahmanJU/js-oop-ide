class BankAccount {
  #balance;

  constructor(ownerName, initialBalance) {
    if (!ownerName || typeof ownerName !== "string") {
      throw new Error("Invalid owner name provided.");
    }
    if (initialBalance < 0) {
      throw new Error("Initial balance cannot be negative.");
    }
    this.owner = ownerName;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit amount must be greater than zero.");
    }
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }

  setBalance(amount) {
    if (amount < 0) {
      throw new Error("Balance cannot be set to a negative value.");
    }
    this.#balance = amount;
  }
}

class SavingsAccount extends BankAccount {
  #interestRate;

  constructor(ownerName, initialBalance, interestRate) {
    super(ownerName, initialBalance);
    if (interestRate < 0 || interestRate > 1) {
      throw new Error("Interest rate must be between 0 and 1.");
    }
    this.#interestRate = interestRate;
  }

  addInterest() {
    const currentBalance = this.getBalance();
    const interest = currentBalance * this.#interestRate;
    this.setBalance(currentBalance + interest);
  }
}

try {
  const savings = new SavingsAccount("Alex Rivera", 1000.00, 0.05);
  console.log(`Owner: ${savings.owner}`);

  savings.deposit(-500);
  savings.addInterest();
  console.log(`Final Balance: $${savings.getBalance().toFixed(2)}`);
} catch (error) {
  console.error(`Caught Error: ${error.message}`);
}

try {
  const invalidAccount = new SavingsAccount("", -100, 0.05);
} catch (error) {
  console.error(`Caught Error: ${error.message}`);
}
