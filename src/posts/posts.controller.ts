import type { Request, Response } from 'express';
import PostService from './posts.service.js';

export default class PostController {
  private postService = new PostService();

  public create = async (req: Request, res: Response) => {
    try {
      const postData = req.body;
      const newPost = await this.postService.create(postData);
      res.status(201).json(newPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Tüm postları listeleme
  public findAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const posts = await this.postService.findAll(filters);
      res.status(200).json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Tek post getirme
  public findOne = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
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

  // Post güncelleme
  public update = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id, 10);
      const postData = req.body;
      const updatedPost = await this.postService.update(postId, postData);
      res.status(200).json(updatedPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Post silme
  public delete = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id, 10);
      const deleted = await this.postService.delete(postId);
      if (deleted) {
        return res.status(200).json({ message: "Post başarıyla silindi." });
      } else {
        return res.status(404).json({ message: "Böyle bir post bulunamadı." });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // YENİ FONKSİYON: Gönderiye etiket ekleme
  public addTag = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({ message: 'Post ID belirtilmelidir.' });
      }
      const postId = parseInt(id, 10);
      const { tag_id } = req.body;
      await this.postService.addTag(postId, tag_id);
      res.status(201).json({ message: 'Etiket gönderiye başarıyla eklendi.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // YENİ FONKSİYON: Gönderiden etiket çıkarma
  public removeTag = async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;
      const tagIdParam = req.params.tagId as string;
      if (!id || !tagIdParam) {
        return res.status(400).json({ message: 'Post ID ve Tag ID belirtilmelidir.' });
      }
      const postId = parseInt(id, 10);
      const tagId = parseInt(tagIdParam, 10);
      await this.postService.removeTag(postId, tagId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

