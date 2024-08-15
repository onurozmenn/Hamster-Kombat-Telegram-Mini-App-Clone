import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

// MongoDB bağlantı dizesini çevresel değişkenlerden alır
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const { method } = req;
  

  try {
    // JWT token doğrulama
    await client.connect();
    const database = client.db('Users'); // Veritabanı adı
    const collection = database.collection('Users'); // Koleksiyon adı

    switch (method) {
      case 'GET':
        const { ids } = req.query;
        console.log("asd"+ids);
        if (ids) {
          // Belirli bir ID'ye göre kullanıcıyı bul
          const user = await collection.findOne({ telegramID: ids });
          
          if (user) {
            res.status(200).json(user); // Kullanıcıyı döndür
          } else {
            console.log("asd"+ids);
            res.status(404).json({ error: `User not found ${ids}` });
          }
        } else {
          // Tüm kullanıcıları döndür
          const users = await collection.find({}).toArray();
          res.status(200).json(users);
        }
        break;
      case 'POST':
        const user = req.body; // Gönderilen kullanıcı verilerini al
        await collection.insertOne(user); // Yeni kullanıcı ekle
        res.status(201).json({ message: 'User created successfully' });
        break;

      case 'PUT':
        const { id, ...updatedData } = req.body;
        await collection.updateOne({ _id: id }, { $set: updatedData });
        res.status(200).json({ message: 'User updated successfully' });
        break;

      case 'DELETE':
        const { userId } = req.body;
        await collection.deleteOne({ _id: userId });
        res.status(200).json({ message: 'User deleted successfully' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ error: 'Invalid or expired token' });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } finally {
    await client.close(); // Bağlantıyı kapat
  }
}