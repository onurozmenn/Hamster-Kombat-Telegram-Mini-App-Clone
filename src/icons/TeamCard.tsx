import { useEffect, useRef, useState } from "react";
import { dollarCoin, lockImage } from "../images";

type TeamCardProps = {
    imageSrc: string;
    title: string;
    profitPerHour: string;
    level: number;
    priceByLevel: string;
    isLocked?: boolean;
    onClickEvent: React.MouseEventHandler<HTMLButtonElement>;
};
export const TeamCard: React.FC<TeamCardProps> = ({ imageSrc, title, profitPerHour, level, priceByLevel, isLocked = false, onClickEvent }) => (
    <div className="bg-[#292c34] rounded-lg p-4 w-full relative flex flex-col items-center">
        {isLocked && (
            <>
                <div className="z-10 absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-lg">
                    <img src={lockImage} alt="Locked" className="w-12 h-12" />
                </div>
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p style={{display:"ruby"}} className="text-yellow-400 font-bold">{profitPerHour} <img style={{... level === 0 ? {filter: "hue-rotate(180deg)"} : {}}} src={dollarCoin} className="h-4 pb-1 pr-1" ></img></p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <p style={{display:"ruby"}} className="text-yellow-400 font-bold">{priceByLevel} <img src={dollarCoin} className="h-4 pb-1 pr-1"></img></p>
            </>
        )}
        {!isLocked && (
            <>
                <img src={imageSrc} alt={title} className="w-16 h-16 mb-2" />
                <h2 className="text-white text-lg font-bold">{title}</h2>
                <p className="text-gray-400">Saat başı kar</p>
                <p style={{display:"ruby"}} className="text-yellow-400 font-bold">{profitPerHour} <img src={dollarCoin} className="h-4 pb-1 pr-1"></img></p>
                <p className="text-gray-400 text-sm mt-2">lvl {level}</p>
                <button style={{display:"ruby"}} onClick={onClickEvent} className="hover:bg-[#5ee2f4] text-white rounded p-1 px-4 mt-1 bg-[#43433b99] font-bold">{priceByLevel} <img src={dollarCoin} className="h-4 pb-1 pr-1"></img></button>
            </>
        )}
    </div>
);


type PurchaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    data: PurchaseModalData;
    onClickEvent: React.MouseEventHandler<HTMLButtonElement>;
};
interface PurchaseModalData {
    image: string;
    name: string;
    desc: string;
    profitPerHour: number;
    price: number;
  }
export const PurchaseModal: React.FC<PurchaseModalProps> = ({ isOpen, onClose, data, onClickEvent }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const [animationClass, setAnimationClass] = useState('translate-y-full');
    const [opacityAnimationClass, setOpacityAnimationClass] = useState('opacity-0');
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setAnimationClass('translate-y-full');
                setOpacityAnimationClass('opacity-0');
                onClose();
            }
        };

        if (isOpen) {
            setAnimationClass('translate-y-0');
            setOpacityAnimationClass('opacity-100');


            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (

        <div className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-400 ${opacityAnimationClass} z-40`}
            style={{ pointerEvents: isOpen ? 'auto' : 'none' }} >
            <div ref={modalRef} style={{ borderTop: '3px solid #f0b90b' }}  // Sarı çizgi efekti
                className={`fixed top-glow bottom-0 left-0 w-full bg-[#1d2025] p-4 rounded-t-[48px] h-[60%] z-50 transition-transform duration-400 ease-linear ${animationClass}`} >
                <button
                    onClick={() => {
                        setAnimationClass('translate-y-full');
                        setOpacityAnimationClass('opacity-0');
                        onClose();
                    }}
                    className="absolute top-6 right-6 text-white bg-gray-600 bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
                >
                    &times;

                </button>
                <div className="grid h-auto justify-center items-center">
    <img className="w-[20%] pt-3 mb-2 ml-[40%]" src={data.image}></img>
    <p className="text-white text-xl font-sans text-center pt-4">{data.name}</p>
    <p className="text-white font-light font-sans text-center pt-2 h-[auto]">
        {data.desc}
    </p>
    <p className="text-white font-light font-sans text-center pt-2 h-[auto]" style={{display:"ruby"}}>
        Saat başı gelir: +{data.profitPerHour} <img src={dollarCoin} className="h-4 pb-1"></img>
    </p>
    <button onClick={onClickEvent} style={{display:"ruby"}} className="absolute bottom-[40px] left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg w-[60%]">
               {data.price} <img src={dollarCoin} className="h-4 pb-1 pr-1"></img> Satın Al
    </button>
</div>

            </div>
        </div>
    );
};