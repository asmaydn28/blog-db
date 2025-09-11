import prisma from '../prisma.js';

export default class CommentService {
  public create = async (commentData: {
    post_id: number;
    content: string;
    commenter_name: string;
  }) => {
    if (!commentData.post_id || !commentData.content || !commentData.commenter_name) {
      throw new Error('post_id, content ve commenter_name zorunludur.');
    }
    return prisma.comment.create({
      data: {
        post_id: commentData.post_id,
        content: commentData.content,
        commenter_name: commentData.commenter_name,
      },
    });
  };

  // Yorumları listeleme
  public findAll = async () => {
    return prisma.comment.findMany();
  };

  // Yorum detayını getirme
  public findOne = async (id: number) => {
    return prisma.comment.findUnique({ where: { id } });
  };

  // Yorum güncelleme
  public update = async (id: number, data: any) => {
    return prisma.comment.update({
      where: { id },
      data,
    });
  };

  // Yorum silme
  public delete = async (id: number): Promise<boolean> => {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return false;
    await prisma.comment.delete({ where: { id } });
    return true;
  };
}
