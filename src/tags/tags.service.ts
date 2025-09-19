import prisma from "../prisma.js";

type UserPayload = {
  id: number;
  role: string;
};

export default class TagService {
  // CREATE - Sadece admin
  public create = async (tagData: { name: string }, user: UserPayload) => {
    // --- YETKİLENDİRME KONTROLÜ ---
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    if (!tagData.name) {
      throw new Error('Etiket adı (name) zorunludur.');
    }
    return prisma.tag.create({
      data: { name: tagData.name }
    });
  };

  // UPDATE - Sadece admin
  public update = async (id: number, tagData: { name?: string }, user: UserPayload) => {
    // --- YETKİLENDİRME KONTROLÜ ---
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }
    
    if (!tagData.name) {
      throw new Error('Etiket adı (name) boş olamaz.');
    }

    return prisma.tag.update({
      where: { id: id },
      data: { name: tagData.name }
    });
  };

  // DELETE - Sadece admin  
  public delete = async (id: number, user: UserPayload) => {
    // --- YETKİLENDİRME KONTROLÜ ---
    if (user.role !== 'admin') {
      throw new Error('Bu işlemi yapmak için yetkiniz yok (Admin rolü gereklidir).');
    }

    // Tags tablosunda deleted_at yok, hard delete
    return prisma.tag.delete({
      where: { id: id }
    });
  };

  // FINDALL - Herkese açık (değişmez)
  public findAll = async () => {
    return prisma.tag.findMany();
  };

  // FINDONE - Herkese açık (değişmez)
  public findOne = async (id: number) => {
    return prisma.tag.findUnique({
      where: { id: id }
    });
  };
}