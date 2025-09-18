import prisma from '../prisma.js';

type UserPayload = {
  id: number;
  role: string;
};

export default class PostService {
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

  public findAll = async (filters: { showDeleted?: string; onlyDeleted?: string }) => {
    const whereClause: any = {};
    if (filters.onlyDeleted === 'true') {
      whereClause.deleted_at = { not: null };
    } else if (filters.showDeleted !== 'true') {
      whereClause.deleted_at = null;
    }
    return prisma.post.findMany({ where: whereClause });
  };

  public findOne = async (id: number) => {
    return prisma.post.findFirst({
      where: { id, deleted_at: null },
    });
  };

  public update = async (id: number, postData: any, user: UserPayload) => {
    const post = await prisma.post.findUnique({
      where: { id: id, deleted_at: null }
    });

    if (!post) {
      throw new Error('Gönderi bulunamadı.');
    }

    // Yetkilendirme:
    // - Gönderi sahibi kendi gönderisini düzenleyebilir.
    // - Moderator başkasının gönderisini düzenleyebilir.
    // - Admin her şeyi yapabilir.
    const isOwner = post.user_id === user.id;
    const isModerator = user.role === 'moderator';
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isModerator && !isAdmin) {
      throw new Error('Bu gönderiyi düzenlemek için yetkiniz yok.');
    }

    return prisma.post.update({
      where: { id: id },
      data: {
        title: postData.title,
        content: postData.content,
        category_id: postData.category_id,
      },
    });
  };

  public delete = async (id: number, user: UserPayload) => {
    const post = await prisma.post.findUnique({
      where: { id: id, deleted_at: null }
    });

    if (!post) {
      throw new Error('Gönderi bulunamadı.');
    }

    // Yetkilendirme: Sadece gönderi sahibi veya admin silebilir.
    const isOwner = post.user_id === user.id;
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new Error('Bu gönderiyi silmek için yetkiniz yok.');
    }

    return prisma.post.update({
      where: { id: id },
      data: { deleted_at: new Date() },
    });
  };

  public addTag = async (postId: number, tagId: number, user: UserPayload) => {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Gönderi bulunamadı.');
    }

    // Yetkilendirme: Gönderi sahibi veya moderator/admin etiket ekleyebilir.
    const isOwner = post.user_id === user.id;
    const isModerator = user.role === 'moderator';
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isModerator && !isAdmin) {
      throw new Error('Bu gönderiye etiket eklemek için yetkiniz yok.');
    }

    return prisma.postTag.create({
      data: { post_id: postId, tag_id: tagId }
    });
  };

  public removeTag = async (postId: number, tagId: number, user: UserPayload) => {
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      throw new Error('Gönderi bulunamadı.');
    }

    // Yetkilendirme: Gönderi sahibi veya moderator/admin etiket çıkarabilir.
    const isOwner = post.user_id === user.id;
    const isModerator = user.role === 'moderator';
    const isAdmin = user.role === 'admin';

    if (!isOwner && !isModerator && !isAdmin) {
      throw new Error('Bu gönderiden etiket çıkarmak için yetkiniz yok.');
    }

    return prisma.postTag.delete({
      where: {
        post_id_tag_id: { post_id: postId, tag_id: tagId }
      }
    });
  };
}