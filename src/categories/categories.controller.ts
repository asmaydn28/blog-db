import { type Request, type Response } from 'express';
import CategoryService from './categories.service.js';

export default class CategoryController {
  private categoryService = new CategoryService();

  public create = async (req: any, res: Response) => {
    try {
      const categoryData = req.body;
      const user = req.user; 
      const newCategory = await this.categoryService.create(categoryData, user); 
      res.status(201).json(newCategory);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };

  public findAll = async (req: Request, res: Response) => {
    try {
      const filters = req.query;
      const categories = await this.categoryService.findAll(filters);
      res.status(200).json(categories);
    } catch (error: any) {
      res.status(500).json({ message: 'Kategoriler listelenirken bir hata oluştu.' });
    }
  };

  public findOne = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID parametresi eksik.' });
      }
      const categoryId = parseInt(id);
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        return res.status(404).json({ message: 'Kategori bulunamadı.' });
      }
      res.status(200).json(category);
    } catch (error: any) {
      res.status(500).json({ message: 'Kategori getirilirken bir hata oluştu.' });
    }
  };

  public update = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID parametresi eksik.' });
      }
      const categoryId = parseInt(id);      
      const categoryData = req.body;           
      const user = req.user;                     

      const updatedCategory = await this.categoryService.update(categoryId, categoryData, user);

      res.status(200).json(updatedCategory);
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };

  public delete = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ message: 'ID parametresi eksik.' });
      }
      const categoryId = parseInt(id);  
      const user = req.user;                 

      await this.categoryService.delete(categoryId, user);

      res.status(204).send();
    } catch (error: any) {
      res.status(403).json({ message: error.message });
    }
  };
}
