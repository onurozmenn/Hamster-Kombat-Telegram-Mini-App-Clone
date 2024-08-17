import { useEffect, useRef } from "react";
import { lockImage } from "../images";

type TeamCardProps = {
    imageSrc: string;
    title: string;
    profitPerHour: string;
    level: string;
    totalProfit: string;
    isLocked?: boolean;
    onClickEvent: React.MouseEventHandler<HTMLButtonElement>;
};
export const TeamCard: React.FC<TeamCardProps> = ({ imageSrc, title, profitPerHour, level, totalProfit, isLocked = false, onClickEvent }) => (
    <div className="bg-[#292c34] rounded-lg p-4 w-full relative flex flex-col items-center">
        {isLocked && (
            <>
                <div className="z-10 absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
                    <img src={lockImage} alt="Locked" className="w-12 h-12" />
                </div>
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p className="text-yellow-400 font-bold">{profitPerHour} ₺</p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <p className="text-yellow-400 font-bold">{totalProfit} ₺</p>
            </>
        )}
        {!isLocked && (
            <>
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p className="text-yellow-400 font-bold">{profitPerHour} ₺</p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <button onClick={onClickEvent} className="hover:bg-[#5ee2f4] text-white rounded p-1 px-4 mt-1 bg-[#43433b99] font-bold">{totalProfit} ₺</button>
            </>
        )}
    </div>
);
type PurchaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'} z-50`}
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
        >
            <div
                ref={modalRef}
                className={`fixed bottom-0 left-0 w-full bg-[#1d2025] p-4 rounded-t-lg h-80 transition-transform duration-1000 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                >
                    &times;
                </button>
                <h2 className="text-lg font-bold">Satın Alma Detayları</h2>
                <p>Satın alma bilginiz burada görünecek.</p>
                {/* Daha fazla içerik ekleyebilirsiniz */}
            </div>
        </div>
    );
};