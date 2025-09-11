import prisma from '../prisma.js';

export default class TagService {
  // Etiket oluşturma
  public create = async (tagData: { name: string }) => {
    if (!tagData.name) {
      throw new Error('Etiket adı (name) zorunludur.');
    }
    return prisma.tag.create({
      data: {
        name: tagData.name,
      },
    });
  };

  // Etiketleri listeleme
  public findAll = async () => {
    return prisma.tag.findMany();
  };

  // Etiket detayını getirme
  public findOne = async (id: number) => {
    return prisma.tag.findUnique({
      where: { id: id },
    });
  };

  // Etiket güncelleme
  public update = async (id: number, tagData: { name?: string }) => {
    return prisma.tag.update({
      where: { id: id },
      data: tagData,
    });
  };

  // Etiket silme
  public delete = async (id: number) => {
    await prisma.postTag.deleteMany({
      where: { tag_id: id },
    });
    return prisma.tag.delete({
      where: { id },
    });
  };
}
