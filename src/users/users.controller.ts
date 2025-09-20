import type { Request, Response } from 'express';
import UserService from './users.service.js';

export default class UserController {
  private userService = new UserService();

  public findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.findAll();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: 'ID parametresi eksik.' });
        return;
      }
      const userId = parseInt(id);
      if (isNaN(userId)) {
        res.status(400).json({ message: 'Geçersiz ID formatı.' });
        return;
      }
      const user = await this.userService.findOne(userId);
      if (!user) {
        res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  public create = async (req: any, res: Response): Promise<void> => {
  try {
    const userData = req.body;
    const user = req.user; 
    const newUser = await this.userService.create(userData, user);
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};

  public update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'ID parametresi eksik.' });
      return;
    }
    const userId = parseInt(id);
    const userData = req.body;
    const user = (req as any).user; // Middleware'den gelen kullanıcı
    
    const updatedUser = await this.userService.update(userId, userData, user);
    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    } else {
      res.status(403).json({ message: error.message });
    }
  }
};


  

  public delete = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'ID parametresi eksik.' });
      return;
    }
    const userId = parseInt(id);
    const user = (req as any).user;
    
    await this.userService.delete(userId, user);
    res.status(204).send();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
};
}
