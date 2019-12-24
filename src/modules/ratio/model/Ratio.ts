import Sequelize from 'sequelize/index'
import { SequelizeAttributes } from '../../../interfaces/SequelizeAttributes'

export interface RatioAttributes {
    id?: number
    name: string
    description: string
    a: number
    b: number
    createdAt?: Date
    updatedAt?: Date
}

export interface RatioInstance
    extends Sequelize.Instance<RatioAttributes>,
        RatioAttributes {}

export const RatioFactory = (
    sequelize: Sequelize.Sequelize,
    DataTypes: Sequelize.DataTypes
) => {
    const attributes: SequelizeAttributes<RatioAttributes> = {
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        a: DataTypes.INTEGER,
        b: DataTypes.INTEGER
    }

    const Ratio = sequelize.define<RatioInstance, RatioAttributes>(
        'Ratio',
        attributes
    )

    return Ratio
}
