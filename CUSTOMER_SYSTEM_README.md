# Customer System Implementation

## Overview
The Customer System adds realistic customer management capabilities to the Bank Simulator, including customer creation, risk assessment, queue management, and integration with the existing accounting system.

## Features

### 1. Customer Management
- **Customer Creation**: Create new customers with comprehensive profile information
- **Customer Search**: Search customers by name, ID, email, or phone
- **Customer Editing**: Update existing customer information
- **Customer Deactivation**: Soft-delete customers (mark as inactive)

### 2. Customer Profiles
- **Basic Information**: First name, last name, email, phone, date of birth
- **Risk Assessment**: Low, medium, or high risk profiles
- **Financial Information**: Annual income, credit score
- **Address Details**: Street, city, state, zip code
- **Occupation**: Professional background
- **Account Relationships**: Links to banking accounts

### 3. Risk Management
- **Risk Factors**: Track specific risk indicators
- **Dynamic Risk Assessment**: Automatic risk profile updates based on factors
- **Eligibility Checking**: Determine account eligibility based on risk and age
- **Risk Visualization**: Color-coded risk indicators in the UI

### 4. Customer Queue System
- **Real-time Queue**: Dynamic customer queue for teller operations
- **Queue Management**: Add/remove customers from queue
- **Automatic Updates**: Queue refreshes every 5 seconds
- **Random Customer Generation**: New customers join queue automatically

### 5. Integration with Banking Operations
- **Teller Integration**: Customer queue and transaction processing
- **Personal Banker Integration**: Account application processing
- **Accounting Integration**: Customer-account relationships
- **Transaction History**: Track customer interactions

## Architecture

### Core Models

#### Customer Class
```javascript
class Customer {
  // Basic properties
  id, firstName, lastName, email, phone, dateOfBirth
  riskProfile, createdAt, isActive
  
  // Financial profile
  address, occupation, income, creditScore
  
  // Risk assessment
  riskFactors, kycStatus
  
  // Relationships
  accountIds, interactions, lastInteraction
}
```

#### CustomerManager Service
```javascript
class CustomerManager {
  // Customer operations
  createCustomer(), updateCustomer(), deactivateCustomer()
  
  // Customer generation
  generateRandomCustomer(), generateCustomerBatch()
  
  // Queue management
  addCustomerToQueue(), removeCustomerFromQueue()
  
  // Search and filtering
  searchCustomers(), getCustomersByRiskProfile()
  
  // Statistics
  getCustomerStats()
}
```

### UI Components

#### CustomerDisplay
- Visual representation of customer information
- Interactive customer cards with hover effects
- Risk profile color coding
- Account count and age display

#### CustomerForm
- DOM-based form for customer creation/editing
- Form validation and error handling
- Integration with Phaser canvas positioning
- Support for all customer fields

## Usage

### Teller Mode
1. **View Customer Queue**: See customers waiting for service
2. **Call Next Customer**: Process customers in order
3. **Process Transactions**: Handle deposits, withdrawals, transfers
4. **Customer Search**: Find specific customers
5. **Create Customers**: Add new customers to the system

### Personal Banker Mode
1. **Customer Database**: Browse all customers
2. **Customer Selection**: Choose customers for applications
3. **Application Processing**: Handle account applications
4. **Eligibility Checking**: Verify customer qualifications
5. **Application Review**: Approve/deny applications

### Customer Management
1. **Create Customer**: Fill out comprehensive customer form
2. **Edit Customer**: Update existing customer information
3. **Risk Assessment**: Monitor and update risk profiles
4. **Account Linking**: Connect customers to banking accounts

## Data Persistence

### Storage Structure
```javascript
{
  accounts: { /* AccountManager data */ },
  transactions: { /* TransactionManager data */ },
  customers: { /* CustomerManager data */ },
  timestamp: "2024-01-01T00:00:00.000Z",
  version: "1.0.0"
}
```

### Backup and Recovery
- Automatic backups on data changes
- Manual backup creation
- Data recovery from backups
- Export/import functionality

## Technical Implementation

### Phaser Integration
- **Canvas Positioning**: DOM elements positioned over Phaser canvas
- **Event Handling**: Seamless interaction between Phaser and DOM
- **Responsive Design**: UI adapts to different screen sizes
- **Scene Management**: Proper cleanup and resource management

### Performance Features
- **Debounced Resize**: Prevents excessive UI repositioning
- **Lazy Loading**: Customer data loaded on demand
- **Efficient Rendering**: Only visible customers rendered
- **Memory Management**: Proper cleanup of DOM elements

### Browser Compatibility
- **Local Storage**: Persistent data storage
- **Modern JavaScript**: ES6+ features
- **Cross-browser**: Works in all modern browsers
- **Mobile Friendly**: Responsive design for mobile devices

## Configuration

### Customer Generation
```javascript
// Generate random customers
customerManager.generateCustomerBatch(10);

// Custom customer creation
customerManager.createCustomer(
  'John', 'Doe', 'john@example.com',
  '(555) 123-4567', '1990-01-01', 'low'
);
```

### Risk Assessment
```javascript
// Add risk factors
customer.addRiskFactor('High debt-to-income ratio', 'medium');
customer.addRiskFactor('Recent credit inquiries', 'low');

// Risk profile updates automatically
console.log(customer.riskProfile); // 'medium'
```

### Queue Management
```javascript
// Add customer to queue
customerManager.addCustomerToQueue(customerId);

// Get next customer
const nextCustomer = customerManager.getNextCustomerInQueue();

// Check queue status
const stats = customerManager.getCustomerStats();
console.log('Queue length:', stats.queueLength);
```

## Testing

### Unit Tests
```bash
# Test customer system
node test-customer-system.js
```

### Integration Testing
1. Create customers through the UI
2. Test customer search functionality
3. Verify queue management
4. Test risk assessment updates
5. Validate data persistence

## Future Enhancements

### Planned Features
- **Advanced Risk Scoring**: More sophisticated risk algorithms
- **Customer Segmentation**: Group customers by demographics
- **Marketing Integration**: Customer communication tools
- **Compliance Tools**: KYC/AML compliance features
- **Reporting**: Advanced customer analytics

### Technical Improvements
- **Real-time Updates**: WebSocket integration for live data
- **Offline Support**: Service worker for offline functionality
- **Data Encryption**: Enhanced security for sensitive data
- **API Integration**: Connect to external banking systems

## Troubleshooting

### Common Issues

#### Customer Form Not Displaying
- Check DOM element positioning
- Verify Phaser canvas dimensions
- Ensure form container is visible

#### Customer Data Not Saving
- Check localStorage availability
- Verify data validation
- Check browser console for errors

#### Queue Not Updating
- Verify timer events are running
- Check customer manager state
- Ensure proper event handling

### Debug Information
```javascript
// Get storage information
const storageInfo = storageService.getStorageInfo();
console.log('Storage info:', storageInfo);

// Check customer data
const customerData = storageService.loadCustomerData();
console.log('Customer data:', customerData);

// Verify customer manager state
const stats = customerManager.getCustomerStats();
console.log('Customer stats:', stats);
```

## Contributing

### Development Guidelines
1. Follow existing code structure
2. Maintain Phaser integration patterns
3. Use consistent error handling
4. Add proper documentation
5. Include unit tests for new features

### Code Style
- Use ES6+ features
- Follow JavaScript naming conventions
- Maintain consistent indentation
- Add JSDoc comments for complex functions

## License
This customer system is part of the Bank Simulator project and follows the same licensing terms.
