import { rule } from 'graphql-shield'
import * as jwt from 'jsonwebtoken'
import { DbInterface } from '../interfaces/DbInterface'
import { TokenInstance } from '../modules/token/model/Token'
import Boom = require('boom')
export const isAuthenticated = rule()(
    async (_, __, { user }: { user: any }, _info) => {
        return user !== null
    }
)
export const getUser = async (
    db: DbInterface,
    r: any
): Promise<TokenInstance | boolean> => {
    let token = r.request.headers.authorization || ''
    if (token !== '') {
        token = token.slice(7, token.length).trimLeft()
        return await new Promise(res => {
            jwt.verify(
                token,
                'my-secret-from-env-file-in-prod',
                async (err: any, _decoded: any) => {
                    if (err) {
                        throw Boom.badRequest('Token is not valid')
                    }
                    try {
                        const tokenInfo = (await db.Token.findOne({
                            where: {
                                token: token
                            },
                            include: [
                                {
                                    model: db.User,
                                    as: 'User'
                                }
                            ]
                        })) as TokenInstance
                        if (tokenInfo === null) {
                            res(false)
                            return
                        }
                        res(tokenInfo.toJSON())
                    } catch (error) {
                        console.log(error)
                    }
                }
            )
        })
    } else {
        return false
    }
}
