const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define(
		'plan',
		{
			planName: {
				type: DataTypes.STRING,
				primaryKey: true,
				defaultValue: "Free",
				allowNull: false,
			},
			price: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
		},
		{
			tableName: 'plans',
		},
		{
			timestamps: true,
		}
	)
}
