import { Router, type Request, type Response } from 'express';
import db from '../database/db.js'; // Veritabanı bağlantımız

// Yeni bir router nesnesi oluşturuyoruz.
const router = Router();

// --- 1. YENİ KATEGORİ OLUŞTURMA (CREATE) ---
// POST http://localhost:3000/categories
router.post('/', async (req: Request, res: Response) => {
  try {
    // İstek gövdesinden (body) 'category_name' alanını alıyoruz.
    const { category_name } = req.body;

    // Eğer 'category_name' gönderilmemişse, hata döndürüyoruz.
    if (!category_name) {
      return res.status(400).json({ message: 'Kategori adı (category_name) zorunludur.' });
    }

    // Veritabanına yeni kategoriyi ekliyoruz.
    // .returning('*') sayesinde eklenen kaydın tüm bilgilerini geri alıyoruz.
    const newCategory = await db('categories').insert({ category_name }).returning('*');

    // Başarılı olursa 201 (Created) status kodu ve oluşturulan kategoriyi döndürüyoruz.
    res.status(201).json(newCategory[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 2. TÜM KATEGORİLERİ LİSTELEME (READ ALL) ---
// GET http://localhost:3000/categories
router.get('/', async (req: Request, res: Response) => {
  try {
    // PDF'teki "soft delete" kuralı: deleted_at sütunu null olanları getir.
    const categories = await db('categories').whereNull('deleted_at').select('*');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 3. TEK BİR KATEGORİYİ GÖRÜNTÜLEME (READ ONE) ---
// GET http://localhost:3000/categories/1
router.get('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    // Hem ID'si eşleşen hem de silinmemiş olanı buluyoruz.
    const category = await db('categories').where({ id }).whereNull('deleted_at').first();

    if (category) {
      res.json(category);
    } else {
      // Kategori bulunamazsa 404 (Not Found) hatası döndürüyoruz.
      res.status(404).json({ message: 'Kategori bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 4. KATEGORİ GÜNCELLEME (UPDATE) ---
// PATCH http://localhost:3000/categories/1
router.patch('/:id', async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: 'Yeni kategori adı (category_name) zorunludur.' });
    }

    // Silinmemiş bir kategoriyi ID'ye göre güncelliyoruz.
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


// --- 5. KATEGORİ SİLME (SOFT DELETE) ---
// DELETE http://localhost:3000/categories/1
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


// Router'ı dışarıya açıyoruz ki index.ts'de kullanabilelim.
export default router;
