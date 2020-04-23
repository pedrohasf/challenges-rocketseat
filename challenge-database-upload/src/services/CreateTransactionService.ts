import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import { getRepository, getCustomRepository } from 'typeorm';

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
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const balanceTotal = (await transactionsRepository.getBalance()).total;

    if (type === 'outcome' && value > balanceTotal) {
      throw new AppError('insufficient funds for this transaction');
    }

    let existingCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!existingCategory) {
      existingCategory = categoryRepository.create({ title: category });
      await categoryRepository.save(existingCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: existingCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
