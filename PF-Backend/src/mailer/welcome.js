const transporter = require('../mailer/mailer')

const welcome = async (email) => {
	console.log(email + ' console de email welcome')
	try {
		await transporter.sendMail({
			from: 'ForDevs 👾',
			to: email,
			subject: '¡Bienvenido a ForDevs! 👾',
			text: '¡Bienvenido a ForDevs! Estamos emocionados de que te unas a nuestra comunidad.',
			html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@300;400;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Lexend', sans-serif;
                        background-color: #00BF63;
                        margin: 0;
                        padding: 0;
                        color: #333;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #D1FFCE;
                        padding: 20px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        background-color: #00BF63;
                        color: #ffffff;
                        padding: 10px 0;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 24px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h2 {
                        color: #009e0d;
                    }
                    .footer {
                        text-align: center;
                        padding: 10px 0;
                        font-size: 12px;
                        color: #454545;
                    }
                </style>
                </head>
                <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Bienvenido a ForDevs!</h1>
                    </div>
                    <div class="content">
                        <h2>¡Hola y Bienvenido!</h2>
                        <p>👋 ¡Gracias por unirte a <strong>ForDevs</strong>! Estamos emocionados de tenerte como parte de nuestra comunidad. Esto es lo que puedes hacer como miembro:</p>
                        <ul>
                            <li>🔥 Explora nuestros <a href="https://pf-fordevs.vercel.app/" style="color: #019426;">inicio/a> para aprender nuevas habilidades.</li>
                            <li>💬 Únete a nuestros <a href="https://pf-fordevs.vercel.app/" style="color: #019426;">proyectos</a> y conéctate con otros desarrolladores.</li>
                            <li>📚 Accede a nuestros <a href="https://pf-fordevs.vercel.app/" style="color:#019426 ;">recursos</a> para mejorar tu experiencia de aprendizaje.</li>
                        </ul>
                        <p>Si tienes alguna pregunta o necesitas asistencia, por favor contacta a nuestro equipo de soporte en <a href="mailto:fordevs@support.com" style="color: #019426;">fordevs@support.com</a>.</p>
                        <p>¡Feliz codificación! 💻 </p>
                        <p>Saludos cordiales,<br>El equipo de ForDevs 🥸</p>
                    </div>
                    <div class="footer">
                        <p>&copy; 2024 ForDevs. Todos los derechos reservados.</p>
                    </div>
                </div>
                </body>
                </html>
            `,
		})

		console.log('Mensaje enviado:')
	} catch (error) {
		console.log(error)
		throw new Error('Error sendind welcome email:', error)
	}
}

module.exports = welcome
