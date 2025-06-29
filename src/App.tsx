import { useState } from "react";
import type { Account, Transaction, TransferFormData } from "./types";
import { Activity, Banknote, Plus, TrendingUp } from "lucide-react";
import AccountCard from "./components/AccountCard";
import TransactionHistory from "./components/TransactionHistory";
import TransferForm from "./components/TransferForm";

// FX rates
const FX_RATES = {
  KES_USD: 0.0077,
  USD_KES: 129.78,
  NGN_USD: 0.00067,
  USD_NGN: 1500.23,
  KES_NGN: 11.56,
  NGN_KES: 0.087
} as const;

// Account data
const initialAccounts: Account[] = [
  { id: '1', name: 'Mpesa_KES_1', currency: 'KES', balance: 125000.50 },
  { id: '2', name: 'Mpesa_KES_2', currency: 'KES', balance: 89750.25 },
  { id: '3', name: 'Bank_KES_Main', currency: 'KES', balance: 350000.00 },
  { id: '4', name: 'Bank_USD_1', currency: 'USD', balance: 25000.75 },
  { id: '5', name: 'Bank_USD_2', currency: 'USD', balance: 18500.00 },
  { id: '6', name: 'Bank_USD_3', currency: 'USD', balance: 42300.25 },
  { id: '7', name: 'Flutterwave_NGN_1', currency: 'NGN', balance: 2850000.00 },
  { id: '8', name: 'Flutterwave_NGN_2', currency: 'NGN', balance: 1200000.50 },
  { id: '9', name: 'Paystack_NGN_Main', currency: 'NGN', balance: 5600000.75 },
  { id: '10', name: 'Reserve_USD_Treasury', currency: 'USD', balance: 100000.00 }
];

const App = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransferForm, setShowTransferForm] = useState(false);

  // Updated handleTransfer function
  const handleTransfer = (transferData: TransferFormData) => {
    const sourceAccount = accounts.find(acc => acc.id === transferData.fromAccountId);
    const destinationAccount = accounts.find(acc => acc.id === transferData.toAccountId);
    
    if (!sourceAccount || !destinationAccount) return;

    const amount = parseFloat(transferData.amount);
    let destinationAmount = amount;

    // Handle currency conversion if needed
    if (sourceAccount.currency !== destinationAccount.currency) {
      const rateKey = `${sourceAccount.currency}_${destinationAccount.currency}` as keyof typeof FX_RATES;
      destinationAmount = amount * FX_RATES[rateKey];
    }

    // Update account balances
    setAccounts(prev => prev.map(account => {
      if (account.id === transferData.fromAccountId) {
        // Deduct exact amount from source
        return { ...account, balance: account.balance - amount };
      }
      if (account.id === transferData.toAccountId) {
        // Add converted amount to destination
        return { ...account, balance: account.balance + destinationAmount };
      }
      return account;
    }));

    // Create transaction record
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      fromAccountId: transferData.fromAccountId,
      toAccountId: transferData.toAccountId,
      amount,
      currency: sourceAccount.currency,
      convertedAmount: sourceAccount.currency !== destinationAccount.currency 
        ? destinationAmount 
        : undefined,
      note: transferData.note,
      timestamp: new Date(),
      fromAccountName: sourceAccount.name,
      toAccountName: destinationAccount.name,
      rate: sourceAccount.currency !== destinationAccount.currency
        ? FX_RATES[`${sourceAccount.currency}_${destinationAccount.currency}` as keyof typeof FX_RATES]
        : undefined
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setShowTransferForm(false);
  };

  // Rest of your existing App component remains the same
  const getTotalsByCurrency = () => {
    const totals = { KES: 0, USD: 0, NGN: 0 };
    accounts.forEach(account => {
      totals[account.currency] += account.balance;
    });
    return totals;
  };

  const totals = getTotalsByCurrency();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 text-white rounded-xl">
                <Banknote className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Treasury Movement Simulator</h1>
                <p className="text-gray-600">Manage virtual accounts across multiple currencies</p>
              </div>
            </div>
            <button
              onClick={() => setShowTransferForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span>New Transfer</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total KES</p>
                <p className="text-2xl font-bold text-emerald-600">
                  Ksh {totals.KES.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total USD</p>
                <p className="text-2xl font-bold text-blue-600">
                  $ {totals.USD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total NGN</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₦ {totals.NGN.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Virtual Accounts</h2>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
              {accounts.length} accounts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <TransactionHistory transactions={transactions} />

        {/* Transfer Form Modal */}
        {showTransferForm && (
          <TransferForm
            accounts={accounts}
            onTransfer={handleTransfer}
            onCancel={() => setShowTransferForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;