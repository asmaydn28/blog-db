import prisma from '../prisma.js';

type UserPayload = {
  id: number;
  role: string;
};

export default class CommentService {
  public create = async (commentData: any, userId: number) => {
    if (!commentData.content || !commentData.post_id) {
      throw new Error('İçerik ve gönderi ID zorunludur.');
    }
    
    return prisma.comment.create({
      data: {
        content: commentData.content,
        commenter_name: commentData.commenter_name,
        post_id: commentData.post_id,
        user_id: userId,
      }
    });
  };

  public findAll = async (filters: any) => {
    const whereClause: any = {};
    
    if (filters.post) {
      whereClause.post_id = parseInt(filters.post);
    }
    if (filters.commenter) {
      whereClause.commenter_name = filters.commenter;
    }
    
    // Varsayılan olarak sadece silinmemiş yorumları getir.
    // `onlyDeleted=true` sadece silinmişleri getirir.
    // `showDeleted=true` silinmiş ve silinmemiş tüm yorumları getirir.
    if (filters.onlyDeleted === 'true') {
      whereClause.deleted_at = { not: null };
    } else if (filters.showDeleted !== 'true') {
      whereClause.deleted_at = null;
    }

    return prisma.comment.findMany({
      where: whereClause
    });
  };

  public findOne = async (id: number) => {
    return prisma.comment.findFirst({
      where: { id: id, deleted_at: null }
    });
  };

  public update = async (id: number, commentData: any, user: UserPayload) => {
    const comment = await prisma.comment.findUnique({
      where: { id: id, deleted_at: null }
    });

    if (!comment) {
      throw new Error('Yorum bulunamadı.');
    }

    // Yetkilendirme: Sadece yorumun sahibi kendi yorumunu güncelleyebilir.
    if (comment.user_id !== user.id) {
      throw new Error('Bu yorumu düzenlemek için yetkiniz yok.');
    }

    return prisma.comment.update({
      where: { id: id },
      data: {
        content: commentData.content,
        // Güvenlik nedeniyle `commenter_name` güncellenemez.
      },
    });
  };

  public delete = async (id: number, user: UserPayload) => {
    const comment = await prisma.comment.findUnique({
      where: { id: id, deleted_at: null },
      include: {
        post: true,
      }
    });

    if (!comment) {
      throw new Error('Yorum bulunamadı.');
    }

    // Silme için yetkilendirme kuralları:
    // 1. Yorum sahibi kendi yorumunu silebilir.
    // 2. Gönderi sahibi, gönderisindeki yorumları silebilir.
    // 3. 'moderator' ve 'admin' rolündekiler tüm yorumları silebilir.
    const isCommentOwner = comment.user_id === user.id;
    const isPostOwner = comment.post.user_id === user.id;
    const isModerator = user.role === 'moderator';
    const isAdmin = user.role === 'admin';

    if (!isCommentOwner && !isPostOwner && !isModerator && !isAdmin) {
      throw new Error('Bu yorumu silmek için yetkiniz yok.');
    }

    // Yorumu geçici olarak sil (soft delete).
    return prisma.comment.update({
      where: { id: id },
      data: { deleted_at: new Date() }
    });
  };
}