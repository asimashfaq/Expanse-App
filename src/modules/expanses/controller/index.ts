import Boom from 'boom'
import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
import { PaymentsAttributes } from '../../payments/model/Payment'
import { TokenAttributes } from '../../token/model/Token'
import { ExpansesAttributes, ExpansesInstance } from '../model/Expanses'
import { ExpansesShareAttributes } from '../model/ExpansesShare'

export default class ExpanseController extends BaseHandler {
    constructor(db: DbInterface) {
        super(db)
    }

    public async list(user: TokenAttributes): Promise<ExpansesInstance[]> {
        return await this.db.Expanses.findAll({
            where: {
                userId: user.userId
            }
        })
    }
    public async create(
        expanse: ExpansesAttributes,
        user: TokenAttributes
    ): Promise<any> {
        const ratio = await this.db.Ratio.findByPk(expanse.ratioId)
        const peoples = expanse.shares_with as number[]
        peoples.push(user.userId)
        if (!ratio) {
            throw Boom.notFound('Ratio not found!')
        }

        if (peoples.length > 2) {
            throw Boom.notFound('Max two users allow')
        }
        if (peoples.length <= 1) {
            throw Boom.notFound('Minimum two users')
        }
        if (peoples[0] === peoples[1]) {
            throw Boom.notAcceptable('You cannot share expanse with yourself')
        }
        const friend = await this.db.User.findByPk(peoples[0])
        if (!friend) {
            throw Boom.notFound('Friend not found inside the db')
        }
        const personA = (ratio.a / 100) * expanse.total_amount
        const personB = (ratio.b / 100) * expanse.total_amount

        try {
            return await this.db.sequelize.transaction(async t => {
                const _expanse = await this.db.Expanses.create(
                    {
                        name: expanse.name,
                        description: expanse.description,
                        total_amount: expanse.total_amount,
                        ratioId: expanse.ratioId,
                        userId: user.userId
                    },
                    { transaction: t }
                )
                const expShares = await this.db.ExpansesShares.bulkCreate(
                    [
                        {
                            amount: personA,
                            userId: peoples[0],
                            expansesId: _expanse.id as number,
                            status: 'pending'
                        },
                        {
                            amount: personB,
                            userId: peoples[1],
                            expansesId: _expanse.id as number,
                            status: 'paid'
                        }
                    ],
                    { transaction: t }
                )
                const payment = await this.db.Payments.create(
                    {
                        amount: personB,
                        description: '-',
                        userId: user.userId,
                        expansesshareId: expShares[1].id
                    },
                    { transaction: t }
                )
                if (expanse == null || expShares == null || payment == null) {
                    t.rollback()
                    throw Boom.notFound('Some thing goes wrong')
                }
                // t.commit()
                return _expanse
            })
        } catch (e) {
            throw e
        }
    }
    public async balance(user: TokenAttributes): Promise<any> {
        try {
            const explist = await this.db.Expanses.findAll({
                where: {
                    userId: user.userId
                },
                include: [
                    {
                        model: this.db.ExpansesShares,
                        required: true,
                        as: 'ExpansesShares'
                    }
                ]
            })

            const exppaylist = await this.db.ExpansesShares.findAll({
                where: {
                    userId: user.userId,
                    status: 'pending'
                }
            })
            let receivable = 0
            let paid = 0
            let received = 0
            let payable = 0
            let partially = 0
            exppaylist.forEach(exp => {
                payable = payable + exp.amount
            })

            explist.forEach(exp => {
                const expsharelist = exp.ExpansesShares as ExpansesShareAttributes[]
                expsharelist.forEach(expshare => {
                    if (expshare.status == 'pending') {
                        receivable = receivable + expshare.amount
                    } else if (
                        expshare.status == 'paid' &&
                        expshare.userId == user.userId
                    ) {
                        paid = paid + expshare.amount
                    } else {
                        received = received + expshare.amount
                    }
                })
            })
            const partialList = await this.db.ExpansesShares.findAll({
                where: [
                    {
                        status: 'partial'
                    }
                ],
                include: [
                    {
                        model: this.db.Payments,
                        required: true,
                        as: 'Payments',
                        where: {
                            userId: user.userId
                        }
                    }
                ]
            })
            partialList.forEach(exp => {
                const payments = exp.Payments as PaymentsAttributes[]
                payments.forEach(payment => {
                    partially = partially + payment.amount
                })
            })
            receivable = receivable - partially
            received = received + partially
            return {
                receivable,
                paid,
                received,
                payable
            }
        } catch (e) {
            throw e
        }
    }
    public async get(id: number): Promise<ExpansesInstance> {
        return (await this.db.Expanses.findByPk(id)) as ExpansesInstance
    }
}
