import express from 'express';
import categoryRoutes from './categories/categories.routes.js';
import postRoutes from './posts/posts.routes.js';
import commentRoutes from './comments/comments.routes.js';
import tagRoutes from './tags/tags.routes.js';
import userRoutes from './users/users.routes.js';
import authRoutes from './auth/auth.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/categories', categoryRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/tags', tagRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});
