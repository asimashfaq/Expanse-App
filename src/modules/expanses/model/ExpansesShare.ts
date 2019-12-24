import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface ExpansesShareAttributes {
    id?: number
    amount: number
    userId: number
    expansesId: number
    status: string
    createdAt?: Date
    updatedAt?: Date
}

export interface ExpansesShareInstance
    extends Sequelize.Instance<ExpansesShareAttributes>,
        ExpansesShareAttributes {}

export const ExpanseShareFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<ExpansesShareAttributes> = {
        amount: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        expansesId: DataTypes.INTEGER,
        status: DataTypes.STRING
    }

    const ExpansesShares = sequelize.define<
        ExpansesShareInstance,
        ExpansesShareAttributes
    >('ExpansesShares', attributes)
    ExpansesShares.associate = (models): void => {
        ExpansesShares.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'Users'
        })
        ExpansesShares.belongsTo(models.Expanses, {
            foreignKey: 'expansesId',
            as: 'Expanses'
        })
    }

    return ExpansesShares
}
