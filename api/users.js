import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { username, password } = req.body;
      
      await client.connect();
      const database = client.db('Users');
      const collection = database.collection('Users');
      
      const user = await collection.findOne({ username });

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else if (req.method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Authorization token required' });
      }

      const decoded = await verifyToken(token);
      await client.connect();
      const database = client.db('Users');
      const collection = database.collection('Users');
      const user = await collection.findOne({ _id: decoded.id });

      res.status(200).json(user);
    } catch (error) {
      res.status(401).json({ error: error.message });
    } finally {
      await client.close();
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
