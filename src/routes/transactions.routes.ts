/* eslint-disable no-param-reassign */
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import Transactions from '../models/Transaction';
import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

interface Response {
  transaction: Transactions;
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}
const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionRepository.find();

  transactions.map(transaction => {
    return delete transaction.category_id;
  });

  const completo = {
    transactions,
    balance: await transactionRepository.getBalance(transactions),
  };

  return response.json(completo);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const transactionService = new CreateTransactionService();

  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute(id);

  return response.status(200).json({ ok: true });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();
    const createTransactionService = new CreateTransactionService();

    const transactionFile = await importTransactionService.execute(
      request.file.filename,
    );
    await transactionFile.map(file => createTransactionService.execute(file));

    return response.status(200).json(request.file.filename);
  },
);

export default transactionsRouter;
