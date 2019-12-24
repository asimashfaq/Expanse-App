import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
import { ExpansesAttributes, ExpansesInstance } from '../model/Expanses'
export default class ExpanseController extends BaseHandler {
    constructor(db: DbInterface) {
        super(db)
    }

    public async list(): Promise<ExpansesInstance[]> {
        return await this.db.Expanses.findAll()
    }
    public async create(
        expanse: ExpansesAttributes
    ): Promise<ExpansesAttributes> {
        const _expanse = await this.db.Expanses.create({
            name: expanse.name,
            description: expanse.description,
            total_amount: expanse.total_amount
        })
        return _expanse
    }
}
