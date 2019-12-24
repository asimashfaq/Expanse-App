import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface.d'
import RatioController from '../../modules/ratio/controller'
import { RatioInstance } from '../../modules/ratio/model/Ratio'

const resolvers: IResolvers = {
    Query: {
        ratios: async (_, __, { db }: { db: DbInterface }) => {
            return await new RatioController(db).list()
        },
        ratio: async (_, { id }, { db }: { db: DbInterface }) => {
            return await db.Ratio.findByPk(id)
        }
    },
    Mutation: {
        createRatio: async (
            _,
            { input }: { input: RatioInstance },
            { db }: { db: DbInterface }
        ) => {
            const ratio = await new RatioController(db).create(input)
            return ratio
        }
    }
}

export default resolvers
