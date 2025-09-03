import { Router, type Request, type Response } from "express";
import db from "../database/db.js";

const router = Router();

// CREATE Comment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { post_id, content, commenter_name } = req.body;

    if (!post_id || !content || !commenter_name) {
      return res
        .status(400)
        .json({
          message:
            "Gönderi ID (post_id), içerik (content) ve yorum yapanın ismi (commenter_name) zorunludur.",
        });
    }

    // Yorumun ekleneceği gönderi mevcut mu ve silinmemiş mi kontrolü
    const postExists = await db("posts")
      .where({ id: post_id })
      .whereNull("deleted_at")
      .first();

    if (!postExists) {
      return res
        .status(400)
        .json({ message: "Geçersiz veya silinmiş bir gönderi IDsi." });
    }

    const newComment = await db("comments")
      .insert({ post_id, content, commenter_name })
      .returning("*");

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// GET All Comments (with filtering)
router.get("/", async (req, res) => {
  try {
    const { post, commenter } = req.query;
    let query = db("comments");

    if (post) {
      query = query.where({ post_id: post });
    }

    if (commenter) {
      // Büyük/küçük harf duyarsız arama için .whereRaw('LOWER(commenter_name) = ?', String(commenter).toLowerCase()) kullanılabilir.
      query = query.where({ commenter_name: commenter });
    }

    const comments = await query.select("*");
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// GET Comment by ID
router.get("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const comment = await db("comments").where({ id }).first();

    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: "Yorum bulunamadı." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// UPDATE Comment
router.patch("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const { content, commenter_name } = req.body;

    const updateData: { [key: string]: any } = {};
    if (content) updateData.content = content;
    if (commenter_name) updateData.commenter_name = commenter_name;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ message: "Güncellenecek en az bir alan sağlamalısınız." });
    }

    const updatedComment = await db("comments")
      .where({ id })
      .update(updateData)
      .returning("*");

    if (updatedComment.length > 0) {
      res.json(updatedComment[0]);
    } else {
      res.status(404).json({ message: "Güncellenecek yorum bulunamadı." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

// DELETE Comment (Hard)
router.delete("/:id", async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await db("comments").where({ id }).del();

    if (deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Silinecek yorum bulunamadı." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
});

export default router;