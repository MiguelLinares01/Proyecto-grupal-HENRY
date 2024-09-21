const { DataTypes } = require('sequelize')
const { Plan } = require('./Plan')

module.exports = (sequelize) => {
	const User = sequelize.define(
		'user',
		{
			id: {
				type: DataTypes.UUID,
				primaryKey: true,
				defaultValue: DataTypes.UUIDV4,
			},
			userName: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					len: {
						args: [3, 30],
						msg: 'Username should be between 3 and 30 characters',
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: {
						msg: 'Email must be a valid email address',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			bio: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
				validate: {
					len: {
						args: [0, 300],
						msg: 'Bio should be up to 300 characters',
					},
				},
			},
			aboutMe: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: '',
				validate: {
					len: {
						args: [0, 5000],
						msg: 'Bio should be up to 5000 characters',
					},
				},
			},
			image: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue:
					'https://img.freepik.com/psd-gratis/ilustracion-3d-avatar-o-perfil-humano_23-2150671118.jpg?ga=GA1.1.809440281.1720916925',
				isUrl: true,
			},
			role: {
				type: DataTypes.ENUM('user', 'admin'),
				allowNull: false,
				defaultValue: 'user',
			},
			planName: {
				type: DataTypes.STRING,
				references: {
					model: Plan,
					key: 'planName',
				},
			},
		},
		{
			tableName: 'users',
			timestamps: true,
			paranoid: true,
		}
	)
	User.beforeCreate((user) => {
		if (user.role === 'user' && !user.planName) {
			user.planName = 'Free'
		}
	})

	return User
}
