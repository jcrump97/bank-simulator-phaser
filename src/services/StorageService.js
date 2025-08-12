export default class StorageService {
  constructor() {
    this.storageKey = 'bank_simulator_data';
    this.backupKey = 'bank_simulator_backup';
    this.maxBackups = 5;
  }

  saveData(data) {
    try {
      // Ensure we have the required data structure
      const dataToSave = {
        accounts: data.accounts || {},
        transactions: data.transactions || {},
        customers: data.customers || {},
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      
      // Create backup
      this.createBackup(dataToSave);
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      return false;
    }
  }

  loadData() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (!savedData) {
        return null;
      }
      
      const parsedData = JSON.parse(savedData);
      
      // Validate data structure
      if (!this.validateDataStructure(parsedData)) {
        console.warn('Data structure validation failed, attempting to recover...');
        return this.recoverData(parsedData);
      }
      
      return parsedData;
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  createBackup(data) {
    try {
      const backupData = {
        ...data,
        backupTimestamp: new Date().toISOString(),
        backupType: 'auto'
      };
      
      const backups = this.getBackups();
      backups.unshift(backupData);
      
      // Keep only the most recent backups
      if (backups.length > this.maxBackups) {
        backups.splice(this.maxBackups);
      }
      
      localStorage.setItem(this.backupKey, JSON.stringify(backups));
      return true;
    } catch (error) {
      console.error('Error creating backup:', error);
      return false;
    }
  }

  getBackups() {
    try {
      const backupData = localStorage.getItem(this.backupKey);
      return backupData ? JSON.parse(backupData) : [];
    } catch (error) {
      console.error('Error getting backups:', error);
      return [];
    }
  }

  restoreBackup(backupIndex) {
    try {
      const backups = this.getBackups();
      if (backupIndex >= 0 && backupIndex < backups.length) {
        const backup = backups[backupIndex];
        delete backup.backupTimestamp;
        delete backup.backupType;
        
        this.saveData(backup);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  exportData(data) {
    try {
      const exportData = {
        ...data,
        exportTimestamp: new Date().toISOString(),
        exportVersion: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bank_simulator_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Error exporting data:', error);
      return false;
    }
  }

  async importData(file) {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Validate imported data
      if (!this.validateDataStructure(importedData)) {
        throw new Error('Invalid data structure');
      }
      
      // Save imported data
      this.saveData(importedData);
      
      return importedData;
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  validateDataStructure(data) {
    // Basic validation - ensure required fields exist
    const requiredFields = ['accounts', 'transactions', 'customers'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false;
      }
    }
    
    // Check if data is not null/undefined
    if (data.accounts === null || data.transactions === null || data.customers === null) {
      return false;
    }
    
    return true;
  }

  recoverData(data) {
    // Attempt to recover partial data
    const recoveredData = {
      accounts: data.accounts || {},
      transactions: data.transactions || {},
      customers: data.customers || {},
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // Save recovered data
    this.saveData(recoveredData);
    
    return recoveredData;
  }

  clearAllData() {
    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.backupKey);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  getStorageInfo() {
    try {
      const data = this.loadData();
      const backups = this.getBackups();
      
      return {
        hasData: !!data,
        dataSize: data ? JSON.stringify(data).length : 0,
        backupCount: backups.length,
        lastBackup: backups.length > 0 ? backups[0].backupTimestamp : null,
        storageUsed: this.getStorageUsage()
      };
    } catch (error) {
      console.error('Error getting storage info:', error);
      return null;
    }
  }

  getStorageUsage() {
    try {
      let totalSize = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          totalSize += localStorage.getItem(key)?.length || 0;
        }
      }
      return totalSize;
    } catch (error) {
      console.error('Error calculating storage usage:', error);
      return 0;
    }
  }

  // Customer-specific storage methods
  saveCustomerData(customerData) {
    try {
      const currentData = this.loadData() || {};
      currentData.customers = customerData;
      return this.saveData(currentData);
    } catch (error) {
      console.error('Error saving customer data:', error);
      return false;
    }
  }

  loadCustomerData() {
    try {
      const data = this.loadData();
      return data ? data.customers : null;
    } catch (error) {
      console.error('Error loading customer data:', error);
      return null;
    }
  }

  // Combined save method for all data types
  saveAllData(accountData, transactionData, customerData) {
    try {
      const dataToSave = {
        accounts: accountData || {},
        transactions: transactionData || {},
        customers: customerData || {},
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      return this.saveData(dataToSave);
    } catch (error) {
      console.error('Error saving all data:', error);
      return false;
    }
  }
}
