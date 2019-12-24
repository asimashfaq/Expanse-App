import Boom from 'boom'
import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
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
        if (peoples.length < 1) {
            throw Boom.notFound('Minimum two users')
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
                await this.db.ExpansesShares.bulkCreate(
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
            let receivable = 0,
                paid = 0,
                recevied = 0
            explist.forEach(exp => {
                const expshare = exp.ExpansesShares as ExpansesShareAttributes
                if (expshare.status == 'pending') {
                    receivable = receivable + expshare.amount
                } else if (
                    expshare.status == 'paid' &&
                    expshare.userId == user.userId
                ) {
                    paid = paid + expshare.amount
                } else {
                    recevied = recevied + expshare.amount
                }
            })

            return {
                receivable: receivable === null ? 0 : receivable,
                paid: paid === null ? 0 : paid,
                recevied: recevied === null ? 0 : recevied
            }
        } catch (e) {
            throw e
        }
    }
    public async get(id: number): Promise<ExpansesInstance> {
        return (await this.db.Expanses.findByPk(id)) as ExpansesInstance
    }
}
