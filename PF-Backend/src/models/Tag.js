const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define(
		'tag',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			tagName: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		}
	)
}
