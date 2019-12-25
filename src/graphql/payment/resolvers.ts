import { IResolvers } from 'graphql-tools'
import { DbInterface } from '../../interfaces/DbInterface'
import ExpanseController from '../../modules/expanses/controller'
import PaymentController from '../../modules/payments/controller'
import { PaymentsInstance } from '../../modules/payments/model/Payment'
import { TokenAttributes } from '../../modules/token/model/Token'
import sequelize = require('sequelize')
import Boom = require('boom')

const resolvers: IResolvers = {
    Payment: {
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
            return await db.ExpansesShares.findOne({
                where: {
                    id: parent.expansesshareId
                }
            })
        }
    },
    ExpansesShare: {
        expanse: async (
            parent,
            __,
            { db, user }: { db: DbInterface; user: TokenAttributes | boolean },
            info
        ) => {
            return await new ExpanseController(db).get(parent.expansesId)
        }
    },
    Query: {
        payments: async (
            _,
            __,
            { db, user }: { db: DbInterface; user: any }
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }
            return await new PaymentController(db).list(user)
        },
        payment: async (
            _,
            { id },
            { db, user }: { db: DbInterface; user: any }
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }
            return await new PaymentController(db).get(id)
        }
    },
    Mutation: {
        createPayment: async (
            _,
            { input }: { input: PaymentsInstance },
            { db, user }: { db: DbInterface; user: any }
        ) => {
            if (user === false) {
                return Boom.forbidden('Invalid Token')
            }
            return await new PaymentController(db).create(input, user)
        }
    }
}

export default resolvers
