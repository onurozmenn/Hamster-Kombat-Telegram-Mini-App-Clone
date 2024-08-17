import { lockImage } from "../images";

type TeamCardProps = {
    imageSrc: string;
    title: string;
    profitPerHour: string;
    level: string;
    totalProfit: string;
    isLocked?: boolean;
};
export const TeamCard: React.FC<TeamCardProps> = ({ imageSrc, title, profitPerHour, level, totalProfit, isLocked = false }) => (
    <div className="bg-[#292c34] rounded-lg p-4 w-full relative flex flex-col items-center">
        {isLocked && (
            <div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
            <img src={lockImage} alt="Locked" className="w-12 h-12" />
            </div>
                <>
                
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p className="text-yellow-400 font-bold">{profitPerHour} ₺</p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <p className="text-yellow-400 font-bold">{totalProfit} ₺</p>
            </>
            </div>
        )}
        {!isLocked && (
            <>
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p className="text-yellow-400 font-bold">{profitPerHour} ₺</p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <p className="text-yellow-400 font-bold">{totalProfit} ₺</p>
            </>
        )}
    </div>
);