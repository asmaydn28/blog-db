import prisma from '../prisma.js';

export default class PostService {
  // Post oluşturma
  public create = async (postData: { title: string, content: string, category_id: number }, userId: number) => {
    
    return prisma.post.create({
        data: {
            title: postData.title,
            content: postData.content,
            category_id: postData.category_id,
            user_id: userId 
        }
    });
};

  // Postları listeleme
  public findAll = async (filters: { showDeleted?: string; onlyDeleted?: string }) => {
    const whereClause: any = {};
    if (filters.onlyDeleted === 'true') {
      whereClause.deleted_at = { not: null };
    } else if (filters.showDeleted !== 'true') {
      whereClause.deleted_at = null;
    }
    return prisma.post.findMany({ where: whereClause });
  };

  // Post detayını getirme
  public findOne = async (id: number) => {
    return prisma.post.findFirst({
      where: { id, deleted_at: null },
    });
  };

  // Post güncelleme
  public update = async (id: number, data: any) => {
    return prisma.post.update({
      where: { id },
      data,
    });
  };

  // Post silme
  public delete = async (id: number): Promise<boolean> => {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post || post.deleted_at) return false;
    await prisma.post.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  };

  // Gönderiye etiket ekleme (pivot tablo: postTag)
  public addTag = async (postId: number, tagId: number) => {
    const post = await prisma.post.findFirst({
      where: { id: postId, deleted_at: null },
    });
    if (!post) {
      throw new Error('Gönderi bulunamadı.');
    }
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });
    if (!tag) {
      throw new Error('Etiket bulunamadı.');
    }
    return prisma.postTag.create({
      data: {
        post_id: postId,
        tag_id: tagId,
      },
    });
  };

  // Gönderiden etiket çıkarma (pivot tablo: postTag)
  public removeTag = async (postId: number, tagId: number) => {
    return prisma.postTag.delete({
      where: {
        post_id_tag_id: {
          post_id: postId,
          tag_id: tagId,
        },
      },
    });
  };
}

