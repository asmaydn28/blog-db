import prisma from '../prisma.js';

type UserPayload = {
  id: number;
  role: string;
};

export default class CategoryService {
  public create = async (categoryData: { name: string }, user: UserPayload) => {
    // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori oluşturabilir.
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    if (!categoryData.name) {
      throw new Error('Kategori adı (name) zorunludur.');
    }
    return prisma.category.create({
      data: {
        name: categoryData.name,
      },
    });
  };

  public update = async (id: number, categoryData: { name?: string }, user: UserPayload) => {
    // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori güncelleyebilir.
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    const dataToUpdate: { name?: string } = {};

    if (categoryData.name !== undefined) {
      dataToUpdate.name = categoryData.name;
    }

    return prisma.category.update({
      where: { id: id },
      data: dataToUpdate,
    });
  };

  public delete = async (id: number, user: UserPayload) => {
    // Yetkilendirme: Sadece 'admin' rolündeki kullanıcılar kategori silebilir.
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    return prisma.category.update({
      where: { id: id },
      data: {
        deleted_at: new Date(),
      },
    });
  };

  public findAll = async (filters: { showDeleted?: string; onlyDeleted?: string }) => {
    const whereClause: any = {};
    if (filters.onlyDeleted === 'true') {
      whereClause.deleted_at = { not: null };
    } else if (filters.showDeleted !== 'true') {
      whereClause.deleted_at = null;
    }
    return prisma.category.findMany({ where: whereClause });
  };

  public findOne = async (id: number) => {
    return prisma.category.findFirst({
      where: { id: id, deleted_at: null },
    });
  };
}
