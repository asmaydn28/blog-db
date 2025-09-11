import prisma from '../prisma.js';

export default class CategoryService {
  // Kategori oluşturma
  public create = async (categoryData: { name: string }) => {
    if (!categoryData.name) {
      throw new Error('Kategori adı (name) zorunludur.');
    }
    return prisma.category.create({
      data: {
        name: categoryData.name,
      },
    });
  };

  // Kategorileri listeleme
  public findAll = async (filters: { showDeleted?: string; onlyDeleted?: string }) => {
    const whereClause: any = {};
    if (filters.onlyDeleted === 'true') {
      whereClause.deleted_at = { not: null };
    } else if (filters.showDeleted !== 'true') {
      whereClause.deleted_at = null;
    }
    return prisma.category.findMany({ where: whereClause });
  };

  // Kategori detayını getirme
  public findOne = async (id: number) => {
    return prisma.category.findFirst({
      where: { id: id, deleted_at: null },
    });
  };

  // Kategori güncelleme
  public update = async (id: number, categoryData: { name?: string }) => {
    const data: { name?: string } = {};
    if (categoryData.name !== undefined) {
      data.name = categoryData.name;
    }
    return prisma.category.update({
      where: { id: id },
      data: data,
    });
  };

  // Kategori silme
  public delete = async (id: number) => {
    const category = await prisma.category.findUnique({ where: { id } });
    if (!category || category.deleted_at) return false;
    await prisma.category.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  };
}
