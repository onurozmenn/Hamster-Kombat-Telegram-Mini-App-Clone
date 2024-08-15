import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import express from 'express';

const app = express();
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const JWT_SECRET = process.env.JWT_SECRET;

app.use(async (req, res, next) => {
  // Authorization header'dan JWT token'ı al
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // JWT token doğrulama
    jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid or expired token' });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

app.get('/api/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Users'); // Veritabanı adı
    const collection = database.collection('Users'); // Koleksiyon adı
    const users = await collection.find({}).toArray(); // Verileri çek
    res.status(200).json(users); // Verileri döndür
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close(); // Bağlantıyı kapat
  }
});

app.post('/api/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Users');
    const collection = database.collection('Users');
    const user = req.body; // Gönderilen kullanıcı verilerini al
    await collection.insertOne(user); // Yeni kullanıcı ekle
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close(); // Bağlantıyı kapat
  }
});

app.put('/api/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Users');
    const collection = database.collection('Users');
    const { id, ...updatedData } = req.body;
    await collection.updateOne({ _id: id }, { $set: updatedData });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close(); // Bağlantıyı kapat
  }
});

app.delete('/api/users', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Users');
    const collection = database.collection('Users');
    const { userId } = req.body;
    await collection.deleteOne({ _id: userId });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close(); // Bağlantıyı kapat
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
