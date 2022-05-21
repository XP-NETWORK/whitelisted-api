import dotenv from "dotenv";
import { importJWK } from 'jose'

dotenv.config();

export const chainNoncetoName: any = {
    "0": "Unknown",
    "4": "BSC",
    "19": "Velas",
    "14": "Gnosis",
    "2": "Elrond",
    "20": "Iotex",
    "6": "Avalanche",
    "16": "Fuse",
    "21": "Aurora",
    "7": "Polygon",
    "5": "Ethereum",
    "8": "Fantom",
    "12": "Harmony",
    "18": "Tezos",
    "23": "GateChain",
    "9": "Tron",
    "25": "VECHAIN",
    "15": "Algorand",
};


function getOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing env var ${key}`);
    }
    return value;
}


export default {
    port: getOrThrow('PORT'),
    admin_key: importJWK(JSON.parse(getOrThrow('ADMIN_KEY')),
        "ES256").then((t) => t)

}
