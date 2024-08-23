'use client'
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { binanceLogo, dailyCipher, dailyCombo, dailyReward, dollarCoin, giftBox, hamsterCoin, mainCharacter, mineImage1 } from './images';
import Info from './icons/Info';
import Settings from './icons/Settings';
import Mine from './icons/Mine';
import Friends from './icons/Friends';
import Coins from './icons/Coins';
import axios from 'axios';
import WebApp from '@twa-dev/sdk'
import { PurchaseModal, TeamCard } from './icons/TeamCard';
import { MinerData, minerDataForUserData, minerHeaders, minerList } from './utils/Miners';
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
      minerData: minerDataForUserData
    };

    WebApp.disableVerticalSwipes();
    WebApp.enableClosingConfirmation();
    WebApp.expand();
    setUserData(userDatas);
    setTelegramData(true);
    console.log("telegram data değişti");
    setCurrentScreen("friends");
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


  const [animate, setAnimate] = useState("");

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

  const handleCardClick = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;

    // Tüm pointer olayları için style değişikliğini uyguluyoruz
    card.style.transform = transform;

    // Birden fazla dokunuşu işlemek için pointerId'leri takip edebiliriz
    // Örneğin, her dokunuşu kaydetmek için:
    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const card = e.currentTarget;

    // Pointer kaldırıldığında transform sıfırlanır
    setTimeout(() => {
      card.style.transform = '';
    }, 100);
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
              const minerData = minerList.reduce((acc, miner) => {
                acc[miner.dbName] = 0;
                return acc;
              }, {} as Record<string, number>);
              try {
                const response = await axios.post('https://hamster-kombat-telegram-mini-app-clone-sand.vercel.app/api/users', {
                  telegramID: userData?.telegramID,
                  first_name: userData?.first_name,
                  username: userData?.username,
                  language_code: userData?.language_code,
                  coin: 0,
                  profitPerHour: 0,
                  minerData
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


  const TopPart = () =>
    <div className="px-4 z-10">
      {
        /*<div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#d4d4d4]" />
            </div>
            <div>
              <p className="text-sm">{userData?.first_name} ({userData?.telegramID})</p>
              <p className="text-sm">{userData?.language_code} ({userData?.username})</p>
            </div>
          </div> 
        */
      }
      <div className={`flex items-center pt-3 justify-between space-x-4 mt-1 ${animate}-shake`}>
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

    </div>;

  const ExchangeScreen = () =>
    <div className="flex-grow mt-4 bg-[#f3ba2f] rounded-t-[48px] relative top-glow z-0">
      <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] rounded-t-[46px]">
        <div className={`px-4 mt-6 flex justify-between gap-2 ${animate}-shake`}>
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

        <div className={`px-4 mt-4 flex justify-center ${animate}-fadeIn`}>
          <div className="px-4 py-2 flex items-center space-x-2">
            <img src={dollarCoin} alt="Dollar Coin" className="w-10 h-10" />
            <p className="text-4xl text-white">{points.toLocaleString()}</p>
          </div>
        </div>

        <div className={`px-4 mt-4 flex justify-center ${animate}-bounce`}>

          <div
            className="w-80 h-80 p-4 rounded-full circle-outer"
            onPointerDown={handleCardClick}
            onPointerUp={handlePointerUp}
          >
            <div className="w-full h-full rounded-full circle-inner">
              <img src={mainCharacter} alt="Main Character" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>;


  const levelUpMiner = async (minerName: string, cost: number, newHourlyProfit: number, telegramID: string, generatedToken: string) => {
    if (pointsRef.current >= cost) {
      try {
        setLoading(true);
        console.log(newHourlyProfit)
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
          telegramID: userData?.telegramID,
          minerData: minerData,
          profitPerHour: newHourlyProfit
        }
        setUserData(updatedData as UserData);
        setPoints(points - cost);
        setProfitPerHour(newHourlyProfit);

      } catch (error) {
        console.log(error);
      } finally {

        setLoading(false);
        handleCloseModal();
      }
    } else {
      WebApp.showAlert("Yeterli paran yok", function () {
        handleCloseModal();
      });
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {

    const timer = setTimeout(() => {
      setIsModalOpen(false);
      setModalData({ desc: "", image: "", name: "", price: 0, profitPerHour: 0 } as PurchaseModalData);
    }, 100); // 0.3 saniye
    return () => clearTimeout(timer);

  };

  interface PurchaseModalData {
    image: string;
    name: string;
    desc: string;
    profitPerHour: number;
    price: number;
  }

  function calculateLevelData(initialPrice: number, initialProfit: number, priceIncreaseRate: number, profitIncreaseRate: number, level: number) {
    const priceByLevel = level == 0 ? initialPrice : Math.round(initialPrice * Math.pow(priceIncreaseRate, level));
    const profitPerHour = level == 0 || level == 1 ? initialProfit : Math.round(initialProfit * Math.pow(profitIncreaseRate, level));
    const profitPerHourNextLevel = Math.round(initialProfit * Math.pow(profitIncreaseRate, level + 1));
    return { priceByLevel, profitPerHour, profitPerHourNextLevel };
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
            <div className={`flex justify-between mb-4 ${animate}-shake-rev`}>
              {minerHeaders.map((miner, index) => {
                return (
                  <button onClick={() => { setCurrentMinerHeader(index) }} className={`text-white  ${currentMinerHeader == index ? "bg-[#424447] rounded-md p-1" : "m-1"}`}>{miner}</button>
                )
              })}
            </div>
            <div style={{ paddingBottom: "100px" }} className="grid grid-cols-2 gap-4">
              {minerList.map((miner, index) => {
                const level = userData?.minerData[miner.dbName] ?? 0;
                const { priceByLevel, profitPerHour, profitPerHourNextLevel } = calculateLevelData(miner.basePrice, miner.baseProfit, miner.priceRate, miner.profitRate, level);
                return miner.minerHeader == currentMinerHeader ? (
                  <TeamCard
                    className={(Math.floor(index / 2) % 2 === 0) ? animate + '-shake' : animate + '-shake-rev'}
                    key={index}
                    imageSrc={miner.imageSrc}
                    title={miner.name}
                    profitPerHour={profitPerHour.toString()}
                    userCoin={pointsRef.current}
                    level={level}
                    requiredMine={miner.requiredMine}
                    requiredMineLevel={miner.requiredMineLevel}
                    priceByLevel={priceByLevel.toString()}
                    isLocked={
                      !miner.requiredMine ||
                        !miner.requiredMineLevel ||
                        userData?.minerData[miner.requiredMine] === undefined ||
                        userData?.minerData[miner.requiredMine] >= miner.requiredMineLevel
                        ? false
                        : true}
                    onClickEvent={() => {
                      setModalData({
                        image: miner.imageSrc,
                        desc: miner.desc,
                        name: miner.name,
                        price: priceByLevel,
                        profitPerHour: level == 0 ? miner.baseProfit : profitPerHourNextLevel - profitPerHour,
                      } as PurchaseModalData);
                      handleButtonClick();
                    }}
                  />
                ) : <></>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>;

  const FriendsScreen = () =>{
    const [expanded, setExpanded] = useState(false);
    return(
    <div className="absolute top-[2px] left-0 right-0 bottom-0 bg-[#1d2025] ">
      <div className="px-4 mt-6 flex justify-between gap-2">
        <div className="bg-[#1c1f24] min-h-screen p-4 w-full">
          <p className={`text-2xl mx-auto text-center text-white font-semibold mb-3 ${animate}-shake`}>Arkadaşlarını davet et!</p>
          <p className={`text-sm mx-auto text-center text-white font-thin mb-6 ${animate}-shake-rev`}>Siz ve bir arkadaşınız bonus alacak</p>

          {/* Invite Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 bg-[#262a30] rounded-lg">
              <div className="flex items-center space-x-3">
                <img src={giftBox} alt="Invite" className={`w-16 h-16 ${animate}-bounce`} />
                <div>
                  <p className="text-white text-lg">Arkadaş davet et</p>
                  <p className="text-[#f3ba2f]">+5.000 sizin ve arkadaşınız için</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#262a30] rounded-lg">
              <div className="flex items-center space-x-2">
                <img src={giftBox} alt="Premium Invite" className={`w-16 h-16 ${animate}-bounce`} />
                <div>
                  <p className="text-white text-lg">Telegram Premium ile arkadaş davet et</p>
                  <p className="text-[#f3ba2f]">+25.000 sizin ve arkadaşınız için</p>
                </div>
              </div>
            </div>
          </div>
          <p onClick={()=>{setExpanded(true)}} className={`text-blue-500 text-center pt-4 ${expanded?"hidden":""}`}>Daha fazla bonus</p>
          {/* Bonus Levels Section */}
          <p className={`text-white text-lg font-semibold mt-8 mb-2 ${expanded?"":"hidden"}`}>Seviye atladığında bonus</p>
          <div className={`flex items-center justify-between p-4 ${expanded?"":"hidden"}`}>
            <p className='text-gray-600 ml-2 text-xs pl-[48px] w-[45%]'>Level</p>
            <p className='text-gray-600  text-xs w-[27.5%]'>Friend</p>
            <p className='text-gray-600  text-xs w-[27.5%]'>Premium</p></div>
          <div className={`space-y-4 ${expanded?"":"hidden"}`}>
            {[
              { level: "Silver", friendBonus: "20.000", premiumBonus: "25.000" },
              { level: "Gold", friendBonus: "30.000", premiumBonus: "50.000" },
              { level: "Platinum", friendBonus: "40.000", premiumBonus: "75.000" },
              { level: "Diamond", friendBonus: "60.000", premiumBonus: "100.000" },
              { level: "Epic", friendBonus: "100.000", premiumBonus: "150.000" },
              { level: "Legendary", friendBonus: "250.000", premiumBonus: "500.000" },
              { level: "Master", friendBonus: "500.000", premiumBonus: "1.000.000" },
              { level: "Grandmaster", friendBonus: "1.000.000", premiumBonus: "2.000.000" },
              { level: "Lord", friendBonus: "3.000.000", premiumBonus: "6.000.000" },
              { level: "Creator", friendBonus: "6.000.000", premiumBonus: "12.000.000" },
            ].map((item) => (
              <div key={item.level} className="flex items-center justify-between p-4 bg-[#262a30] rounded-lg">
                {/* Left aligned image and text */}
                <div className='flex items-center space-x-2 w-[45%]'>
                  <img src={mineImage1} alt={item.level} className="w-12 h-12" />
                  <p className="text-white text-xs">{item.level}</p>
                </div>

                {/* Centered friendBonus */}
                <div className="items-center w-[27.5%]">
                  <p className="text-[#f3ba2f] text-xs text-left" style={{ display: "ruby" }}><img src={dollarCoin} className="h-[14px] pb-1 pr-1"></img>+{item.friendBonus}</p>
                </div>

                {/* Right aligned premiumBonus */}
                <div className="items-end  w-[27.5%]">
                  <p className="text-[#f3ba2f] text-xs text-left" style={{ display: "ruby" }}><img src={dollarCoin} className="h-[14px] pb-1 pr-1"></img>+{item.premiumBonus}</p>
                </div>
              </div>


            ))}
          </div>

          {/* Friends List Section */}
          <p className="text-white text-lg font-semibold mt-6 mb-4">Arkadaşlarınızın listesi</p>
          <div className="flex justify-center items-center h-20 bg-[#262a30] rounded-lg mb-36">
            <p className="text-[#7c7c7c]">Henüz kimseyi davet etmediniz</p>
          </div>

          {/* Invite Button */}
          <div className="mt-6 fixed pb-9 z-[40] bottom-16 w-[100%] pr-16">
            <div className='flex'>
              <button onClick={() => window.open("https://t.me/"+"trying_something_bot"+"?startapp="+"123456", "_blank")} className={`bg-[#7f67f3] text-white font-bold py-3 rounded-lg w-[78%] animate-scale-inf`}>
                <div style={{ display: "ruby" }}><p className="">Arkadaş davet et</p>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 mb-1 ml-2">
                    <path d="M5.25 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM2.25 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM18.75 7.5a.75.75 0 0 0-1.5 0v2.25H15a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0v-2.25H21a.75.75 0 0 0 0-1.5h-2.25V7.5Z" />
                  </svg>
                </div>
              </button>
              <div className='w-[4%]'></div>
              <button className="bg-[#7f67f3] text-white font-bold py-3 rounded-lg w-[18%]"><div style={{ display: "ruby" }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-center">
  <path d="M7.5 3.375c0-1.036.84-1.875 1.875-1.875h.375a3.75 3.75 0 0 1 3.75 3.75v1.875C13.5 8.161 14.34 9 15.375 9h1.875A3.75 3.75 0 0 1 21 12.75v3.375C21 17.16 20.16 18 19.125 18h-9.75A1.875 1.875 0 0 1 7.5 16.125V3.375Z" />
  <path d="M15 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 17.25 7.5h-1.875A.375.375 0 0 1 15 7.125V5.25ZM4.875 6H6v10.125A3.375 3.375 0 0 0 9.375 19.5H16.5v1.125c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V7.875C3 6.839 3.84 6 4.875 6Z" />
</svg></div>

              </button>
            </div>
          </div>
        </div>
      </div>
    </div>);};

  const EarnScreen = () => <div>Earn Screen</div>;
  const AirdropScreen = () => <div>Airdrop Screen</div>;

  const [currentScreen, setCurrentScreen] = useState("exchange");
  const [currentMinerHeader, setCurrentMinerHeader] = useState(0);

  useEffect(() => {
    setAnimate("animate");
    const timer = setTimeout(() => {
      setAnimate("");
    }, 200); // 0.4 saniye
    return () => clearTimeout(timer);
  }, [currentScreen]);



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


          {(() => {
            switch (currentScreen) {
              case "exchange":
                return (<><TopPart /><ExchangeScreen /></>);
              case "mine":
                return (<><TopPart /><MineScreen /></>);
              case "friends":
                return <FriendsScreen />;
              case "earn":
                return <EarnScreen />;
              case "airdrop":
                return <AirdropScreen />;
              default:
                return (<><TopPart /><ExchangeScreen /></>);
            }
          })()}
        </div>
        {/* Bottom fixed div
        
         bg-[#1c1f24] m-1 p-2 rounded-2xl
         
         */}
        <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl bg-[#272a2f] justify-around items-center z-20  rounded-3xl text-xs ${isModalOpen ? "hidden" : "flex"}`}>
          <div onClick={() => setCurrentScreen("exchange")} className={`text-center text-[#85827d] w-1/5 m-1 p-2 ${currentScreen == "exchange" ? "bg-[#1c1f24] rounded-2xl" : ""}`}>
            <img src={binanceLogo} alt="Exchange" className="w-8 h-8 mx-auto" />
            <p className="mt-1">Exchange</p>
          </div>
          <div onClick={() => setCurrentScreen("mine")} className={`text-center transition-all duration-200 text-[#85827d] w-1/5 m-1 p-2 ${currentScreen == "mine" ? "bg-[#1c1f24] rounded-2xl" : ""}`}>
            <Mine className="w-8 h-8 mx-auto" />
            <p className="mt-1">Mine</p>
          </div>
          <div onClick={() => setCurrentScreen("friends")} className={`text-center transition-all duration-200 text-[#85827d] w-1/5 m-1 p-2 ${currentScreen == "friends" ? "bg-[#1c1f24] rounded-2xl" : ""}`}>
            <Friends className="w-8 h-8 mx-auto" />
            <p className="mt-1">Friends</p>
          </div>
          <div onClick={() => setCurrentScreen("earn")} className={`text-center transition-all duration-200 text-[#85827d] w-1/5 m-1 p-2 ${currentScreen == "earn" ? "bg-[#1c1f24] rounded-2xl" : ""}`}>
            <Coins className="w-8 h-8 mx-auto" />
            <p className="mt-1">Earn</p>
          </div>
          <div onClick={() => setCurrentScreen("airdrop")} className={`text-center transition-all duration-200 ease-in-out text-[#85827d] w-1/5 m-1 p-2 ${currentScreen == "airdrop" ? "bg-[#1c1f24] rounded-2xl" : ""}`}>
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
