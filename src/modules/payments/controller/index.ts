import Boom from 'boom'
import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
import { ExpansesShareAttributes } from '../../expanses/model/ExpansesShare'
import { TokenAttributes } from '../../token/model/Token'
import { PaymentsAttributes, PaymentsInstance } from '../model/Payment'

export default class PaymentController extends BaseHandler {
    constructor(db: DbInterface) {
        super(db)
    }

    public async list(user: TokenAttributes): Promise<PaymentsInstance[]> {
        return await this.db.Payments.findAll({
            where: {
                userId: user.userId
            }
        })
    }

    public async get(id: number): Promise<PaymentsInstance> {
        try {
            const payment = await this.db.Payments.findByPk(id)
            if (!payment) {
                throw Boom.notFound('payment not found!')
            }
            return payment
        } catch (err) {
            throw err
        }
    }
    public async create(
        input: PaymentsAttributes,
        user: TokenAttributes
    ): Promise<any> {
        return await this.db.sequelize.transaction(async t => {
            const shareinfo = (await this.db.ExpansesShares.findByPk(
                input.expansesshareId
            )) as ExpansesShareAttributes
            let remainingAmount = shareinfo.amount
            if (shareinfo.userId !== user.userId) {
                throw Boom.notAcceptable(
                    "Don't be so generous. You cannot pay for your friend"
                )
            }
            if (shareinfo.status === 'paid') {
                throw Boom.notAcceptable('Payment already paid')
            }
            if (shareinfo.status === 'partial') {
                //throw Boom.notAcceptable('Payment already paid')
                const payments = await this.db.Payments.findAll({
                    where: {
                        expansesshareId: input.expansesshareId
                    }
                })
                let paid = 0
                payments.forEach((payment: PaymentsAttributes) => {
                    paid = paid + payment.amount
                })
                remainingAmount = shareinfo.amount - paid
            }
            if (input.amount > remainingAmount || remainingAmount == 0) {
                throw Boom.notAcceptable('Woops! Your giving extra money')
            }
            try {
                const payment = await this.db.Payments.create(
                    {
                        amount: input.amount,
                        userId: user.userId,
                        description: input.description,
                        expansesshareId: input.expansesshareId
                    },
                    {
                        transaction: t
                    }
                )

                const status =
                    shareinfo.amount === input.amount ||
                    remainingAmount === input.amount
                        ? 'paid'
                        : 'partial'
                const expShares = await this.db.ExpansesShares.update(
                    {
                        status: status
                    },
                    {
                        where: {
                            id: input.expansesshareId as number
                        },
                        transaction: t
                    }
                )
                if (!expShares || !payment) {
                    t.rollback()
                }
                return payment
            } catch (e) {
                throw e
            }
        })
    }
}
