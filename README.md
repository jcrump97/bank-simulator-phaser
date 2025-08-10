# bank-simulator-phaser

## Data Storage

Customer information is managed client-side using `CustomerStore` located at `src/data/CustomerStore.js`. The store keeps an in-memory map of customers and synchronizes changes to `localStorage` so the game can persist data when hosted on GitHub Pages. Utility methods support loading and saving data, basic CRUD operations, and applying transactions that update account balances. During boot, the store loads any existing data and seeds two example customers if none are found.
 
