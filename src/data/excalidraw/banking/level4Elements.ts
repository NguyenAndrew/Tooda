import { makeBox, makeArrow } from '../elementHelpers';

export const bankingLevel4Elements = [
  ...makeBox('l4-ctrl', 40, 80, 220, 140,
    'AccountsController\n─────────────────\n+getBalance(req, res) void\n+getTransactions(req, res) void', '#bfdbfe'),
  ...makeBox('l4-svc', 300, 80, 220, 140,
    'AccountsService\n─────────────────\n-accountsRepository: AccountsRepository\n-mainframeClient: MainframeClient\n+getBalance(customerId: string) Promise~Account~\n+getTransactions(customerId: string) Promise~Transaction~', '#bbf7d0'),
  ...makeBox('l4-repo', 560, 80, 220, 140,
    'AccountsRepository\n─────────────────\n-db: DatabaseConnection\n+findByCustomerId(customerId: string) Promise~Account~\n+findTransactions(accountId: string) Promise~Transaction~', '#fde68a'),
  ...makeBox('l4-mf', 300, 300, 220, 120,
    'MainframeClient\n─────────────────\n-baseUrl: string\n+fetchAccount(customerId: string) Promise~Account~\n+fetchTransactions(accountId: string) Promise~Transaction~', '#f3e8ff'),
  ...makeBox('l4-account', 40, 300, 220, 100,
    'Account\n─────────────────\n+id: string\n+customerId: string\n+balance: number\n+currency: string', '#fce7f3'),
  ...makeBox('l4-tx', 560, 300, 220, 100,
    'Transaction\n─────────────────\n+id: string\n+accountId: string\n+amount: number\n+description: string\n+date: Date', '#bfdbfe'),
  // Arrows
  ...makeArrow('l4-a1', 'l4-ctrl', 'l4-svc', 260, 150, 40, 0, 'uses'),
  ...makeArrow('l4-a2', 'l4-svc', 'l4-repo', 520, 150, 40, 0, 'uses'),
  ...makeArrow('l4-a3', 'l4-svc', 'l4-mf', 410, 150, 0, 210, 'uses'),
  ...makeArrow('l4-a4', 'l4-repo', 'l4-account', 670, 150, -520, 210, 'returns'),
  ...makeArrow('l4-a5', 'l4-repo', 'l4-tx', 670, 150, 0, 210, 'returns'),
  ...makeArrow('l4-a6', 'l4-mf', 'l4-account', 410, 360, -260, 0, 'returns'),
  ...makeArrow('l4-a7', 'l4-mf', 'l4-tx', 410, 360, 260, 0, 'returns'),
];
