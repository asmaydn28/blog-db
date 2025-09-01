import express from 'express';
import db from './database/db.js'; 
import categoryRoutes from './routes/categories.js';

const app = express();
const PORT = 3000;

// ÇOK ÖNEMLİ: Gelen isteklerin body'sindeki JSON verilerini
// Express'in anlayabilmesi için bu middleware'i ekliyoruz.
// Bu olmadan POST ve PATCH isteklerindeki verileri okuyamayız.
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "API çalışıyor." });
});

app.use('/categories', categoryRoutes);

app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor.`);
});