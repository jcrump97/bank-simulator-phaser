import Phaser from 'phaser';

export default class CustomerForm {
  constructor(scene, x, y, customerManager, onCustomerCreated, onCustomerUpdated, existingCustomer = null) {
    this.scene = scene;
    this.customerManager = customerManager;
    this.onCustomerCreated = onCustomerCreated;
    this.onCustomerUpdated = onCustomerUpdated;
    this.existingCustomer = existingCustomer;
    this.container = scene.add.container(x, y);
    this.formElements = {};
    this.isVisible = false;
    
    this.createForm();
  }

  createForm() {
    const formWidth = 400;
    const formHeight = 500;
    const padding = 20;

    // Create form background
    const background = this.scene.add.graphics();
    background.fillStyle(0x1a1e36, 0.95);
    background.fillRoundedRect(-formWidth/2, -formHeight/2, formWidth, formHeight, 10);
    background.lineStyle(2, 0x4a5194, 1);
    background.strokeRoundedRect(-formWidth/2, -formHeight/2, formWidth, formHeight, 10);

    // Form title
    const title = this.scene.add.text(0, -formHeight/2 + padding, 
      this.existingCustomer ? 'Edit Customer' : 'Create New Customer', {
      fontSize: '20px',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Create form fields
    this.createInputField('firstName', 'First Name', -formWidth/2 + padding, -formHeight/2 + 80, 150);
    this.createInputField('lastName', 'Last Name', -formWidth/2 + padding + 160, -formHeight/2 + 80, 150);
    this.createInputField('email', 'Email', -formWidth/2 + padding, -formHeight/2 + 130, 310);
    this.createInputField('phone', 'Phone', -formWidth/2 + padding, -formHeight/2 + 180, 310);
    this.createInputField('dateOfBirth', 'Date of Birth', -formWidth/2 + padding, -formHeight/2 + 230, 310);
    this.createInputField('occupation', 'Occupation', -formWidth/2 + padding, -formHeight/2 + 280, 310);
    this.createInputField('income', 'Annual Income', -formWidth/2 + padding, -formHeight/2 + 330, 310);
    this.createInputField('creditScore', 'Credit Score', -formWidth/2 + padding, -formHeight/2 + 380, 310);

    // Risk profile selector
    this.createRiskProfileSelector(-formWidth/2 + padding, -formHeight/2 + 430, 310);

    // Buttons
    this.createButton('Save', -formWidth/2 + padding, formHeight/2 - padding, () => {
      this.saveCustomer();
    });

    this.createButton('Cancel', -formWidth/2 + padding + 100, formHeight/2 - padding, () => {
      this.hide();
    });

    if (this.existingCustomer) {
      this.createButton('Delete', -formWidth/2 + padding + 200, formHeight/2 - padding, () => {
        this.deleteCustomer();
      });
    }

    // Add all elements to container
    this.container.add([background, title]);

    // Populate form if editing existing customer
    if (this.existingCustomer) {
      this.populateForm();
    }

    // Initially hide the form
    this.hide();
  }

  createInputField(name, label, x, y, width) {
    // Create label
    const labelText = this.scene.add.text(x, y, label, {
      fontSize: '14px',
      color: '#ffffff'
    });

    // Create input field using DOM
    const input = document.createElement('input');
    input.type = name === 'dateOfBirth' ? 'date' : 'text';
    input.style.position = 'absolute';
    input.style.left = `${this.scene.scale.width/2 + x}px`;
    input.style.top = `${this.scene.scale.height/2 + y + 20}px`;
    input.style.width = `${width}px`;
    input.style.padding = '8px';
    input.style.border = '1px solid #4a5194';
    input.style.borderRadius = '4px';
    input.style.backgroundColor = '#2a2e56';
    input.style.color = '#ffffff';
    input.style.fontSize = '14px';
    input.style.fontFamily = 'Arial, sans-serif';

    // Store reference
    this.formElements[name] = {
      label: labelText,
      input: input,
      x: x,
      y: y
    };

    // Add to DOM
    document.body.appendChild(input);

    // Add label to container
    this.container.add(labelText);
  }

  createRiskProfileSelector(x, y, width) {
    // Create label
    const labelText = this.scene.add.text(x, y, 'Risk Profile', {
      fontSize: '14px',
      color: '#ffffff'
    });

    // Create select dropdown using DOM
    const select = document.createElement('select');
    select.style.position = 'absolute';
    select.style.left = `${this.scene.scale.width/2 + x}px`;
    select.style.top = `${this.scene.scale.height/2 + y + 20}px`;
    select.style.width = `${width}px`;
    select.style.padding = '8px';
    select.style.border = '1px solid #4a5194';
    select.style.borderRadius = '4px';
    select.style.backgroundColor = '#2a2e56';
    select.style.color = '#ffffff';
    select.style.fontSize = '14px';
    select.style.fontFamily = 'Arial, sans-serif';

    // Add options
    const options = ['low', 'medium', 'high'];
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option;
      optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      select.appendChild(optionElement);
    });

    // Store reference
    this.formElements['riskProfile'] = {
      label: labelText,
      input: select,
      x: x,
      y: y
    };

    // Add to DOM
    document.body.appendChild(select);

    // Add label to container
    this.container.add(labelText);
  }

  createButton(text, x, y, callback) {
    const button = this.scene.add.text(x, y, text, {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#4a5194',
      padding: { x: 15, y: 8 }
    });
    
    button.setInteractive();
    button.on('pointerdown', callback);
    
    this.container.add(button);
  }

  populateForm() {
    const customer = this.existingCustomer;
    
    if (customer.firstName) this.formElements.firstName.input.value = customer.firstName;
    if (customer.lastName) this.formElements.lastName.input.value = customer.lastName;
    if (customer.email) this.formElements.email.input.value = customer.email;
    if (customer.phone) this.formElements.phone.input.value = customer.phone;
    if (customer.dateOfBirth) this.formElements.dateOfBirth.input.value = customer.dateOfBirth;
    if (customer.occupation) this.formElements.occupation.input.value = customer.occupation;
    if (customer.income) this.formElements.income.input.value = customer.income;
    if (customer.creditScore) this.formElements.creditScore.input.value = customer.creditScore;
    if (customer.riskProfile) this.formElements.riskProfile.input.value = customer.riskProfile;
  }

  saveCustomer() {
    const formData = this.getFormData();
    
    if (!this.validateForm(formData)) {
      alert('Please fill in all required fields correctly.');
      return;
    }

    if (this.existingCustomer) {
      // Update existing customer
      const updatedCustomer = this.customerManager.updateCustomer(this.existingCustomer.id, formData);
      if (updatedCustomer && this.onCustomerUpdated) {
        this.onCustomerUpdated(updatedCustomer);
      }
    } else {
      // Create new customer
      const newCustomer = this.customerManager.createCustomer(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.dateOfBirth,
        formData.riskProfile
      );
      
      // Set additional properties
      if (formData.occupation) newCustomer.occupation = formData.occupation;
      if (formData.income) newCustomer.income = parseInt(formData.income);
      if (formData.creditScore) newCustomer.creditScore = parseInt(formData.creditScore);
      
      if (newCustomer && this.onCustomerCreated) {
        this.onCustomerCreated(newCustomer);
      }
    }

    this.hide();
  }

  deleteCustomer() {
    if (this.existingCustomer && confirm('Are you sure you want to delete this customer?')) {
      this.customerManager.deactivateCustomer(this.existingCustomer.id);
      this.hide();
    }
  }

  getFormData() {
    const data = {};
    Object.keys(this.formElements).forEach(key => {
      data[key] = this.formElements[key].input.value;
    });
    return data;
  }

  validateForm(data) {
    const required = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth'];
    
    for (const field of required) {
      if (!data[field] || data[field].trim() === '') {
        return false;
      }
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return false;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\(\)\-\+]+$/;
    if (!phoneRegex.test(data.phone)) {
      return false;
    }

    return true;
  }

  show() {
    this.isVisible = true;
    this.container.setVisible(true);
    
    // Show all DOM elements
    Object.values(this.formElements).forEach(element => {
      element.input.style.display = 'block';
    });
  }

  hide() {
    this.isVisible = false;
    this.container.setVisible(false);
    
    // Hide all DOM elements
    Object.values(this.formElements).forEach(element => {
      element.input.style.display = 'none';
    });
  }

  updatePosition(x, y) {
    this.container.setPosition(x, y);
    
    // Update DOM element positions
    Object.values(this.formElements).forEach(element => {
      element.input.style.left = `${this.scene.scale.width/2 + element.x}px`;
      element.input.style.top = `${this.scene.scale.height/2 + element.y + 20}px`;
    });
  }

  destroy() {
    // Remove DOM elements
    Object.values(this.formElements).forEach(element => {
      if (element.input && element.input.parentNode) {
        element.input.parentNode.removeChild(element.input);
      }
    });
    
    // Destroy Phaser container
    if (this.container) {
      this.container.destroy();
    }
  }
}
