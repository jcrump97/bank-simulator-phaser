export default class KPIService {
  constructor(accountManager) {
    this.accountManager = accountManager;
    this.kpis = {
      profit: 0,
      liquidity: 0,
      csat: 100,
      queueTime: 0,
      fraudRisk: 0,
      compliance: 0,
      reputation: 100
    };
    this.update();
  }

  update() {
    // Profit based on net income from account manager
    this.kpis.profit = this.accountManager.getNetIncome();
    // Liquidity: assets minus liabilities
    this.kpis.liquidity = this.accountManager.getTotalAssets() - this.accountManager.getTotalLiabilities();
  }

  onEntryPosted() {
    this.update();
  }

  getKPIs() {
    return { ...this.kpis };
  }
}
