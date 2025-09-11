import type { Request, Response } from 'express';
import TagService from './tags.service.js';

export default class TagController {
  private tagService = new TagService();

  // Etiket oluşturma
  public create = async (req: Request, res: Response) => {
    try {
      const tagData = req.body;
      const newTag = await this.tagService.create(tagData);
      res.status(201).json(newTag);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return res.status(400).json({ message: 'Bu isimde bir etiket zaten mevcut.' });
      }
      res.status(500).json({ message: error.message });
    }
  };

  // Etiketleri listeleme
  public findAll = async (req: Request, res: Response) => {
    try {
      const tags = await this.tagService.findAll();
      res.status(200).json(tags);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Etiket detayını getirme
  public findOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Etiket ID belirtilmelidir.' });
      }
      const tagId = parseInt(id);
      const tag = await this.tagService.findOne(tagId);
      if (!tag) {
        return res.status(404).json({ message: 'Etiket bulunamadı.' });
      }
      res.status(200).json(tag);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Etiket güncelleme
  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Etiket ID belirtilmelidir.' });
      }
      const tagId = parseInt(id);
      const tagData = req.body;
      const updatedTag = await this.tagService.update(tagId, tagData);
      res.status(200).json(updatedTag);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // Etiket silme
  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Etiket ID belirtilmelidir.' });
      }
      const tagId = parseInt(id);
      await this.tagService.delete(tagId);
      res.status(200).json({ message: 'Etiket başarıyla silindi.' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
