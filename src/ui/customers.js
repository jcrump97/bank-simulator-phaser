export default function renderCustomers(rootDocument, customers = []) {
  const container = rootDocument.createElement('div');
  container.className = 'customer-list';

  const table = rootDocument.createElement('table');
  const thead = rootDocument.createElement('thead');
  const headerRow = rootDocument.createElement('tr');
  ['Name', 'Patience', 'Status'].forEach(text => {
    const th = rootDocument.createElement('th');
    th.textContent = text;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = rootDocument.createElement('tbody');
  customers.forEach(cust => {
    const tr = rootDocument.createElement('tr');
    const nameTd = rootDocument.createElement('td');
    nameTd.textContent = cust.fullName || cust.name || '';
    tr.appendChild(nameTd);

    const patienceTd = rootDocument.createElement('td');
    patienceTd.textContent = cust.patience != null ? cust.patience : '';
    tr.appendChild(patienceTd);

    const statusTd = rootDocument.createElement('td');
    statusTd.textContent = cust.status || 'waiting';
    tr.appendChild(statusTd);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  container.appendChild(table);
  return container;
}
