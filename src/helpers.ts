
import web3 from 'web3'
import { Request, Response, NextFunction } from 'express'
import { jwtVerify } from 'jose'
import config from './config'

export const advice = '//Check example at https://github.com/XP-NETWORK/whitelisted-api'



export const validate = (Contracts: any) => {
    if (!Contracts || Object.keys(Contracts).length === 0 || typeof Contracts !== 'object') return ('wrong body scheema' + advice)
    if (Object.keys(Contracts).some(c => !web3.utils.isAddress(c))) return ('wrong contract address' + advice)

    if (Object.keys(Contracts).some(c => {
        if (!Contracts[c].name || typeof Contracts[c].name !== 'string') return true
        return false
    })) return ('Contract name is missing in one or more contacts in body' + advice)

    return true
}


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).send('auth token required')

    }
    const token = authHeader.split(" ")[1];
    try {
        const { payload } = await jwtVerify(token, await config.admin_key);

        next()
    } catch (e: any) {
        res.send(e.message)
    }

};