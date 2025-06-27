export interface Account {
  id: string;
  name: string;
  currency: 'KES' | 'USD' | 'NGN';
  balance: number;
}

export interface Transaction {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    currency: 'KES' | 'USD' | 'NGN';
    note?: string;
    timestamp: Date;
    fromAccountName: string;
    toAccountName: string;
}

export interface TransferFormData {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  note:string;
}