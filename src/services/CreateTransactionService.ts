import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

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
  }: Request): Promise<Category> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getRepository(Transaction);

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(newCategory);
      const transaction = transactionRepository.create({
        title,
        value,
        type,
        category: newCategory,
        category_id: newCategory.id,
      });

      await transactionRepository.save(transaction);
      return transaction;
    }
    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category: categoryExists,
      category_id: categoryExists.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
