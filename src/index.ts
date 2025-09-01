import express, { type Request, type Response } from 'express';
import db from './database/db.js';

const app = express();
const PORT = 3000;

app.get('/', async (_req: Request, res: Response) => {
  try {
   
    const result = await db.raw('SELECT now()');
    res.json({
      message: "Blog API'ye hoş geldiniz!",
      db_time: result.rows[0].now 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Veritabanı bağlantı hatası!' });
  }
});

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
