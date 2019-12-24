import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface'
import ExpanseController from '../../modules/expanses/controller'
import { ExpansesAttributes } from '../../modules/expanses/model/Expanses'
import { TokenAttributes } from '../../modules/token/model/Token'
import sequelize = require('sequelize')

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
                    expansesId: parent.id,
                    userId: {
                        [sequelize.Op.not]: parent.userId
                    } as any
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
        }
    },
    Query: {
        expanses: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean },
            info
        ) => {
            return await new ExpanseController(db).list(user as TokenAttributes)
        },
        balance: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean },
            info
        ) => {
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
            return await new ExpanseController(db).get(id)
        }
    },
    Mutation: {
        createExpanses: async (
            _,
            { input }: { input: ExpansesAttributes },
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean }
        ) => {
            return await new ExpanseController(db).create(
                input,
                user as TokenAttributes
            )
        }
    }
}
export default resolvers
