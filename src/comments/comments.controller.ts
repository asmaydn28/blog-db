import type { Request, Response } from 'express';
import CommentService from './comments.service.js';

export default class CommentController {
  private commentService = new CommentService();
  
  public create = async (req: any, res: Response) => {
    try {
      const commentData = req.body;
      commentData.commenter_name = req.user.name;
      const newComment = await this.commentService.create(commentData, req.user.id);
      res.status(201).json(newComment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const comments = await this.commentService.findAll(req.query);
      res.status(200).json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

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

  public update = async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const commentData = req.body;
    const user = req.user;
    
    const updatedComment = await this.commentService.update(id, commentData, user);
    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

  public delete = async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    
    await this.commentService.delete(id, user);
    res.status(204).send();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
}
