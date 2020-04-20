import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const incomeTransactions: number[] = [];
    const outcomeTransactions: number[] = [];

    const allTransactions = await this.find();
    allTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        incomeTransactions.push(transaction.value);
      } else {
        outcomeTransactions.push(transaction.value);
      }
    });

    const totalIncome = incomeTransactions.reduce((a, b) => a + b, 0);
    const totalOutcome = outcomeTransactions.reduce((a, b) => a + b, 0);
    const balanceTotal = totalIncome - totalOutcome;

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: balanceTotal,
    };
  }
}

export default TransactionsRepository;
