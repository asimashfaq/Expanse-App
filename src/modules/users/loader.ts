import DataLoader from 'dataloader'
import sequelize from 'sequelize'
import { DbInterface } from '../../interfaces/DbInterface'
import { UserAttributes } from './model/User'
export const UserLoader = (db: DbInterface): any => {
    return new DataLoader(async (keys: readonly number[]) => {
        const users = await db.User.findAll({
            where: {
                id: {
                    [sequelize.Op.in]: keys
                } as any
            }
        })
        const usersMap: any = {}
        users.forEach((user: UserAttributes) => {
            const id = user.id as number
            usersMap[id] = user
        })
        return keys.map((key: unknown) => usersMap[key as number])
    })
}
