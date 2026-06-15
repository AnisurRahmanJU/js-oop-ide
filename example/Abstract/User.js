class AbstractUser {
  constructor(instance) {
    if (this.constructor === AbstractUser && !instance) {
      throw new Error("Cannot instantiate abstract class 'AbstractUser' directly.");
    }
    if (instance && typeof instance.getProfile !== "function") {
      throw new Error("Method 'getProfile()' must be implemented.");
    }
  }
}

class Admin {
  constructor(username, email, permissions) {
    this.username = username;
    this.email = email;
    this.permissions = permissions;
    
    new AbstractUser(this);
  }

  getProfile() {
    return `User Profile: ${this.username} (${this.email}).`;
  }

  displayDetails() {
    console.log(`[Security Analysis Mode]`);
    return `${this.getProfile()} Total authorized system permissions: ${this.permissions.length}.`;
  }
}

console.log("--- Executing User OOP Flow (No Inheritance) ---");
const sysAdmin = new Admin("root_user", "admin@domain.com", ["read", "write", "delete"]);
console.log(sysAdmin.displayDetails());
