import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const incomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeTransactions = this.transactions.filter(
      transaction => transaction.type === 'outcome',
    );
    const incomeTotal = incomeTransactions.reduce(
      (acc, transaction) => (acc += transaction.value),
      0,
    );
    const outcomeTotal = outcomeTransactions.reduce(
      (acc, transaction) => (acc += transaction.value),
      0,
    );
    const total = incomeTotal - outcomeTotal;
    const balance = { income: incomeTotal, outcome: outcomeTotal, total };
    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
