const { Pool } = require('pg');
const { query } = require('express');
const { password } = require('pg/lib/defaults');
const bcrypt = require('bcryptjs');

const DBConnLink ='postgres://registro_ul3l_user:432VFfVx1c6WhSarR2h4jCe3BjItbCbZ@dpg-clvhtrla73kc73bq03j0-a.oregon-postgres.render.com/registro_ul3l'

const pool = new Pool({
	connectionString: DBConnLink,
	ssl: {
		rejectUnauthorized: false
	},
});

const getPosts = async (usuarioId) => {
	const consulta = 'SELECT * FROM posts WHERE usuario_id = $1';
	const result = await pool.query(consulta, [usuarioId]);
	return result.rows;
  };

const insertPost = async (post) => {
	try {
	  const usuarioId = post.usuario_id; // Asume que usuario_id está en el objeto post
	  const { titulo, img, descripcion, precio } = post;
  
	  const consulta = 'INSERT INTO posts (usuario_id, titulo, img, descripcion, precio) VALUES ($1, $2, $3, $4, $5) RETURNING *';
	  const values = [usuarioId, titulo, img, descripcion, precio];
  
	  const result = await pool.query(consulta, values);
  
	  if (result.rows.length > 0) {
		// Devuelve el nuevo post insertado
		return result.rows[0];
	  } else {
		throw new Error('Error al insertar el post. No se devolvió ningún resultado.');
	  }
	} catch (error) {
	  console.error('Error en la función insertPost:', error);
	  throw error;
	}
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
    const consulta = 'INSERT INTO usuarios (email, password, nombre) values ($1, $2, $3)';
    await pool.query(consulta, values);
};

module.exports = { getPosts, getPostById, insertPost, verifyCrede, getDataUser, registrarUsuario };
