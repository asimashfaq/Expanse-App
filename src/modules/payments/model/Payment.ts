import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface PaymentsAttributes {
    id?: number
    name: string
    description: string
    amount: number
    //userId: number
    //expansesId: number
    status: string
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
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        amount: DataTypes.INTEGER,
        status: DataTypes.STRING
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
    }

    return Payments
}
