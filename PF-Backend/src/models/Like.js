const { DataTypes } = require('sequelize')
const { User } = require('./User')
const { Project } = require('./Project')

module.exports = (sequelize) => {
	sequelize.define(
		'like',
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			userId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: User,
					key: 'id',
				},
			},
			projectId: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: Project,
					key: 'id',
				},
			},
		},
		{ timestamp: true }
	)
}
