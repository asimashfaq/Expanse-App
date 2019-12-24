import DataLoader from 'dataloader'
import sequelize from 'sequelize'
import { DbInterface } from '../../interfaces/DbInterface'
import { RatioInstance } from './model/Ratio'
export const RatioLoader = (db: DbInterface): any => {
    return new DataLoader(async (keys: readonly number[]) => {
        const ratios = await db.Ratio.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: keys
                } as any
            }
        })
        const RatioMap: any = {}
        ratios.forEach((ratio: RatioInstance) => {
            const id = ratio.id as number
            RatioMap[id] = ratio
        })
        return keys.map((key: unknown) => RatioMap[key as number])
    })
}
