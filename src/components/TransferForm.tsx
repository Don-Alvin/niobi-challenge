import { useState } from "react";
import type { Account, TransferFormData } from "../types"
import { AlertCircle, ArrowRight, Send } from "lucide-react";

interface TransferFormProps {
  accounts: Account[],
  onTransfer: (transfer: TransferFormData) => void;
  onCancel: () => void;
}

const TransferForm = ({accounts, onTransfer, onCancel}: TransferFormProps) => {
  const [formData, setFormData] = useState<TransferFormData>({
    fromAccountId: "",
    toAccountId: "",
    amount: "",
    note: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fromAccountId) {
      newErrors.fromAccountId = 'Please select a source account.'
    }

    if(!formData.toAccountId) {
      newErrors.toAccountId = 'Please select a destination account.'
    }

    if (formData.fromAccountId == formData.toAccountId) {
      newErrors.toAccountId = 'Source and destination must be different'
    }

    if (formData.amount || parseFloat(formData.amount) <= 0){
      newErrors.amount = 'Money must be above 0'
    }

    if(formData.fromAccountId && formData.amount) {
      const sourceAccount = accounts.find(acc => acc.id === formData.fromAccountId)
      if (sourceAccount && parseFloat(formData.amount) > sourceAccount.balance) {
        newErrors.amount = 'Insufficient balance in source account'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onTransfer(formData)
    }
  }

  const sourceAccount = accounts.find(acc => acc.id === formData.fromAccountId)
  const destinationAccount = accounts.find(acc => acc.id === formData.toAccountId)
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfer Funds</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Account
              </label>
              <select
                value={formData.fromAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, fromAccountId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.fromAccountId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select source account</option>
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>
                    {account.name} ({account.currency}) - Balance: {account.balance.toFixed(2)}
                  </option>
                ))}
              </select>
              {errors.fromAccountId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.fromAccountId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Account
              </label>
              <select
                value={formData.toAccountId}
                onChange={(e) => setFormData(prev => ({ ...prev, toAccountId: e.target.value }))}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.toAccountId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select destination account</option>
                {accounts
                  .filter(account => account.id !== formData.fromAccountId)
                  .map(account => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.currency})
                    </option>
                  ))}
              </select>
              {errors.toAccountId && (
                <p className="text-red-500 text-sm mt-1 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.toAccountId}
                </p>
              )}
            </div>
          </div>

          {sourceAccount && destinationAccount && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{sourceAccount.name}</span>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{destinationAccount.name}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                <span>{sourceAccount.currency}</span>
                <span>{destinationAccount.currency}</span>
              </div>
              {sourceAccount.currency !== destinationAccount.currency && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  ⚠️ Cross-currency transfer: {sourceAccount.currency} → {destinationAccount.currency}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount {sourceAccount && `(${sourceAccount.currency})`}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.amount}
              </p>
            )}
            {sourceAccount && (
              <p className="text-gray-500 text-sm mt-1">
                Available: {sourceAccount.balance.toFixed(2)} {sourceAccount.currency}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note (Optional)
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Add a note for this transfer..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Transfer Funds</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );

}

export default TransferForm