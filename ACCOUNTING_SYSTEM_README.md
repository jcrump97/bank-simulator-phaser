# Double Ledger Accounting System

## Overview

The Bank Simulator now includes a comprehensive double-entry bookkeeping system that leverages Phaser's visual capabilities and browser storage for data persistence. This system provides a complete accounting solution suitable for educational purposes and small business management.

## Features

### Core Accounting
- **Double-Entry Bookkeeping**: Every transaction has balanced debits and credits
- **Chart of Accounts**: Pre-configured with standard banking accounts
- **Transaction Types**: Support for deposits, withdrawals, transfers, loans, and interest
- **Balance Sheet Validation**: Automatic validation that Assets = Liabilities + Equity
- **Real-time Balance Updates**: Instant account balance updates when transactions are posted

### Account Management
- **Account Types**: Assets, Liabilities, Equity, Revenue, and Expenses
- **Color Coding**: Visual distinction between account types
- **Account Numbers**: Automatic generation with type-based prefixes
- **Interactive Selection**: Click accounts to view related transactions

### Transaction Management
- **Transaction Cards**: Visual representation of transactions with detailed information
- **Status Tracking**: Posted vs. Draft transaction states
- **Entry Details**: View individual debit/credit entries for each transaction
- **Validation**: Automatic validation that transactions balance to zero

### Data Persistence
- **Local Storage**: All data stored in browser localStorage
- **Automatic Backup**: Multiple backup versions maintained
- **Export/Import**: JSON-based data portability
- **Data Recovery**: Automatic fallback to backups if corruption detected

### User Interface
- **Phaser Integration**: Smooth animations and visual feedback
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Hover effects, clickable components
- **Visual Feedback**: Color-coded balances and status indicators

## Architecture

### Models
- **Account**: Manages individual account data and balance calculations
- **Transaction**: Implements double-entry validation and posting logic

### Services
- **AccountManager**: Manages the chart of accounts and balance calculations
- **TransactionManager**: Handles transaction creation, posting, and retrieval
- **StorageService**: Manages data persistence and backup operations

### Components
- **TransactionCard**: Visual transaction display with interactive details
- **AccountDisplay**: Account information with color coding and selection
- **TransactionForm**: User-friendly transaction creation interface

### Scenes
- **AccountingScene**: Main accounting interface with multiple views
- **BootScene**: Updated to include accounting mode access
- **TellerScene & PersonalBankerScene**: Enhanced with back navigation

## Usage

### Accessing the Accounting System
1. Launch the Bank Simulator
2. Select "Accounting Mode" from the main menu
3. Navigate between Accounts, Transactions, and Balance Sheet views

### Creating Transactions
1. Click "New Transaction" button
2. Fill in the transaction form:
   - Description
   - Amount
   - Transaction type (deposit/withdrawal/transfer)
   - Account selection
3. Review the preview
4. Click "Create Transaction"

### Managing Accounts
1. View all accounts in the Accounts tab
2. Click on an account to select it and view related transactions
3. Account balances update automatically when transactions are posted

### Viewing Reports
- **Accounts View**: Complete chart of accounts with balances
- **Transactions View**: All transactions with status and details
- **Balance Sheet**: Financial position summary with validation

## Data Structure

### Account Format
```json
{
  "id": "checking",
  "name": "Checking Accounts",
  "type": "asset",
  "balance": 50000,
  "accountNumber": "1500001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "isActive": true
}
```

### Transaction Format
```json
{
  "id": "TXN-1704067200000-1",
  "description": "Customer Deposit",
  "entries": [
    {"accountId": "checking", "debit": 1000, "credit": 0},
    {"accountId": "cash", "debit": 0, "credit": 1000}
  ],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "isPosted": true
}
```

## Technical Details

### Browser Storage
- **Storage Key**: `bank_simulator_data`
- **Backup Key**: `bank_simulator_backup`
- **Max Backups**: 5 versions maintained
- **Data Validation**: Automatic structure validation on load

### Performance Considerations
- **Lazy Loading**: Components created only when needed
- **Memory Management**: Proper cleanup of DOM elements and Phaser objects
- **Efficient Rendering**: Container-based organization for optimal performance

### Browser Compatibility
- **Local Storage**: Standard browser localStorage API
- **File API**: Modern browser File API for import/export
- **ES6 Modules**: Uses modern JavaScript module system

## Future Enhancements

### Planned Features
- **Multi-currency Support**: Handle different currencies and exchange rates
- **Advanced Reporting**: Income statements, cash flow statements
- **Audit Trail**: Detailed transaction history and change tracking
- **User Management**: Multi-user support with role-based access
- **Mobile Optimization**: Touch-friendly interface for mobile devices

### Technical Improvements
- **Service Worker**: Offline functionality and background sync
- **IndexedDB**: Alternative storage for larger datasets
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Validation**: Business rule validation and compliance checks

## Testing

### Manual Testing
1. Create various transaction types
2. Verify account balances update correctly
3. Test data persistence across browser sessions
4. Validate balance sheet always balances

### Automated Testing
- Unit tests for core accounting logic
- Integration tests for data flow
- UI component testing
- Storage service validation

## Troubleshooting

### Common Issues
- **Data Not Loading**: Check localStorage availability and permissions
- **Transaction Errors**: Verify account IDs exist and are active
- **Balance Mismatches**: Use balance sheet validation to identify issues
- **Performance Issues**: Clear browser cache and localStorage if needed

### Data Recovery
- Automatic backup restoration on corruption detection
- Manual backup restoration from backup files
- Export current data before troubleshooting

## Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Access accounting system via "Accounting Mode" button

### Code Standards
- Follow existing Phaser scene patterns
- Use ES6+ features and modern JavaScript
- Maintain proper separation of concerns
- Document complex business logic

## License

This accounting system is part of the Bank Simulator project and follows the same licensing terms.

---

For questions or issues, please refer to the main project documentation or create an issue in the repository.
