import { ArrowRight, Calendar, FileText, Filter } from "lucide-react";
import { useState } from "react";
import type { Transaction } from "../types";

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory = ({transactions}: TransactionHistoryProps) => {
  const[filter, setFilter] = useState<'all' | 'KES' | 'USD' | 'NGN' >('all');

  const filteredTransactions = transactions.filter(tx => 
    filter === 'all' || tx.currency == filter
  );

  const formatAmount = (amount: number, currency: string) => {
    const symbols = {KES: 'Ksh', USD: '$', NGN: '₦' };
    return `${symbols[currency as keyof typeof symbols]} ${amount.toFixed(2)}`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Currencies</option>
            <option value="KES">KES Only</option>
            <option value="USD">USD Only</option>
            <option value="NGN">NGN Only</option>
          </select>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No transactions found</p>
          <p className="text-sm">Start transferring funds to see transaction history</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-medium text-gray-900">
                      {transaction.fromAccountName}
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {transaction.toAccountName}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-lg text-green-600">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(transaction.timestamp)}
                  </div>
                </div>
              </div>
              
              {transaction.note && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-600 italic">"{transaction.note}"</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TransactionHistory