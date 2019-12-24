import { Enforcer, newEnforcer } from 'casbin'
import { SequelizeAdapter } from 'casbin-sequelize-adapter'
import path from 'path'
import { SequelizeOptions } from 'sequelize-typescript'
import Sequelize from 'sequelize/index'
import { DbInterface } from '../../interfaces/DbInterface.d'
import { ExpanseFactory } from '../../modules/expanses/model/Expanses'
import { ExpanseShareFactory } from '../../modules/expanses/model/ExpansesShare'
import { PaymentsFactory } from '../../modules/payments/model/Payment'
import { RatioFactory } from '../../modules/ratio/model/Ratio'
import { TokenFactory } from '../../modules/token/model/Token'
import { UserFactory } from '../../modules/users/model/User'

const env = process.env.NODE_ENV || 'development'

export const createModels = async (sequelizeConfig: any): Promise<any> => {
    const sequelize: Sequelize.Sequelize = new Sequelize(sequelizeConfig[env])
    const a = await SequelizeAdapter.newAdapter(
        sequelizeConfig[env] as SequelizeOptions
    )

    const enforcer: Enforcer = await newEnforcer(
        path.join(__dirname, '../../casbin.conf'),
        a
    )

    const db: DbInterface = {
        sequelize,
        Sequelize,
        User: UserFactory(sequelize, Sequelize),
        Token: TokenFactory(sequelize, Sequelize),
        Ratio: RatioFactory(sequelize, Sequelize),
        Payments: PaymentsFactory(sequelize, Sequelize),
        Expanses: ExpanseFactory(sequelize, Sequelize),
        ExpansesShares: ExpanseShareFactory(sequelize, Sequelize)
    }

    Object.keys(db).forEach(modelName => {
        if (db[modelName].associate) {
            db[modelName].associate(db)
        }
    })

    return { db, enforcer }
}
