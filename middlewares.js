const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkCrede = (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(401).send({ message: 'No se recibieron las credenciales' });
	}
	next();
};

const reportQuery = async (req, res, next) => {
	const url = req.url;
	console.log(
		`
Hoy ${new Date()}
 ha recibido una consulta en la ruta ${url}
`
	);
	next();
};

const verifyToken = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split("Bearer ")[1];
        if (!token) {
            throw {
                code: 401,
                message: "Debe incluir el token en el header"
            };
        }

        const decodedToken = jwt.verify(token, process.env.SECRET);
        // Ensure decodedToken is truthy before proceeding
        if (!decodedToken) {
            throw {
                code: 401,
                message: "El token es inválido"
            };
        }

        // Puedes acceder a los datos de decodedToken si es necesario, por ejemplo, decodedToken.userId

        next();
    } catch (error) {

    }
};


module.exports = { checkCrede, reportQuery, verifyToken };