import prisma from '../prisma.js';

export default class PostService {
  // Post oluşturma
  public create = async (postData: {
    category_id: number;
    title: string;
    content: string;
    published_at?: Date | null;
  }) => {
    if (!postData.category_id || !postData.title || !postData.content) {
      throw new Error('category_id, title ve content zorunludur.');
    }
    return prisma.post.create({
      data: {
        category_id: postData.category_id,
        title: postData.title,
        content: postData.content,
        published_at: postData.published_at ?? null,
      },
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

  // Gönderiye etiket ekleme
  public addTag = async (postId: number, tagId: number) => {
    // Prisma ile ilişki tablosuna (posts_tags) yeni bir kayıt ekliyoruz.
    // Bu kadar basit!
    return prisma.postTag.create({
      data: {
        post_id: postId,
        tag_id: tagId,
      },
    });
  };

  // Gönderiden etiket çıkarma
  public removeTag = async (postId: number, tagId: number) => {
    // Prisma ile ilişki tablosundan ilgili kaydı siliyoruz.
    // 'where' içinde, şemada tanımladığımız bileşik anahtarı (@id([post_id, tag_id]))
    // kullanarak tam olarak hangi kaydı sileceğimizi belirtiyoruz.
    return prisma.postTag.delete({
      where: {
        post_id_tag_id: { // Prisma bu ismi bizim için otomatik oluşturur.
          post_id: postId,
          tag_id: tagId,
        },
      },
    });
  };
}

