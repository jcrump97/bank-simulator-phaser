export function generateTrialBalance(accountManager) {
  const accounts = accountManager.getAllAccounts();
  const rows = accounts.map(acc => {
    const isDebit = acc.type === 'asset' || acc.type === 'expense';
    return {
      account: acc.name,
      debit: isDebit ? acc.getBalance() : 0,
      credit: !isDebit ? acc.getBalance() : 0
    };
  });
  const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
  const totalCredit = rows.reduce((s, r) => s + r.credit, 0);
  return { rows, totalDebit, totalCredit, balanced: Math.abs(totalDebit - totalCredit) < 0.01 };
}
