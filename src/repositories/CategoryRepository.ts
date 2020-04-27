import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoryRepository extends Repository<Category> {
  public async checkCategoryExists(
    categoryTitle: string,
  ): Promise<Category | undefined> {
    const categoryExists = await this.findOne({
      where: { title: categoryTitle },
    });

    if (categoryExists) {
      return categoryExists;
    }
    return undefined;
  }
}

export default CategoryRepository;
