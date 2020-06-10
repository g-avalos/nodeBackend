const express = require("express");
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

var key = "CLAVE";

app.set('key', key);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const secure = express.Router(); 
secure.use((req, res, next) => {
    const token = req.headers['authorization'];
 
    if (token) {
		jwt.verify(token, app.get('key'), (err, decoded) => {        
			if (err) {
				return res.json({ codigo: -1000,
								descripcion: 'token verificado invalido' });    
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		res.send({ codigo: -1000,
				descripcion: 'token invalido' });
    }
});

app.post('/login', function(req, res) {
	const payload = {
		usuario: req.body.usuario
	};
	
	console.log('Usuario ' + payload.usuario);

	var usuario = req.body.usuario;
	var pwd = req.body.password;
	
	// Validar con DB o lo que sea
	if (usuario === "ADMIN" && pwd === "ADMIN") {		
		const token = jwt.sign(payload, app.get('key'), {
			expiresIn: 1440 // Ver de parametrizar el timeout
		});

		res.set('Authorization', "Bearer " + token);

		res.json({
			codigo: 0,
			descripcion: 'OK'
		});
	
		console.log('Token generado ' + token);
	} else {
		res.json({
			codigo: -1001,
			descripcion: 'Credencial invalida'
		});
	}
});

app.get('/consulta', secure, function (req, res) {
	var parametro = req.query.parametro;
    
	console.log('Parametro ' + parametro);
	
	// Consutla a DAO
	if (parametro === "IFTS11") {
		return res.json({
			codigo: 0,
			descripcion: 'OK',
			cliente: {
				id: '1',
				instituto: 'IFTS11'
			}
		});
	}

	res.json({
		codigo: -1004,
		descripcion: 'IFTS inexistente'
	});
});

app.post('/add', secure, function (req, res) {
	var id = req.body.id;
    var ifts = req.body.ifts;
    
	console.log('id ' + id);
	console.log('Ifts ' + ifts);
 
	if (id !== "ID001") {
		return res.json({
			codigo: -1005,
			descripcion: 'id existente'
		});
	}

	if (ifts !== 'IFTS11') {
		return res.json({
			codigo: -10006,
			descripcion: 'descripcion invalida'
		});
	}

	res.json({
		codigo: 0,
		descripcion: 'OK'
	});
});

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});
