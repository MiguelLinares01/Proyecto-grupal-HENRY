const { DataTypes } = require('sequelize')
const { User } = require('./User')

module.exports = (sequelize) => {
	sequelize.define(
		'review',
		{
			rating: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					min: 1,
					max: 5,
				},
			},
			comment: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			reviewerId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
			reviewedUserId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
		},
		{ timestamps: true }
	)
}
