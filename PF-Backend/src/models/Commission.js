const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define(
		'commission',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			rate: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			amount: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			contractId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'contracts',
					key: 'id',
				},
			},
		},
		{
			timestamps: true,
			paranoid: true,
		}
	)
}
