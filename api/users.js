import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

// MongoDB bağlantı dizesini çevresel değişkenlerden alır
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  const { method } = req;
  
  // Authorization header'dan JWT token'ı al
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  try {
    // JWT token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {algorithm:'HS256'});
    await client.connect();
    const database = client.db('Users'); // Veritabanı adı
    const collection = database.collection('Users'); // Koleksiyon adı

    switch (method) {
      case 'GET':
        const { ids } = req.query;

        if (ids) {
          // Belirli bir ID'ye göre kullanıcıyı bul
          const user = await collection.findOne({ telegramID: ids });
          
          if (user) {
            res.status(200).json(user); // Kullanıcıyı döndür
          } else {
            res.status(404).json({ error: 'User not found' });
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
          const { updatedData } = req.body;  // Bu satırı doğru aldığınızdan emin olun.
          const telegramID = req.query.ids;
      
          if (!telegramID || !updatedData) {
              res.status(400).json({ error: 'Missing telegramID or updatedData' });
              break;
          }
      
          const result = await collection.updateOne({ telegramID: telegramID }, { $set: updatedData });
      
          if (result.matchedCount === 0) {
              res.status(404).json({ error: 'User not found' });
          } else {
              res.status(200).json({ message: 'User updated successfully' });
          }
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
