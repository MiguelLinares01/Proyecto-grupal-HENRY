require('dotenv').config()
const { Sequelize } = require('sequelize')

const fs = require('fs')
const path = require('path')
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env

const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`, {
	logging: false,
	native: false,
})

//const sequelize = new Sequelize(DB_DEPLOY, {
//	logging: false,
//	native: false,
//})

// const sequelize = new Sequelize(DB_DEPLOY, {
// 	logging: false,
// 	native: false,
// })

const basename = path.basename(__filename)
const modelDefiners = []

fs.readdirSync(path.join(__dirname, '/models'))
	.filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
	.forEach((file) => {
		modelDefiners.push(require(path.join(__dirname, '/models', file)))
	})

modelDefiners.forEach((model) => model(sequelize))

let entries = Object.entries(sequelize.models)
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]])
sequelize.models = Object.fromEntries(capsEntries)

const { User, Project, Technology, Plan, Tag, Like, Contract, Review, Link, Commission } = sequelize.models

User.hasMany(Project, { foreignKey: 'userId', as: 'projects', onDelete: 'CASCADE' })
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Project.belongsToMany(Technology, { through: 'project_tech', as: 'technologies' })
Technology.belongsToMany(Project, { through: 'project_tech', as: 'projects' })

Project.belongsToMany(Tag, { through: 'project_tag', as: 'tags' })
Tag.belongsToMany(Project, { through: 'project_tag', as: 'projects' })

User.belongsTo(Plan, { foreignKey: 'planName', as: 'plan' })
Plan.hasMany(User, { foreignKey: 'planName', as: 'users' })

User.hasMany(Like, { foreignKey: 'userId', as: 'likes', onDelete: 'CASCADE' })
Like.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Project.hasMany(Like, { foreignKey: 'projectId', as: 'likes', onDelete: 'CASCADE' })
Like.belongsTo(Project, { foreignKey: 'projectId', as: 'project' })

User.hasMany(Contract, { foreignKey: 'senderId', as: 'sentContracts', onDelete: 'CASCADE'})
Contract.belongsTo(User, { foreignKey: 'senderId', as: 'sender' })

User.hasMany(Contract, { foreignKey: 'receiverId', as: 'receivedContracts', onDelete: 'CASCADE' })
Contract.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' })

User.hasMany(Review, { foreignKey: 'reviewerId', as: 'reviewsWritten' , onDelete: 'CASCADE' })
Review.belongsTo(User, { foreignKey: 'reviewedUserId', as: 'reviewedUser' })

Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' })
User.hasMany(Review, { foreignKey: 'reviewedUserId', as: 'reviewsReceived' })

User.hasMany(Link, { foreignKey: 'userId', as: 'links', onDelete: 'CASCADE' })
Link.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Contract.hasOne(Commission, { foreignKey: 'contractId', as: 'commission', onDelete: 'CASCADE' })
Commission.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' })

module.exports = {
	...sequelize.models,
	conn: sequelize,
}
