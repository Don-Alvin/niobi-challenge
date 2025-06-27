import { useState } from "react";
import type { Account, Transaction, TransferFormData } from "./types";


// Acount data
const initialAccounts: [] = [
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
]

const App = () => {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showTransferForm, setShowTransferForm] = useState(false)

  const handleTransfer = (transferData: TransferFormData) => {
    const sourceAccount = accounts.find(acc => acc.id == transferData.fromAccountId);
    const destinationAccount = accounts.find(acc => acc.id = transferData.toAccountId);

    if (!sourceAccount || !destinationAccount) return;
    const amount = parseFloat(transferData.amount)

    // Update account balances
    setAccounts(prev => prev.map(account => {
      if(account.id == transferData.fromAccountId){
        return {...account, balance: account.balance - amount}
      }
      if (account.id === transferData.toAccountId){
        return {...account, balance: account.balance + amount}
      }
      return account;
    }));  

    // Add transaction record
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      fromAccountId: transferData.fromAccountId,
      toAccountId: transferData.toAccountId,
      amount,
        currency: sourceAccount.currency,
        note: transferData.note,
        timestamp: new Date(),
        fromAccountName: sourceAccount.name,
        toAccountName: destinationAccount.name
      };

      setTransactions(prev => [newTransaction, ...prev]);
      setShowTransferForm(false)
  };

  const getTotalsByCurrency = () => {
    const totals = {KES: 0, USD: 0, NGN: 0};
    accounts.forEach(account => {
      totals[account.currency] += account.balance;
    })
    return totals;
  }

  const totals = getTotalsByCurrency();

  return(
    <div className="min-h-screen bg-gray-50">
      <div className="max-W-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-600 text-white rounded-xl">Hello Niobi</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default App