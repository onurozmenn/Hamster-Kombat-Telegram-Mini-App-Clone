import { mineImage1 } from "../images";

export type MinerType = {
    imageSrc: string;
    dbName: string;
    name: string;
    desc: string;
    basePrice: number;
    baseProfit: number;
    priceRate: number;
    profitRate: number;
    minerHeader: number;
    requiredMine?: string;
    requiredMineLevel?: number;
}

export const minerList: Array<MinerType> = [
    {
        imageSrc: mineImage1,
        dbName: "ceo",
        name: "CEO",
        desc: "Lorem ipsum bla bla bla",
        basePrice: 100,
        baseProfit: 10,
        priceRate:1.35,
        profitRate:1.25,
        minerHeader:0,
    }, {
        imageSrc: mineImage1,
        dbName: "marketing",
        name: "Marketing",
        desc: "Lorem ipsum bla bla bla marketing",
        basePrice: 100,
        baseProfit: 10,
        priceRate:1.45,
        profitRate:1.35,
        requiredMine: "ceo",
        requiredMineLevel: 5,
        minerHeader:1,
    }, {
        imageSrc: mineImage1,
        dbName: "marketing1",
        name: "Marketing1",
        desc: "Lorem ipsum bla bla bla marketing",
        basePrice: 100,
        baseProfit: 10,
        priceRate:1.45,
        profitRate:1.35,
        requiredMine: "marketing",
        requiredMineLevel: 5,
        minerHeader:2,
    }, {
        imageSrc: mineImage1,
        dbName: "marketing2",
        name: "Marketing2",
        desc: "Lorem ipsum bla bla bla marketing",
        basePrice: 100,
        baseProfit: 10,
        priceRate:1.45,
        profitRate:1.35,
        requiredMine: "marketing1",
        requiredMineLevel: 5,
        minerHeader:3,
    }, {
        imageSrc: mineImage1,
        dbName: "marketing3",
        name: "Marketing3",
        desc: "Lorem ipsum bla bla bla marketing",
        basePrice: 100,
        baseProfit: 10,
        priceRate:1.45,
        profitRate:1.35,
        requiredMine: "marketing2",
        requiredMineLevel: 5,
        minerHeader:4,
    }];

export type MinerData = {
    [K in (typeof minerList)[number]['dbName']]: number;
};
export const minerHeaders:Array<String>=[
    "P&R Team","Markets","Legal","Web3","Specials"
]

export const minerDataForUserData: { [key: string]: number } = {};

minerList.forEach(miner => {
    minerDataForUserData[miner.dbName] = 0;  // Initialize all miner levels to 0
});