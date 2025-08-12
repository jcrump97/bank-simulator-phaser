export default class Customer {
  constructor(id, firstName, lastName, email, phone, dateOfBirth, riskProfile = 'medium') {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.riskProfile = riskProfile; // 'low', 'medium', 'high'
    this.createdAt = new Date();
    this.isActive = true;
    
    // Account relationships
    this.accountIds = [];
    
    // Customer profile
    this.address = null;
    this.occupation = null;
    this.income = null;
    this.creditScore = null;
    
    // Interaction history
    this.interactions = [];
    this.lastInteraction = null;
    
    // Risk assessment
    this.riskFactors = [];
    this.kycStatus = 'pending'; // 'pending', 'verified', 'rejected'
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get age() {
    const today = new Date();
    const birthDate = new Date(this.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  addAccount(accountId) {
    if (!this.accountIds.includes(accountId)) {
      this.accountIds.push(accountId);
    }
  }

  removeAccount(accountId) {
    const index = this.accountIds.indexOf(accountId);
    if (index > -1) {
      this.accountIds.splice(index, 1);
    }
  }

  addInteraction(type, description, amount = null) {
    const interaction = {
      id: Date.now(),
      type, // 'deposit', 'withdrawal', 'transfer', 'inquiry', 'application'
      description,
      amount,
      timestamp: new Date(),
      tellerId: null // Can be set by the system
    };
    
    this.interactions.push(interaction);
    this.lastInteraction = interaction.timestamp;
    
    return interaction;
  }

  addRiskFactor(factor, severity = 'medium') {
    this.riskFactors.push({
      factor,
      severity, // 'low', 'medium', 'high'
      timestamp: new Date()
    });
    
    this.updateRiskProfile();
  }

  updateRiskProfile() {
    const highRiskCount = this.riskFactors.filter(rf => rf.severity === 'high').length;
    const mediumRiskCount = this.riskFactors.filter(rf => rf.severity === 'medium').length;
    
    if (highRiskCount >= 2 || (highRiskCount >= 1 && mediumRiskCount >= 3)) {
      this.riskProfile = 'high';
    } else if (highRiskCount >= 1 || mediumRiskCount >= 2) {
      this.riskProfile = 'medium';
    } else {
      this.riskProfile = 'low';
    }
  }

  getRiskColor() {
    const colors = {
      'low': '#00ff00',
      'medium': '#ffff00',
      'high': '#ff0000'
    };
    return colors[this.riskProfile] || '#ffffff';
  }

  isEligibleForAccount(accountType) {
    // Basic eligibility check based on risk profile and age
    if (this.age < 18) return false;
    
    if (accountType === 'loan' && this.riskProfile === 'high') {
      return false;
    }
    
    return true;
  }

  toJSON() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      dateOfBirth: this.dateOfBirth,
      riskProfile: this.riskProfile,
      createdAt: this.createdAt,
      isActive: this.isActive,
      accountIds: this.accountIds,
      address: this.address,
      occupation: this.occupation,
      income: this.income,
      creditScore: this.creditScore,
      interactions: this.interactions,
      lastInteraction: this.lastInteraction,
      riskFactors: this.riskFactors,
      kycStatus: this.kycStatus
    };
  }

  static fromJSON(data) {
    const customer = new Customer(
      data.id,
      data.firstName,
      data.lastName,
      data.email,
      data.phone,
      data.dateOfBirth,
      data.riskProfile
    );
    
    customer.createdAt = new Date(data.createdAt);
    customer.isActive = data.isActive;
    customer.accountIds = data.accountIds || [];
    customer.address = data.address;
    customer.occupation = data.occupation;
    customer.income = data.income;
    customer.creditScore = data.creditScore;
    customer.interactions = data.interactions || [];
    customer.lastInteraction = data.lastInteraction ? new Date(data.lastInteraction) : null;
    customer.riskFactors = data.riskFactors || [];
    customer.kycStatus = data.kycStatus;
    
    return customer;
  }
}
