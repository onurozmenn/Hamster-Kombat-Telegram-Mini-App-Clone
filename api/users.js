import { MongoClient } from 'mongodb';

// MongoDB bağlantı dizesini çevresel değişkenlerden alır
const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // MongoDB'ye bağlan
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
