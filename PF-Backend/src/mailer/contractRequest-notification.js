const transporter = require('../mailer/mailer')

const sendContractNotification = async (senderEmail, receiverEmail, contractData) => {
	const { projectDescription, budget, currency, availableTime } = contractData
	const emailOptions = {
		from: 'ForDevs 👾',
		to: receiverEmail,
		subject: '¡Nueva solicitud de contrato en ForDevs! 👾',
		text: 'Has recibido una nueva solicitud de contrato en ForDevs.',
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
                    <h1>Nueva Solicitud de Contrato</h1>
                </div>
                <div class="content">
                    <h2>¡Hola!</h2>
                    <p>👋 Has recibido una nueva solicitud de contrato de <strong>${senderEmail}</strong>.</p>
                    <p><strong>Descripción del Proyecto:</strong> ${projectDescription}</p>
                    <p><strong>Presupuesto:</strong> ${budget} ${currency}</p>
                    <p><strong>Tiempo Disponible:</strong> ${availableTime}</p>
                    <p>Por favor, inicia sesión en tu cuenta para aceptar o rechazar el contrato.</p>
                    <p>Saludos cordiales,<br>El equipo de ForDevs 🥸</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 ForDevs. Todos los derechos reservados.</p>
                </div>
            </div>
            </body>
            </html>
        `,
	}

	try {
		await transporter.sendMail(emailOptions)
		console.log('Contract notification sent to:', receiverEmail)
	} catch (error) {
		console.error('Error sending contract notification email:', error)
		throw new Error('Error sending contract notification email')
	}
}

module.exports = sendContractNotification
