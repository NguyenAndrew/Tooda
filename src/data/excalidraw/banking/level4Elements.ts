import { computeLayout } from '../elementHelpers';

export const bankingLevel4Elements = [
  ...computeLayout(
    [
      { id: 'l4-ctrl',    label: 'AccountsController\n─────────────────\n+getBalance(req, res) void\n+getTransactions(req, res) void',                                                                                                         color: '#bfdbfe', width: 220, height: 140 },
      { id: 'l4-svc',     label: 'AccountsService\n─────────────────\n-accountsRepository: AccountsRepository\n-mainframeClient: MainframeClient\n+getBalance(customerId: string) Promise~Account~\n+getTransactions(customerId: string) Promise~Transaction~', color: '#bbf7d0', width: 220, height: 140 },
      { id: 'l4-repo',    label: 'AccountsRepository\n─────────────────\n-db: DatabaseConnection\n+findByCustomerId(customerId: string) Promise~Account~\n+findTransactions(accountId: string) Promise~Transaction~',                         color: '#fde68a', width: 220, height: 140 },
      { id: 'l4-mf',      label: 'MainframeClient\n─────────────────\n-baseUrl: string\n+fetchAccount(customerId: string) Promise~Account~\n+fetchTransactions(accountId: string) Promise~Transaction~',                                    color: '#f3e8ff', width: 220, height: 120 },
      { id: 'l4-account', label: 'Account\n─────────────────\n+id: string\n+customerId: string\n+balance: number\n+currency: string',                                                                                                        color: '#fce7f3', width: 220, height: 100 },
      { id: 'l4-tx',      label: 'Transaction\n─────────────────\n+id: string\n+accountId: string\n+amount: number\n+description: string\n+date: Date',                                                                                      color: '#bfdbfe', width: 220, height: 100 },
    ],
    [
      { id: 'l4-a1', from: 'l4-ctrl', to: 'l4-svc',     label: 'uses' },
      { id: 'l4-a2', from: 'l4-svc',  to: 'l4-repo',    label: 'uses' },
      { id: 'l4-a3', from: 'l4-svc',  to: 'l4-mf',      label: 'uses' },
      { id: 'l4-a4', from: 'l4-repo', to: 'l4-account',  label: 'returns' },
      { id: 'l4-a5', from: 'l4-repo', to: 'l4-tx',       label: 'returns' },
      { id: 'l4-a6', from: 'l4-mf',   to: 'l4-account',  label: 'returns' },
      { id: 'l4-a7', from: 'l4-mf',   to: 'l4-tx',       label: 'returns' },
    ],
    { hStep: 260, vGap: 60 },
  ),
];

