import fs from 'fs'
import { ContractStruct } from '../types'
import path from 'path'

class ContractService {


    async saveToFile(contracts: ContractStruct, name: string) {

        const contractsInLowerCaase: ContractStruct = Object.keys(contracts).reduce((acc, cur) => {
            return {
                ...acc,
                [cur.toLowerCase()]: contracts[cur]
            }
        }, {});


        const json = JSON.stringify(contractsInLowerCaase);
        var file = fs.createWriteStream(`contracts/${name}.json`);
        file.write(json);
        file.end();

        return contractsInLowerCaase
    }


    async readFromFile(name: string) {
        const json = fs.readFileSync(`contracts/${name}.json`, { encoding: 'utf-8' });
        return json
    }

    async dropChain(name: string) {
        fs.unlinkSync(`contracts/${name}.json`);

    }
}

export default () => new ContractService()