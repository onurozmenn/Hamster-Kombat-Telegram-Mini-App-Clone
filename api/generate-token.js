import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

// Token'ı oluşturup saklamak için gereken değişkenler
let token = null;
let tokenExpiration = null;

// Token oluşturma endpoint'i
app.get('/api/generate-token', (req, res) => {
  if (!token || new Date() > tokenExpiration) {
    const payload = { userId: 123, username: 'exampleUser' };
    token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    tokenExpiration = new Date(new Date().getTime() + 3600 * 1000); // 1 saat geçerlilik süresi
  }

  res.json({ token });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
