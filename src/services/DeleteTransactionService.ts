import { getCustomRepository, getRepository } from 'typeorm';
import { response } from 'express';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.find({ where: { id } });
    await transactionRepository.remove(transaction);
    return transaction;
  }
}

export default DeleteTransactionService;
