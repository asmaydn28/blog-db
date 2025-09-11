import type { Request, Response } from 'express';
import CommentService from './comments.service.js';

export default class CommentController {
  private commentService = new CommentService();
  public create = async (req: Request, res: Response) => {
    try {
      const commentData = req.body;
      const newComment = await this.commentService.create(commentData);
      res.status(201).json(newComment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Yorumları listeleme
  public findAll = async (req: Request, res: Response) => {
    try {
      const comments = await this.commentService.findAll();
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Yorum detayını getirme
  public findOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Yorum ID belirtilmelidir.' });
      }
      const commentId = parseInt(id);
      const comment = await this.commentService.findOne(commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Yorum bulunamadı.' });
      }
      res.status(200).json(comment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Yorum güncelleme
  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Yorum ID belirtilmelidir.' });
      }
      const commentId = parseInt(id);
      const commentData = req.body;
      const updatedComment = await this.commentService.update(commentId, commentData);
      res.status(200).json(updatedComment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Yorum silme
  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Yorum ID belirtilmelidir.' });
      }
      const commentId = parseInt(id);
      const deleted = await this.commentService.delete(commentId);
      if (deleted) {
        return res.status(200).json({ message: "Yorum başarıyla silindi." });
      } else {
        return res.status(404).json({ message: "Böyle bir yorum bulunamadı." });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
