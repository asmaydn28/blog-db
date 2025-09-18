import type { Request, Response } from 'express';
import PostService from './posts.service.js';

export default class PostController {
  private postService = new PostService();

  public create = async (req: any, res: Response) => { 
    try {
        const postData = req.body;
        const userId = req.user.id; 
        const newPost = await this.postService.create(postData, userId); 
        res.status(201).json(newPost);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

  public findAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const posts = await this.postService.findAll(filters);
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public findOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id, 10);
      const post = await this.postService.findOne(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post bulunamadı.' });
      }
      res.status(200).json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public update = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id);
      const postData = req.body;
      const user = req.user;

      const updatedPost = await this.postService.update(postId, postData, user);
      res.status(200).json(updatedPost);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };

  public delete = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id);
      const user = req.user;

      await this.postService.delete(postId, user);
      res.status(204).send();
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };

  public addTag = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id);
      const { tag_id } = req.body;
      const user = req.user;

      await this.postService.addTag(postId, tag_id, user);
      res.status(201).json({ message: 'Etiket gönderiye başarıyla eklendi.' });
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };

  public removeTag = async (req: any, res: Response) => {
    try {
      const { id, tagId } = req.params;
      if (!id || !tagId) {
        return res.status(400).json({ message: 'Post ID ve Tag ID belirtilmelidir.' });
      }
      const postId = parseInt(id);
      const tagIdInt = parseInt(tagId);
      const user = req.user;

      await this.postService.removeTag(postId, tagIdInt, user);
      res.status(204).send();
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };
}
