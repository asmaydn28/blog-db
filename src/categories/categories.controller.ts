import type { Request, Response } from 'express';
import CategoryService from './categories.service.js';

export default class CategoryController {
  private categoryService = new CategoryService();

  // YENİ KATEGORİ OLUŞTURMA
  public create = async (req: Request, res: Response) => {
    try {
      const categoryData = req.body;
      const newCategory = await this.categoryService.create(categoryData);
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // TÜM KATEGORİLERİ LİSTELEME
  public findAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const categories = await this.categoryService.findAll(filters);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // TEK KATEGORİ GETİRME
  public findOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Kategori ID\'si belirtilmelidir.' });
      }
      const categoryId = parseInt(id);
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Kategori bulunamadı.' });
      }
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // KATEGORİ GÜNCELLEME
  public update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Kategori ID\'si belirtilmelidir.' });
      }
      const categoryId = parseInt(id);
      const categoryData = req.body;
      const updatedCategory = await this.categoryService.update(categoryId, categoryData);
      res.status(200).json(updatedCategory);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  // KATEGORİ SİLME
  public delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'Kategori ID\'si belirtilmelidir.' });
      }
      const categoryId = parseInt(id);
      const deleted = await this.categoryService.delete(categoryId);
      if (deleted) {
        return res.status(200).json({ message: "Kategori başarıyla silindi." });
      } else {
        return res.status(404).json({ message: "Böyle bir kategori bulunamadı." });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
