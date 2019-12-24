import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface ExpansesAttributes {
    id?: number
    name: string
    description: string
    total_amount: number
    ratioId: number
    userId: number
    createdAt?: Date
    updatedAt?: Date
}

export interface ExpansesInput extends ExpansesAttributes {
    shares_with: number[]
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
        total_amount: DataTypes.INTEGER,
        ratioId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER
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
