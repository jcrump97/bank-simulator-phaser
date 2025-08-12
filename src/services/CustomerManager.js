import Customer from '../models/Customer.js';

export default class CustomerManager {
  constructor(rng = Math.random) {
    this.rng = typeof rng === 'function' ? { next: rng } : rng;
    this.customers = new Map();
    this.nextCustomerId = 1;
    this.customerQueue = [];
    
    // Customer generation data
    this.firstNames = [
      'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
      'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
      'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
      'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
      'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle'
    ];
    
    this.lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
      'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
      'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker',
      'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill'
    ];
    
    this.occupations = [
      'Software Engineer', 'Teacher', 'Nurse', 'Accountant', 'Sales Representative',
      'Manager', 'Administrative Assistant', 'Customer Service Representative',
      'Marketing Specialist', 'Financial Analyst', 'Human Resources Specialist',
      'Project Manager', 'Data Analyst', 'Graphic Designer', 'Operations Manager',
      'Business Analyst', 'Product Manager', 'Consultant', 'Engineer', 'Analyst'
    ];
    
    this.streets = [
      'Main Street', 'Oak Avenue', 'Maple Drive', 'Cedar Lane', 'Pine Road',
      'Elm Street', 'Washington Avenue', 'Lake Drive', 'Hill Street', 'Park Avenue',
      'River Road', 'Sunset Boulevard', 'Forest Lane', 'Mountain View Drive',
      'Ocean Avenue', 'Valley Road', 'Spring Street', 'Summer Lane', 'Autumn Drive'
    ];
    
    this.cities = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
      'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
      'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville'
    ];
  }

  random() {
    return this.rng.next();
  }

  createCustomer(firstName, lastName, email, phone, dateOfBirth, riskProfile = 'medium') {
    const customer = new Customer(
      this.nextCustomerId++,
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth,
      riskProfile
    );
    
    this.customers.set(customer.id, customer);
    return customer;
  }

  generateRandomCustomer() {
    const firstName = this.firstNames[Math.floor(this.random() * this.firstNames.length)];
    const lastName = this.lastNames[Math.floor(this.random() * this.lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    const phone = this.generateRandomPhone();
    const dateOfBirth = this.generateRandomDateOfBirth();
    const riskProfile = this.generateRandomRiskProfile();
    
    const customer = this.createCustomer(firstName, lastName, email, phone, dateOfBirth, riskProfile);
    
    // Generate random profile data
    customer.occupation = this.occupations[Math.floor(this.random() * this.occupations.length)];
    customer.income = Math.floor(this.random() * 150000) + 25000;
    customer.creditScore = Math.floor(this.random() * 400) + 300;
    
    // Generate random address
    const streetNumber = Math.floor(this.random() * 9999) + 1;
    const street = this.streets[Math.floor(this.random() * this.streets.length)];
    const city = this.cities[Math.floor(this.random() * this.cities.length)];
    const state = this.generateRandomState();
    const zipCode = Math.floor(this.random() * 90000) + 10000;
    
    customer.address = {
      street: `${streetNumber} ${street}`,
      city,
      state,
      zipCode: zipCode.toString()
    };
    
    // Add some random risk factors
    if (this.random() < 0.3) {
      customer.addRiskFactor('High debt-to-income ratio', 'medium');
    }
    if (this.random() < 0.2) {
      customer.addRiskFactor('Recent credit inquiries', 'low');
    }
    if (this.random() < 0.1) {
      customer.addRiskFactor('Previous account closure', 'high');
    }
    
    return customer;
  }

  generateRandomPhone() {
    const areaCode = Math.floor(this.random() * 900) + 100;
    const prefix = Math.floor(this.random() * 900) + 100;
    const lineNumber = Math.floor(this.random() * 9000) + 1000;
    return `(${areaCode}) ${prefix}-${lineNumber}`;
  }

  generateRandomDateOfBirth() {
    const start = new Date(1960, 0, 1);
    const end = new Date(2000, 11, 31);
    const randomDate = new Date(start.getTime() + this.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  }

  generateRandomRiskProfile() {
    const rand = this.random();
    if (rand < 0.6) return 'low';
    if (rand < 0.9) return 'medium';
    return 'high';
  }

  generateRandomState() {
    const states = [
      'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
      'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
      'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
      'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
      'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];
    return states[Math.floor(this.random() * states.length)];
  }

  addCustomerToQueue(customerId) {
    if (!this.customerQueue.includes(customerId)) {
      this.customerQueue.push(customerId);
    }
  }

  removeCustomerFromQueue(customerId) {
    const index = this.customerQueue.indexOf(customerId);
    if (index > -1) {
      this.customerQueue.splice(index, 1);
    }
  }

  getNextCustomerInQueue() {
    if (this.customerQueue.length > 0) {
      const customerId = this.customerQueue.shift();
      return this.getCustomer(customerId);
    }
    return null;
  }

  getCustomer(id) {
    return this.customers.get(id);
  }

  getAllCustomers() {
    return Array.from(this.customers.values());
  }

  getActiveCustomers() {
    return this.getAllCustomers().filter(customer => customer.isActive);
  }

  getCustomersByRiskProfile(riskProfile) {
    return this.getAllCustomers().filter(customer => customer.riskProfile === riskProfile);
  }

  searchCustomers(query) {
    const lowerQuery = query.toLowerCase();
    return this.getAllCustomers().filter(customer => 
      customer.firstName.toLowerCase().includes(lowerQuery) ||
      customer.lastName.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery) ||
      customer.phone.includes(query)
    );
  }

  updateCustomer(id, updates) {
    const customer = this.getCustomer(id);
    if (customer) {
      Object.assign(customer, updates);
      return customer;
    }
    return null;
  }

  deactivateCustomer(id) {
    const customer = this.getCustomer(id);
    if (customer) {
      customer.isActive = false;
      return true;
    }
    return false;
  }

  getCustomerStats() {
    const customers = this.getAllCustomers();
    const activeCustomers = this.getActiveCustomers();
    
    return {
      total: customers.length,
      active: activeCustomers.length,
      inactive: customers.length - activeCustomers.length,
      byRiskProfile: {
        low: this.getCustomersByRiskProfile('low').length,
        medium: this.getCustomersByRiskProfile('medium').length,
        high: this.getCustomersByRiskProfile('high').length
      },
      averageAge: activeCustomers.reduce((sum, c) => sum + c.age, 0) / activeCustomers.length || 0,
      queueLength: this.customerQueue.length
    };
  }

  generateCustomerBatch(count = 10) {
    const newCustomers = [];
    for (let i = 0; i < count; i++) {
      newCustomers.push(this.generateRandomCustomer());
    }
    return newCustomers;
  }

  toJSON() {
    return {
      customers: Array.from(this.customers.values()).map(c => c.toJSON()),
      nextCustomerId: this.nextCustomerId,
      customerQueue: this.customerQueue
    };
  }

  static fromJSON(data) {
    const manager = new CustomerManager();
    manager.nextCustomerId = data.nextCustomerId || 1;
    manager.customerQueue = data.customerQueue || [];
    
    if (data.customers) {
      data.customers.forEach(customerData => {
        const customer = Customer.fromJSON(customerData);
        manager.customers.set(customer.id, customer);
      });
    }
    
    return manager;
  }
}
