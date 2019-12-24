import Boom from 'boom'
import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
import { TokenAttributes } from '../../token/model/Token'
import { ExpansesInput, ExpansesInstance } from '../model/Expanses'

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
        expanse: ExpansesInput,
        user: TokenAttributes
    ): Promise<any> {
        const ratio = await this.db.Ratio.findByPk(expanse.ratioId)
        if (!ratio) {
            throw Boom.notFound('Ratio not found!')
        }
        if (expanse.shares_with.length > 2) {
            throw Boom.notFound('Max two users allow')
        }
        if (expanse.shares_with.length < 2) {
            throw Boom.notFound('Minimum two users')
        }

        const personA = (ratio.a / 100) * expanse.total_amount
        const personB = (ratio.b / 100) * expanse.total_amount
        let transaction
        try {
            return (transaction = await this.db.sequelize.transaction(
                async t => {
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
                    if (false) {
                        throw new Error('Unable to create Expanse')
                    }
                    await this.db.ExpansesShares.bulkCreate(
                        [
                            {
                                amount: personA,
                                userId: expanse.shares_with[0],
                                expansesId: _expanse.id as number,
                                status: 'pending'
                            },
                            {
                                amount: personB,
                                userId: expanse.shares_with[1],
                                expansesId: _expanse.id as number,
                                status: 'pending'
                            }
                        ],
                        { transaction: t }
                    )
                    if (false) {
                        throw new Error('Unable to create Expanse Shares')
                    }
                    return _expanse
                }
            ))
        } catch (e) {
            throw e
        }
    }
}
