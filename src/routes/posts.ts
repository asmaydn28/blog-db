import { Router } from 'express';
import db from '../database/db.js';

const router = Router();

// --- 1. YENİ GÖNDERİ OLUŞTURMA (CREATE) ---
// POST http://localhost:3000/posts
router.post('/', async (req, res) => {
  try {
    const { title, content, category_id } = req.body;

    // Temel alanların kontrolü
    if (!title || !content || !category_id) {
      return res.status(400).json({ message: 'Başlık (title), içerik (content) ve kategori ID (category_id) zorunludur.' });
    }

    // İLİŞKİ KONTROLÜ: Gönderinin ekleneceği kategori mevcut mu ve silinmemiş mi?
    const categoryExists = await db('categories')
      .where({ id: category_id })
      .whereNull('deleted_at')
      .first();

    if (!categoryExists) {
      return res.status(400).json({ message: 'Geçersiz veya silinmiş bir kategori IDsi.' });
    }

    // Tüm kontrollerden geçtiyse veritabanına ekle
    const newPost = await db('posts')
      .insert({ title, content, category_id })
      .returning('*');
      
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 2. TÜM GÖNDERİLERİ LİSTELEME (READ ALL) ---
// GET http://localhost:3000/posts
router.get('/', async (req, res) => {
  try {
    // Sadece silinmemiş gönderileri listele
    const posts = await db('posts').whereNull('deleted_at').select('*');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 3. TEK BİR GÖNDERİYİ GÖRÜNTÜLEME (READ ONE) ---
// GET http://localhost:3000/posts/1
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db('posts').where({ id }).whereNull('deleted_at').first();

    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Gönderi bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 4. GÖNDERİ GÜNCELLEME (UPDATE) ---
// PATCH http://localhost:3000/posts/1
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, published_at } = req.body;

    // Güncellenecek veriyi tutmak için bir nesne oluşturuyoruz.
    const updateData: { [key: string]: any } = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (published_at) updateData.published_at = published_at;

    // Eğer kategori değiştirilmek isteniyorsa, yeni kategorinin geçerliliğini kontrol et.
    if (category_id) {
      const categoryExists = await db('categories').where({ id: category_id }).whereNull('deleted_at').first();
      if (!categoryExists) {
        return res.status(400).json({ message: 'Geçersiz veya silinmiş bir kategori IDsi.' });
      }
      updateData.category_id = category_id;
    }
    
    // Güncellenecek bir veri yoksa hata döndür.
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'Güncellenecek en az bir alan sağlamalısınız.' });
    }

    const updatedPost = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .update(updateData)
      .returning('*');

    if (updatedPost.length > 0) {
      res.json(updatedPost[0]);
    } else {
      res.status(404).json({ message: 'Güncellenecek gönderi bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


// --- 5. GÖNDERİ SİLME (SOFT DELETE) ---
// DELETE http://localhost:3000/posts/1
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await db('posts')
      .where({ id })
      .whereNull('deleted_at')
      .update({ deleted_at: new Date() });

    if (deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Silinecek gönderi bulunamadı.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});


export default router;
