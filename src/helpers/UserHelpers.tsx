import axios from 'axios';
import { useState } from 'react';

interface UserData {
  // UserData arayüzü, API'den beklenen verilerin yapısını tanımlar.
  id: string;
  name: string;
  email: string;
  // Diğer alanlar buraya eklenebilir
}

const [userData, setUserData] = useState<UserData | null>(null)
const fetchUserData = async (token: string) => {
    if (token) {
        try {
          const response = await axios.get('https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
          return userData;
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
};

export default fetchUserData;
