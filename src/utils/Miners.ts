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
        profitRate:1.25
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
        requiredMineLevel: 5
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
        requiredMineLevel: 5
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
        requiredMineLevel: 5
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
        requiredMineLevel: 5
    }];

export type MinerData = {
    [K in (typeof minerList)[number]['dbName']]: number;
};