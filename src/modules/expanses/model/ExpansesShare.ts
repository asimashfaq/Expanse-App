import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface ExpansesShareAttributes {
    id?: number
    amount: number
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
        amount: DataTypes.INTEGER
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
