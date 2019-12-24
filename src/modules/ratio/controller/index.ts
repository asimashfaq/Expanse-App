import Boom from 'boom'
import { BaseHandler } from '../../../helper/baseHandler'
import { DbInterface } from '../../../interfaces/DbInterface'
import { RatioAttributes, RatioInstance } from '../model/Ratio'

export default class RatioController extends BaseHandler {
    constructor(db: DbInterface) {
        super(db)
    }

    public async list(): Promise<RatioInstance[]> {
        return await this.db.Ratio.findAll()
    }

    public async get(id: number): Promise<RatioInstance> {
        try {
            const ratio = await this.db.Ratio.findByPk(id)
            if (!ratio) {
                throw Boom.notFound('Ratio not found!')
            }
            return ratio
        } catch (err) {
            throw err
        }
    }
    public async create(ratio: RatioAttributes): Promise<RatioInstance> {
        const _ratio = await this.db.Ratio.create({
            a: ratio.a,
            b: ratio.b,
            name: ratio.name,
            description: ratio.description
        })
        return _ratio
    }
    public async delete(id: number): Promise<any> {
        try {
            const ratio = await this.db.Ratio.findByPk(id)
            if (!ratio) {
                throw Boom.notFound('Ratio not found!')
            }
            return await this.db.Ratio.destroy({
                where: {
                    id: id
                }
            })
        } catch (err) {
            throw err
        }
    }
}
