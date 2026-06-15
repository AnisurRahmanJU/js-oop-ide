class ClassTime {
  constructor(day, startTime, endTime) {
    this._day = day;
    this._startTime = startTime;
    this._endTime = endTime;
  }

  isConflict(incomingTime) {
    if (this._day !== incomingTime.day) return false;
    return this._startTime < incomingTime.endTime && incomingTime.startTime < this._endTime;
  }

  get day() { return this._day; }
  get startTime() { return this._startTime; }
  get endTime() { return this._endTime; }

  getFormattedTime() {
    return `${this._day} (${this._startTime} - ${this._endTime})`;
  }
}

class Student {
  constructor(id, name) {
    this._id = id;
    this._name = name;
    this._schedule = [];
  }

  getProfile() {
    return `Student: ${this._name} (ID: ${this._id})`;
  }

  hasTimeConflict(newTime) {
    return this._schedule.some(existingTime => existingTime.isConflict(newTime));
  }

  addTimeSlot(classTime) {
    this._schedule.push(classTime);
  }
}

class Course {
  constructor(courseCode, capacity, classTimeInstance) {
    this._courseCode = courseCode;
    this._capacity = capacity;
    this._classTime = classTimeInstance;
    this._enrolled = [];
  }

  register(student) {
    if (this._enrolled.length >= this._capacity) {
      return `Registration failed: ${this._courseCode} is full.`;
    }
    if (student.hasTimeConflict(this._classTime)) {
      return `Registration failed: Schedule conflict for ${student.getProfile()} at ${this._classTime.getFormattedTime()}.`;
    }

    this._enrolled.push(student);
    student.addTimeSlot(this._classTime);
    return `${student.getProfile()} successfully registered for ${this._courseCode} scheduled on ${this._classTime.getFormattedTime()}.`;
  }
}

const student1 = new Student("S101", "Alice");
const morningSlot = new ClassTime("Monday", "09:00", "11:00");
const overlapSlot = new ClassTime("Monday", "10:00", "12:00");

const cs101 = new Course("CS101", 30, morningSlot);
const math101 = new Course("MATH101", 25, overlapSlot);

console.log(cs101.register(student1));
console.log(math101.register(student1));
