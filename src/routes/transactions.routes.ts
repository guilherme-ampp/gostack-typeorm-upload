import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import path from 'path';
import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransactionService = new CreateTransactionService();
  const transaction = await createTransactionService.execute({
    category,
    title,
    value,
    type,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransactionService = new DeleteTransactionService();
  await deleteTransactionService.execute({ id });

  return response.json({ id });
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { destination, filename } = request.file;
    const csvFilename = path.join(destination, filename);

    const importTransactionsService = new ImportTransactionsService();
    const transactions = await importTransactionsService.execute({
      filename: csvFilename,
    });

    return response.json({ transactions });
  },
);

export default transactionsRouter;
