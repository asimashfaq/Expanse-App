import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'
import { RatioAttributes } from '../../ratio/model/Ratio'
import { UserAttributes } from '../../users/model/User'
import { ExpansesShareAttributes } from './ExpansesShare'

export interface ExpansesAttributes {
    id?: number
    name: string
    description: string
    total_amount: number
    ratioId: number
    userId: number
    shares_with?: number[]
    Ratio?: RatioAttributes
    User?: UserAttributes
    ExpansesShares?: ExpansesShareAttributes[]
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
        Expanses.hasMany(models.ExpansesShares, {
            foreignKey: 'expansesId',
            as: 'ExpansesShares'
        })
    }

    return Expanses
}
