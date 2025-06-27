import { TrendingUp, Wallet } from "lucide-react";
import type { Account } from "../types";

interface AccountCardProps {
    account: Account;
    onClick?: () => void;
    isSelected?: boolean;
}

const currencySymbols = {
    KES: 'Ksh',
    USD: '$',
    NGN: '₦'
}

const currencyColors = {
  KES: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  USD: 'bg-blue-50 border-blue-200 text-blue-700',
  NGN: 'bg-purple-50 border-purple-200 text-purple-700'
};


const AccountCard = ({account, onClick, isSelected}: AccountCardProps) => {
    const formatBalance = (balance: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(balance)
    };

    const colorClass = currencyColors[account.currency]
    const symbol = currencySymbols[account.currency]

    return (
        <div
        className={`
            p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg
            ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
            ${colorClass}
            hover:scale-[1.02]
        `}
        onClick={onClick}
        >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/60 rounded-lg">
                <Wallet className="w-5 h-5" />
            </div>
            <div>
                <h3 className="font-semibold text-lg">{account.name}</h3>
                <span className="text-sm opacity-75">{account.currency}</span>
            </div>
            </div>
            <TrendingUp className="w-5 h-5 opacity-60" />
        </div>
        
        <div className="text-right">
            <div className="text-2xl font-bold">
            {symbol} {formatBalance(account.balance, account.currency)}
            </div>
            <div className="text-sm opacity-75 mt-1">Available Balance</div>
        </div>
        </div>
    );
}

export default AccountCard