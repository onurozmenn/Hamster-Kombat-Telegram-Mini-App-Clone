import express from 'express';
import jwt from 'jsonwebtoken';

// Token'ı oluşturup saklamak için gereken değişkenler
let token = null;
let tokenExpiration = null;
export default async function handler(req, res) {
    const { method } = req;
    if (method=== 'POST') {
      try {
        app.get('/api/generate-token', (req, res) => {
            if (!token || new Date() > tokenExpiration) {
            const payload = { userId: 123, username: 'exampleUser' };
            token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            tokenExpiration = new Date(new Date().getTime() + 3600 * 1000); // 1 saat geçerlilik süresi
            }
        
            res.json({ token });
        });
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