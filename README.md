# bank-simulator

This project provides a simple, dynamic, mobile-friendly interface that mimics a desktop operating system.
It presents icons for different banking modules and opens modular windows when they are selected.

## Saving and Loading

Use the **Save** and **Load** buttons in the top bar to persist application state.

1. **Save** – takes a snapshot of accounts and ledger data and writes it to the browser's IndexedDB.
2. **Load** – restores the most recent snapshot and updates the interface. A message in the top bar indicates success or errors.

## Development

- `npm run dev` – start Vite for local development.
- `npm test` – run Jest tests for the UI.
