import type { Request, Response } from 'express';
import AuthService from './auth.service.js';

export default class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const userData = req.body;
      const newUser = await this.authService.register(userData);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginData = req.body;
      const tokens = await this.authService.login(loginData);

      if (!tokens) {
        res.status(401).json({ message: 'Geçersiz kullanıcı adı veya parola.' });
        return;
      }

      res.status(200).json(tokens);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        res.status(400).json({ message: 'Refresh token zorunludur.' });
        return;
      }

      const newTokens = await this.authService.refresh(refreshToken);

      if (!newTokens) {
        res.status(401).json({ message: 'Geçersiz veya süresi dolmuş refresh token.' });
        return;
      }

      res.status(200).json(newTokens);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}
