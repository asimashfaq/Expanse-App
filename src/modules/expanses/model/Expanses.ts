import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface ExpansesAttributes {
    id?: number
    name: string
    description: string
    total_amount: number
    createdAt?: Date
    updatedAt?: Date
}

export interface ExpansesInstance
    extends Sequelize.Instance<ExpansesAttributes>,
        ExpansesAttributes {}

export const ExpanseFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<ExpansesAttributes> = {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        total_amount: DataTypes.INTEGER
    }

    const Expanses = sequelize.define<ExpansesInstance, ExpansesAttributes>(
        'Expanses',
        attributes
    )
    Expanses.associate = (models): void => {
        Expanses.belongsTo(models.Ratio, { foreignKey: 'ratioId', as: 'Ratio' })
        Expanses.belongsTo(models.User, { foreignKey: 'userId', as: 'User' })
    }

    return Expanses
}
