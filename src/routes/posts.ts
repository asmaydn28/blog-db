import { Router } from 'express';
import db from '../database/db.js';

const router = Router();

// CREATE Post
router.post('/', async (req, res) => {
  try {
    const { title, content, category_id } = req.body;

    if (!title || !content || !category_id) {
      return res.status(400).json({ message: 'Başlık (title), içerik (content) ve kategori ID (category_id) zorunludur.' });
    }

    // Kategori var mı ve silinmemiş mi kontrolü
    const categoryExists = await db('categories')
      .where({ id: category_id })
      .whereNull('deleted_at')
      .first();

    if (!categoryExists) {
      return res.status(400).json({ message: 'Geçersiz veya silinmiş bir kategori IDsi.' });
    }

    const newPost = await db('posts')
      .insert({ title, content, category_id })
      .returning('*');
      
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// GET All Posts (with filtering)
router.get('/', async (req, res) => {
  try {
    const { category, status, showDeleted, onlyDeleted } = req.query;

    let query = db('posts');

    if (category) {
      query = query.where({ category_id: category });
    }

    if (status === 'published') {
      query = query.whereNotNull('published_at'); 
    } else if (status === 'draft') {
      query = query.whereNull('published_at'); 
    }

    if (onlyDeleted === 'true') {
      query = query.whereNotNull('deleted_at');
    } else if (showDeleted !== 'true') {
      query = query.whereNull('deleted_at');
    }

    const posts = await query.select('*');
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
});

// GET Post by ID
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

// UPDATE Post
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category_id, published_at } = req.body;

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

// DELETE Post (Soft)
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