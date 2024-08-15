import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let token = null;
let tokenExpiration = null;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Token'ı sadece bir kez oluşturup 1 saat geçerli olacak şekilde ayarlıyoruz
      if (!token || new Date() > tokenExpiration) {
        const payload = { userId: 123, username: 'exampleUser' };
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h', algorithm:'HS256' });
        tokenExpiration = new Date(new Date().getTime() + 3600 * 1000); // 1 saat geçerlilik süresi
      }

      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
