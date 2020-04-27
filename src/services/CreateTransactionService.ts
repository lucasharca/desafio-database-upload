import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';
import CategoryRepository from '../repositories/CategoryRepository';
import CreateCategoryService from './CreateCategoryService';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryService = new CreateCategoryService();
    const transactionRepository = getCustomRepository(TransactionRepository);
    const returnCategory = await categoryService.execute(category);

    const arrays = await transactionRepository.find();
    const balance = await transactionRepository.getBalance(arrays);

    if (type === 'outcome' && value > (await balance.total)) {
      throw new AppError('Insuficient funds', 400);
    } else {
      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category_id: returnCategory.id,
      });

      await transactionRepository.save(transaction);
      return transaction;
    }
  }
}

export default CreateTransactionService;
