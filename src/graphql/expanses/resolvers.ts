import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface'
import ExpanseController from '../../modules/expanses/controller'
import { ExpansesAttributes } from '../../modules/expanses/model/Expanses'
import { TokenAttributes } from '../../modules/token/model/Token'
import sequelize = require('sequelize')
import Boom = require('boom')

const resolvers: IResolvers = {
    Expanses: {
        ratio: async (
            parent,
            _,
            {
                db,
                user,
                ratioLoader
            }: {
                db: DbInterface
                user: TokenAttributes | boolean
                ratioLoader: any
            },
            info
        ) => {
            return await ratioLoader.load(parent.ratioId)
            //return await db.Ratio.findByPk(parent.ratioId)
        },
        user: async (
            parent,
            _,
            {
                db,
                user,
                userLoader
            }: {
                db: DbInterface
                user: TokenAttributes | boolean
                userLoader: any
            },
            info
        ) => {
            return await userLoader.load(parent.userId)
            //return await db.Ratio.findByPk(parent.ratioId)
        },
        expansesShare: async (
            parent,
            _,
            {
                db,
                user
            }: {
                db: DbInterface
                user: TokenAttributes | boolean
            },
            info
        ) => {
            return await db.ExpansesShares.findAll({
                where: {
                    expansesId: parent.id
                }
            })
        }
    },
    ExpansesShare: {
        user: async (
            parent,
            _,
            {
                db,
                user,
                userLoader
            }: {
                db: DbInterface
                user: TokenAttributes | boolean
                userLoader: any
            },
            info
        ) => {
            return await userLoader.load(parent.userId)
        },
        payment: async (
            parent,
            _,
            {
                db,
                user,
                userLoader
            }: {
                db: DbInterface
                user: TokenAttributes | boolean
                userLoader: any
            },
            info
        ) => {
            console.log(parent.id)
            return await db.Payments.findAll({
                where: {
                    expansesshareId: parent.id
                }
            })
        }
    },
    Query: {
        expanses: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean },
            info
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }

            return await new ExpanseController(db).list(user as TokenAttributes)
        },
        balance: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean },
            info
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }
            return await new ExpanseController(db).balance(
                user as TokenAttributes
            )
        },
        expanse: async (
            _,
            { id }: { id: number },
            { db }: { db: DbInterface },
            info
        ) => {
            const expanse = await new ExpanseController(db).get(id)
            if (expanse == null) {
                return Boom.notFound()
            }
            return expanse
        },
        expansesShares: async (
            _,
            { status }: { status: string },
            { db, user }: { db: DbInterface; user: any },
            info
        ) => {
            console.log('i called')
            const expansesShares = await db.ExpansesShares.findAll({
                where: {
                    status: status.toLocaleLowerCase(),
                    userId: user.userId
                }
            })
            return expansesShares
        }
    },
    Mutation: {
        createExpanses: async (
            _,
            { input }: { input: ExpansesAttributes },
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean }
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }
            return await new ExpanseController(db).create(
                input,
                user as TokenAttributes
            )
        }
    }
}
export default resolvers
