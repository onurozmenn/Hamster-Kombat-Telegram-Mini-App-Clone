import { mineImage1 } from "../images";

export type MinerType = {
    imageSrc: string;
    dbName: string;
    name: string;
    desc: string;
    priceByLevel: Array<number>;
    profitByLevel: Array<number>;
    requiredMine?: string;
    requiredMineLevel?: number;
}

export const minerList: Array<MinerType> = [
    {
        imageSrc: mineImage1,
        dbName: "ceo",
        name: "CEO",
        desc: "Lorem ipsum bla bla bla",
        priceByLevel: [100, 200, 400, 800, 1600, 3200, 6400],
        profitByLevel: [3600, 7200, 10800, 14400, 18000, 21600],
    }, {
        imageSrc: mineImage1,
        dbName: "marketing",
        name: "Marketing",
        desc: "Lorem ipsum bla bla bla marketing",
        priceByLevel: [10, 20, 40, 80, 160, 320, 640],
        profitByLevel: [3100, 7100, 10100, 14100, 18000, 21100],
        requiredMine: "ceo",
        requiredMineLevel: 5
    }];

export type MinerData = {
    [K in (typeof minerList)[number]['dbName']]: number;
};