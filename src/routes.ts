
import { Request, Response, NextFunction, Router } from "express";
import fs from 'fs'
import config, { chainNoncetoName } from "./config";
import { validate, advice, auth } from "./helpers";
import ContractService from "./ContractService";
import { ContractStruct } from "../types";


const _contractService = ContractService()

const isValidParams = (req: Request, res: Response, next: NextFunction) => {
    const val = req?.params?.chain
    if (!val) return res.send('missing params' + advice)
    const chainName = /[0-9]/.test(val) ? chainNoncetoName[val]?.toLowerCase() : val.toLowerCase();
    if (!chainName) return res.send('wrong nonce' + advice)

    // req.chainName = chainName
    res.locals.chainName = chainName

    return next()
}


export const whiteListedRouter = (): Router => {
    const router = Router();


    router.get('/:chain', isValidParams, (req: Request, res: Response) => {

        const chainName = res.locals.chainName

        _contractService.readFromFile(chainName).then(async (jsonContracts: string) => {
            return res.json(JSON.parse(jsonContracts))
        }).catch((e) => {
            return res.json({})
        })


    })


    router.post('/:chain', auth, isValidParams, async (req: Request, res: Response) => {



        const chainName = res.locals.chainName

        const Contracs = req.body

        const v = validate(Contracs);

        if (typeof v === 'string') {
            return res.status(401).send(v)
        }


        _contractService.readFromFile(chainName).then(async (jsonContracts: string) => {


            const contracs = await _contractService.saveToFile({
                ...JSON.parse(jsonContracts),
                ...Contracs
            }, chainName)

            return res.json(contracs)

        }).catch(async (e) => {
            if (e.message.includes('no such file or directory')) {
                const contracs = await _contractService.saveToFile(Contracs, chainName)

                return res.json(contracs)
            }
        })

        /* if (!jsonContracts) return res.end();
 
 
         await _contractService.saveToFile({
             ...JSON.parse(jsonContracts),
             ...Contracs
         }, chainName)
 
         res.end()*/

    })


    router.delete('/:chain', auth, isValidParams, async (req: Request, res: Response) => {
        if (!req?.body?.contracts) return res.end()
        const deleteContracts = req.body.contracts.map((c: string) => c.toLowerCase())


        _contractService.readFromFile(res.locals.chainName).then(async (jsonContracts: string) => {
            const parsed = JSON.parse(jsonContracts)
            const filtred = Object.keys(parsed).reduce((acc: any, contract: string) => {

                const obj = deleteContracts.includes(contract) ? null : { [contract]: parsed[contract] }
                return {
                    ...acc,
                    ...obj
                }
            }, {});

            _contractService.saveToFile(filtred, res.locals.chainName).then((contracts) => res.json(contracts)).catch(() => res.send('something went wrong on deletion'))


        }).catch((e) => {
            return res.send('no contracts found for that chain')
        })
    })

    router.delete('/drop/:chain', auth, isValidParams, async (req: Request, res: Response) => {

        _contractService.dropChain(res.locals.chainName).then(() => res.send('cleared all contracts for ' + res.locals.chainName)).catch((e) => res.send(e.message))
    })

    return router

}