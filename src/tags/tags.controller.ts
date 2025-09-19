import type { Request, Response } from 'express';
import TagService from './tags.service.js';

export default class TagController {
  private tagService = new TagService();

  // Etiket oluşturma
  public create = async (req: any, res: Response) => {
  try {
    const tagData = req.body;
    const user = req.user;
    const newTag = await this.tagService.create(tagData, user);
    res.status(201).json(newTag);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
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
  public update = async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const tagData = req.body;
    const user = req.user;
    const updatedTag = await this.tagService.update(id, tagData, user);
    res.status(200).json(updatedTag);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
  // Etiket silme
  public delete = async (req: any, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = req.user;
    await this.tagService.delete(id, user);
    res.status(204).send();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
}
