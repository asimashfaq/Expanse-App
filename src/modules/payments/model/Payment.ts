import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'
import { ExpansesShareAttributes } from '../../expanses/model/ExpansesShare'
import { UserAttributes } from '../../users/model/User'

export interface PaymentsAttributes {
    id?: number
    description: string
    amount: number
    User?: UserAttributes
    userId?: number
    expansesshareId?: number
    ExpansesShare?: ExpansesShareAttributes
    createdAt?: Date
    updatedAt?: Date
}
export interface PaymentsInstance
    extends Sequelize.Instance<PaymentsAttributes>,
        PaymentsAttributes {}

export const PaymentsFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<PaymentsAttributes> = {
        description: DataTypes.STRING,
        amount: DataTypes.INTEGER
    }

    const Payments = sequelize.define<PaymentsInstance, PaymentsAttributes>(
        'Payments',
        attributes
    )
    Payments.associate = (models): void => {
        Payments.belongsTo(models.ExpansesShares, {
            foreignKey: 'expansesshareId',
            as: 'expanseShares'
        })
        Payments.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'User'
        })
    }

    return Payments
}
