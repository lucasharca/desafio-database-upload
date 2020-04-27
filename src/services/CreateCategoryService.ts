import { getCustomRepository } from 'typeorm';

import CategoryRepository from '../repositories/CategoryRepository';
import Category from '../models/Category';

class CreateCategoryService {
  public async execute(title: string): Promise<Category> {
    const categoryRepository = getCustomRepository(CategoryRepository);
    const categoryExists = await categoryRepository.checkCategoryExists(title);

    if (categoryExists === undefined) {
      const newCategory = categoryRepository.create({ title });
      await categoryRepository.save(newCategory);
      return newCategory;
    }
    return categoryExists;
  }
}

export default CreateCategoryService;
