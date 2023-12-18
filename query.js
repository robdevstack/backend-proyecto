const { Pool } = require('pg');
const { query } = require('express');
const { password } = require('pg/lib/defaults');
const bcrypt = require('bcryptjs');

const pool = new Pool({
	host: 'dpg-clvhtrla73kc73bq03j0-a.oregon-postgres.render.com',
	user: 'registro_ul3l_user',
	password: '432VFfVx1c6WhSarR2h4jCe3BjItbCbZ',
	database: 'registro_ul3l',
	allowExitOnIdle: true,
});

const getPosts = async () => {
	const result = await pool.query('select * from posts');
	return result.rows;
};

const insertPost = async (post) => {
	const values = Object.values(post);
	const consult = 'insert into posts values (default, $1, $2, $3, $4)';
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
const getPostById = async (postId) => {
	const values = [postId];
	const consulta = 'SELECT * FROM posts WHERE id = $1';
	const { rows, rowCount } = await pool.query(consulta, values);
  
	if (!rowCount) {
	  return null; // No se encontró ningún post con ese ID
	}
  
	return rows[0];
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
    let { email, password, nombre } = usuario;
    const passwordCrypt = bcrypt.hashSync(password);
    const values = [email, passwordCrypt, nombre];
    const consulta = 'INSERT INTO usuarios (nombre, email, password) values ($1, $2, $3)';
    await pool.query(consulta, values);
};

module.exports = { getPosts, getPostById, insertPost, verifyCrede, getDataUser, registrarUsuario };
