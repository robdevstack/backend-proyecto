const { Pool } = require('pg');
const { query } = require('express');
const { password } = require('pg/lib/defaults');
const bcrypt = require('bcryptjs');

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'marketplace',
	allowExitOnIdle: true,
});

const getPosts = async () => {
	const result = await pool.query('select * from posts');
	return result.rows;
};

const insertPost = async (post) => {
	const values = Object.values(post);
	const consult = 'insert into posts values (default, $1, $2, $4, $3 )';
	const result = await pool.query(consult, values);
	return result;
};

const getDataUser = async (email) => {
	const values = [email];
	const consulta = 'SELECT * FROM usuarios WHERE email =$1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	if (!rowCount) {
		throw { code: 404, message: 'No se encontro usuario con ese email' };
	}
	delete usuario.password;
	return usuario;
};

const verifyCrede = async (email, password) => {
	const values = [email];
	const consulta = 'SELECT * FROM usuarios WHERE email = $1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	const { password: passwordCrypt } = usuario;
	const passwordCorrecta = bcrypt.compareSync(password, passwordCrypt);
	if (!passwordCorrecta || !rowCount) {
		throw { code: 401, message: 'Email o contraseña incorrecta' };
	}
};

const registrarUsuario = async (usuario) => {
	let { email, password } = usuario;
	const passwordCrypt = bcrypt.hashSync(password);
	const values = [email, passwordCrypt];
	const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2)';
	await pool.query(consulta, values);
};

module.exports = { getPosts, insertPost, verifyCrede, getDataUser, registrarUsuario };