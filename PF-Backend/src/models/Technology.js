const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define(
		'technology',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	)
}
