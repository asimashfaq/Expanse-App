import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface'
import ExpanseController from '../../modules/expanses/controller'
import { ExpansesInput } from '../../modules/expanses/model/Expanses'
import { TokenAttributes } from '../../modules/token/model/Token'

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
            return await userLoader.load(parent.ratioId)
            //return await db.Ratio.findByPk(parent.ratioId)
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
        }
    },
    Mutation: {
        createExpanses: async (
            _,
            { input }: { input: ExpansesInput },
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
