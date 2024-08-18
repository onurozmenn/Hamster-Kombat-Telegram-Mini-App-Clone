'use client'
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, hamsterCoin, mainCharacter } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';
import axios from 'axios';
import WebApp from '@twa-dev/sdk'
import { PurchaseModal, TeamCard } from './icons/TeamCard';
import { MinerData, minerList } from './utils/Miners';

const App: React.FC = () => {
  const levelNames = [
    "Bronze",    // From 0 to 4999 coins
    "Silver",    // From 5000 coins to 24,999 coins
    "Gold",      // From 25,000 coins to 99,999 coins
    "Platinum",  // From 100,000 coins to 999,999 coins
    "Diamond",   // From 1,000,000 coins to 2,000,000 coins
    "Epic",      // From 2,000,000 coins to 10,000,000 coins
    "Legendary", // From 10,000,000 coins to 50,000,000 coins
    "Master",    // From 50,000,000 coins to 100,000,000 coins
    "GrandMaster", // From 100,000,000 coins to 1,000,000,000 coins
    "Lord"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Bronze
    5000,     // Silver
    25000,    // Gold
    100000,   // Platinum
    1000000,  // Diamond
    2000000,  // Epic
    10000000, // Legendary
    50000000, // Master
    100000000,// GrandMaster
    1000000000// Lord
  ];

  interface UserData {
    telegramID: string;
    first_name: string;
    username?: string;
    language_code: string;
    profitPerHour: number;
    minerData: MinerData;
  }
  useEffect(() => {
    const tgData = WebApp.initDataUnsafe.user;
    const userDatas: UserData = {
      telegramID: tgData?.id!.toString()!,
      first_name: tgData?.first_name!,
      username: tgData?.username || '',
      language_code: tgData?.language_code!,
      profitPerHour: 0,
      minerData: { ceo: 0, marketing: 0 }
    };

    setUserData(userDatas);
    setTelegramData(true);
    console.log("telegram data değişti");
    handleScreenChange("exchange");
    setProfitPerHour(0);
  }, [])

  const [userData, setUserData] = useState<UserData | null>(null)
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [telegramData, setTelegramData] = useState<Boolean | null>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 1;
  const [profitPerHour, setProfitPerHour] = useState(0);
  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
    setTimeout(() => {
      card.style.transform = '';
    }, 100);

    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };
  const pointsRef = useRef(points);

  useEffect(() => {
    pointsRef.current = points;
  }, [points]);

  useEffect(() => {
    const updateCoin = async () => {
      try {
        await axios.put(
          `https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users?ids=${userData?.telegramID}`,
          {
            updatedData: {
              coin: pointsRef.current,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("API isteği gönderildi.");
      } catch (error) {
        console.log(error);
      }
    };

    const interval = setInterval(() => {
      if (pointsRef.current > 0) {
        updateCoin();
      }
    }, 5000); // Her 3 saniyede bir isteği gönder

    return () => clearInterval(interval); // Component unmount olduğunda interval'i temizle
  }, [userData?.telegramID, token]);
  useEffect(() => {
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const interval = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [profitPerHour]);


  useEffect(() => {
    const createToken = async () => {
      try {
        const response = await axios.post('https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/generate-token');
        console.log("token created");
        setToken(response.data.token);

        // Fetch user data only after the token is successfully generated
        fetchUserData(response.data.token);
      } catch (error) {
        console.error('Error fetching token:', error);
      }
    };

    const fetchUserData = async (generatedToken: string) => {
      console.log("fetch triggered");
      if (generatedToken) {
        try {
          const response = await axios.get(`https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users?ids=${userData?.telegramID}`, {
            headers: {
              Authorization: `Bearer ${generatedToken}`,
            },
          });
          setUserData(response.data);
          setPoints(response.data["coin"]);
          setProfitPerHour(response.data["profitPerHour"]);

          if (userData?.first_name !== response.data["first_name"] ||
            userData?.username !== response.data["username"]) {
            await axios.put(`https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users?ids=${userData?.telegramID}`, {
              updatedData: {
                first_name: userData?.first_name,
                username: userData?.username
              }
            }, {
              headers: {
                Authorization: `Bearer ${generatedToken}`,
              },
            });
            const updatedData = {
              first_name: userData?.first_name,
              language_code: userData?.language_code,
              username: userData?.username,
              telegramID: userData?.telegramID,
              minerData: userData?.minerData,
              profitPerHour: userData?.profitPerHour
            }
            setUserData(updatedData as UserData);
            console.log(response.data);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 404) {
              console.log('User not found');

              try {
                const response = await axios.post('https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users', {
                  telegramID: userData?.telegramID,
                  first_name: userData?.first_name,
                  username: userData?.username,
                  language_code: userData?.language_code,
                  coin: 0,
                  profitPerHour: 0,
                }, {
                  headers: {
                    Authorization: `Bearer ${generatedToken}`,
                  },
                });
                console.log(response.data);
              } catch (error) {
                console.log(error);
              } finally {
                console.log("User created!");
              }
            } else {
              console.log('An error occurred');
            }
          } else {
            console.log('An unexpected error occurred');
          }
        } finally {
          setLoading(false);
        }
      }
    };

    if (telegramData) {
      createToken();
    }
  }, [telegramData]);


  const levelUpMiner = async (minerName: string, cost: number, newHourlyProfit: number, telegramID: string, generatedToken: string) => {
    try {
      console.log(minerName);
      console.log(cost);
      console.log(newHourlyProfit);
      console.log(telegramID);
      console.log(userData);
      console.log(pointsRef.current);
      const minerData = minerList.reduce((acc, miner) => {
        const currentLevel = (userData?.minerData!)[miner.dbName] || 0;
        acc[miner.dbName] = minerName === miner.dbName ? currentLevel + 1 : currentLevel;
        return acc;
      }, {} as Record<string, number>);
      
      await axios.put(`https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users?ids=${telegramID}`, {
        updatedData: {
          
          minerData,
          coin: (pointsRef.current - cost),
          profitPerHour: newHourlyProfit
        }
      }, {
        headers: {
          Authorization: `Bearer ${generatedToken}`,
        },
      });
      const updatedData = {
        first_name: userData?.first_name,
        language_code: userData?.language_code,
        username: userData?.username,
        telegramID: userData?.telegramID, minerData: {
          ceo: minerName == "ceo" ? userData?.minerData.ceo! + 1 : userData?.minerData.ceo!, // Burada `ceo` değeri güncelleniyor.
          marketing: minerName == "marketing" ? userData?.minerData.marketing! + 1 : userData?.minerData.marketing!,
        },
        profitPerHour: newHourlyProfit
      }
      setUserData(updatedData as UserData);
      setPoints(points - cost);
      setProfitPerHour(newHourlyProfit);
    } catch (error) {
      console.log(error);
    }
  }


  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {

    const timer = setTimeout(() => {
      setIsModalOpen(false);
    }, 100); // 0.3 saniye
    return () => clearTimeout(timer);

  };
  console.log(isModalOpen);
  // Define your different screen components
  const ExchangeScreen = () =>
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
      <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
        <div className="px-4 mt-6 flex justify-between gap-2">
          <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
            <div className="dot"></div>
            <img src={dailyReward} alt="Daily Reward" className="mx-auto w-12 h-12" />
            <p className="text-[10px] text-center text-white mt-1">Daily reward</p>
            <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyRewardTimeLeft}</p>
          </div>
          <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
            <div className="dot"></div>
            <img src={dailyCipher} alt="Daily Cipher" className="mx-auto w-12 h-12" />
            <p className="text-[10px] text-center text-white mt-1">Daily cipher</p>
            <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyCipherTimeLeft}</p>
          </div>
          <div className="bg-[#272a2f] rounded-lg px-4 py-2 w-full relative">
            <div className="dot"></div>
            <img src={dailyCombo} alt="Daily Combo" className="mx-auto w-12 h-12" />
            <p className="text-[10px] text-center text-white mt-1">Daily combo</p>
            <p className="text-[10px] font-medium text-center text-gray-400 mt-2">{dailyComboTimeLeft}</p>
          </div>
        </div>

        <div className="px-4 mt-4 flex justify-center">
          <div className="px-4 py-2 flex items-center space-x-2">
            <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
            <p className="text-4xl text-white">{points.toLocaleString()}</p>
          </div>
        </div>

        <div className="px-4 mt-4 flex justify-center">
          <div
            className="w-80 h-80 p-4 rounded-full circle-outer"
            onClick={handleCardClick}
          >
            <div className="w-full h-full rounded-full circle-inner">
              <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>;

  interface PurchaseModalData {
    image: string;
    name: string;
    desc: string;
    profitPerHour: number;
    price: number;
  }
  const [modalData, setModalData] = useState<PurchaseModalData>({ desc: "", image: "", name: "", price: 0, profitPerHour: 0 } as PurchaseModalData)
  const MineScreen = () =>
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
      <PurchaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={modalData!}
        onClickEvent={() => levelUpMiner(modalData.name.toLowerCase(), modalData.price, modalData.profitPerHour + profitPerHour, userData?.telegramID!, token!)}

      />

      <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
        <div className="px-4 mt-6 flex justify-between gap-2">
          <div className="bg-[#1c1f24] min-h-screen p-4 w-full">
            <div className="flex justify-between mb-4">
              <button className="text-white">PR&Team</button>
              <button className="text-gray-500">Markets</button>
              <button className="text-gray-500">Legal</button>
              <button className="text-gray-500">Web3</button>
              <button className="text-gray-500">Specials</button>
            </div>
            <div style={{ paddingBottom: "100px" }} className="grid grid-cols-2 gap-4">
              {minerList.map((miner, index) => (
                <TeamCard
                  key={index}
                  imageSrc={miner.imageSrc}
                  title={miner.name}
                  profitPerHour={miner.profitByLevel[userData?.minerData.ceo ? userData.minerData.ceo : 0].toString()}
                  level={userData?.minerData.ceo ? userData.minerData.ceo : 0}
                  priceByLevel={miner.priceByLevel[userData?.minerData.ceo ? userData.minerData.ceo : 0].toString()}
                  onClickEvent={() => {
                    setModalData({
                      image: miner.imageSrc,
                      desc: miner.desc,
                      name: miner.name,
                      price: miner.priceByLevel[userData?.minerData.ceo ? userData.minerData.ceo : 0],
                      profitPerHour: miner.profitByLevel[userData?.minerData.ceo ? userData.minerData.ceo : 0],
                    } as PurchaseModalData);
                    handleButtonClick();
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>;

  const FriendsScreen = () => <div>Friends Screen</div>;
  const EarnScreen = () => <div>Earn Screen</div>;
  const AirdropScreen = () => <div>Airdrop Screen</div>;

  const [currentScreen, setCurrentScreen] = useState("exchange");

  // Function to handle screen change
  const handleScreenChange = (screen: React.SetStateAction<string>) => {
    setCurrentScreen(screen);
  };
  if (loading) {

    return (
      <div className="loading-screen">
        <div className="spinner"></div>
      </div>
    );

  } else {

    return (
      <div className="bg-black flex justify-center">
        <div className="w-full bg-black text-white h-screen font-bold flex flex-col max-w-xl">
          <div className="px-4 z-10">
            {/* <div className="flex items-center space-x-2 pt-4">
              <div className="p-1 rounded-lg bg-[#1d2025]">
                <Hamster size={24} className="text-[#d4d4d4]" />
              </div>
              <div>
                <p className="text-sm">{userData?.first_name} ({userData?.telegramID})</p>
                <p className="text-sm">{userData?.language_code} ({userData?.username})</p>
              </div>
            </div> */}
            <div className="flex items-center pt-3 justify-between space-x-4 mt-1">
              <div className="flex items-center w-1/3">
                <div className="w-full">
                  <div className="flex justify-between">
                    <p className="text-sm">{levelNames[levelIndex]}</p>
                    <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                  </div>
                  <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                    <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                      <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center w-2/3 border-2 border-[#43433b] rounded-full px-4 py-[2px] bg-[#43433b]/[0.6] max-w-64">
                <img src={binanceLogo} alt="Exchange" className="w-8 h-8" />
                <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                <div className="flex-1 text-center">
                  <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                  <div className="flex items-center justify-center space-x-1">
                    <img src={dollarCoin} alt="Dollar Coin" className="w-[18px] h-[18px]" />
                    <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                    <Info size={20} className="text-[#43433b]" />
                  </div>
                </div>
                <div className="h-[32px] w-[2px] bg-[#43433b] mx-2"></div>
                <Settings className="text-white" />
              </div>
            </div>
          </div>

          {(() => {
            switch (currentScreen) {
              case "exchange":
                return <ExchangeScreen />;
              case "mine":
                return <MineScreen />;
              case "friends":
                return <FriendsScreen />;
              case "earn":
                return <EarnScreen />;
              case "airdrop":
                return <AirdropScreen />;
              default:
                return <ExchangeScreen />;
            }
          })()}
        </div>
        {/* Bottom fixed div */}
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] justify-around items-center z-20  rounded-3xl text-xs ${isModalOpen ? "hidden" : "flex"}`}>
          <div onClick={() => setCurrentScreen("exchange")} className="text-center text-[#85827d] w-1/5 bg-[#1c1f24] m-1 p-2 rounded-2xl">
            <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Exchange</p>
          </div>
          <div onClick={() => setCurrentScreen("mine")} className="text-center text-[#85827d] w-1/5">
            <Mine className="w-8 h-8 mx-auto" />
            <p className="mt-1">Mine</p>
          </div>
          <div onClick={() => setCurrentScreen("friends")} className="text-center text-[#85827d] w-1/5">
            <Friends className="w-8 h-8 mx-auto" />
            <p className="mt-1">Friends</p>
          </div>
          <div onClick={() => setCurrentScreen("earn")} className="text-center text-[#85827d] w-1/5">
            <Coins className="w-8 h-8 mx-auto" />
            <p className="mt-1">Earn</p>
          </div>
          <div onClick={() => setCurrentScreen("airdrop")} className="text-center text-[#85827d] w-1/5">
            <img src={hamsterCoin} alt="Airdrop" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Airdrop</p>
          </div>
        </div>

        {clicks.map((click) => (
          <div
            key={click.id}
            className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
            style={{
              top: `${click.y - 42}px`,
              left: `${click.x - 28}px`,
              animation: `float 1s ease-out`
            }}
            onAnimationEnd={() => handleAnimationEnd(click.id)}
          >
            {pointsToAdd}
          </div>
        ))}
      </div>
    );

  }
};

export default App;
