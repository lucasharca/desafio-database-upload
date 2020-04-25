import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    function reduceArray(array: Transaction[]): number {
      const newArray = array.map(arr => arr.value);
      const totalValue = newArray.reduce((a, b) => a + b, 0);
      return totalValue;
    }

    const incomeArray = transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeArray = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const income = reduceArray(incomeArray);
    const outcome = reduceArray(outcomeArray);
    const total = income - outcome;

    const balance: Balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }
}

export default TransactionsRepository;
