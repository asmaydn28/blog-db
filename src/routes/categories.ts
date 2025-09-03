import { Router, type Request, type Response } from 'express';
import db from '../database/db.js';

const router = Router();

// CREATE Category
router.post('/', async (req: Request, res: Response) => {
  try {
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: 'Kategori adı (category_name) zorunludur.' });
    }

    // .returning('*') sayesinde eklenen kaydın tüm bilgilerini geri alıyoruz.
    const newCategory = await db('categories').insert({ category_name }).returning('*');

    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// GET All Categories (with filtering)
router.get('/', async (req, res) => {
  try {
    const { showDeleted, onlyDeleted } = req.query;
    let query = db('categories');

    if (onlyDeleted === 'true') {
      // Sadece silinmiş olanları getir: deleted_at null OLMAYANLAR
      query = query.whereNotNull('deleted_at');
    } else if (showDeleted !== 'true') {
      // Varsayılan durum (parametre yok veya showDeleted=false):
      // Sadece silinmemiş olanları getir: deleted_at null OLANLAR
      query = query.whereNull('deleted_at');
    }
    // showDeleted === 'true' ise hiçbir where koşulu eklemiyoruz,
    // böylece tüm kayıtlar (silinmiş ve silinmemiş) geliyor.

    const categories = await query.select('*');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// GET Category by ID
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const category = await db('categories').where({ id }).whereNull('deleted_at').first();

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// UPDATE Category
router.patch('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: 'Yeni kategori adı (category_name) zorunludur.' });
    }

    const updatedCategory = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .update({ category_name })
      .returning('*');
    
    // update metodu, etkilenen satır yoksa boş array döner.
    if (updatedCategory.length > 0) {
      res.json(updatedCategory[0]);
    } else {
      res.status(404).json({ message: 'Güncellenecek kategori bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// DELETE Category (Soft)
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    // Gerçekten silmiyoruz, sadece 'deleted_at' sütununu o anki zamanla güncelliyoruz.
    const deletedCount = await db('categories')
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() });

    if (deletedCount > 0) {
      // Başarılı silme işleminden sonra genelde 204 (No Content) status kodu döndürülür.
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Silinecek kategori bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

export default router;