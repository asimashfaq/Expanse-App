import Sequelize from 'sequelize/index'
import {
    ExpansesAttributes,
    ExpansesInstance
} from '../modules/expanses/model/Expanses'
import {
    ExpansesShareAttributes,
    ExpansesShareInstance
} from '../modules/expanses/model/ExpansesShare'
import {
    PaymentsAttributes,
    PaymentsInstance
} from '../modules/payments/model/Payment'
import { RatioAttributes, RatioInstance } from '../modules/ratio/model/Ratio'
import { TokenAttributes, TokenInstance } from '../modules/token/model/Token'
import { UserAttributes, UserInstance } from '../modules/users/model/User'

export interface DbInterface {
    [key: string]: any
    sequelize: Sequelize.Sequelize
    Sequelize: Sequelize.SequelizeStatic
    User: Sequelize.Model<UserInstance, UserAttributes>
    Token: Sequelize.Model<TokenInstance, TokenAttributes>
    Ratio: Sequelize.Model<RatioInstance, RatioAttributes>
    Expanses: Sequelize.Model<ExpansesInstance, ExpansesAttributes>
    Payments: Sequelize.Model<PaymentsInstance, PaymentsAttributes>
    ExpansesShares: Sequelize.Model<
        ExpansesShareInstance,
        ExpansesShareAttributes
    >
}
