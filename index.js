const express = require('express');
const morgan = require('morgan-body');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { getPosts, insertPost } = require('./query');
const { verifyCrede, getDataUser, registrarUsuario } = require('./query');
const { checkCrede, verifyToken, reportQuery } = require('./middlewares');
require('dotenv').config();

const app = express();
const PORT = 3000;

morgan(app);
app.use(cors());
app.use(express.json());

app.get('/posts', verifyToken, async (req, res) => {
	try {
	  const token = req.header('Authorization').split('Bearer ')[1];
	  const { email } = jwt.decode(token);
	  
	  // Obtener el ID del usuario autenticado
	  const usuario = await getDataUser(email);
  
	  const posts = await getPosts(usuario.id);
	  res.json(posts);
	} catch (error) {
	  console.error('Error al obtener los posts:', error.message);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });
app.post('/posts', async (req, res) => {
	const post = req.body;
	const result = await insertPost(post);
	res.json(result);
});

app.post('/login', checkCrede, reportQuery, async (req, res) => {
	try {
		const { email, password } = req.body;
		await verifyCrede(email, password);
		const token = jwt.sign({ email }, process.env.SECRET);
		res.send(token);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get('/usuarios', reportQuery, verifyToken, async (req, res) => {
	try {
		const token = req.header('Authorization').split('Bearer ')[1];
		const { email } = jwt.decode(token);
		const usuario = await getDataUser(email);
		res.json(usuario);
	} catch (error) {
		res.status(500).send(error);
	}
});
app.get('/posts/:id', async (req, res) => {
	try {
	  const postId = req.params.id;
	  const post = await getPostById(postId);
  
	  if (!post) {
		return res.status(404).json({ error: 'Post not found' });
	  }
  
	  res.json(post);
	} catch (error) {
	  console.error('Error al obtener el post por ID:', error);
	  res.status(500).json({ error: 'Internal Server Error' });
	}
  });

app.post('/usuarios', reportQuery, async (req, res) => {
	try {
		const usuario = req.body;
		await registrarUsuario(usuario);
		res.send('Usuario creado con éxito');
	} catch (error) {
		res.status(500).send(error);
	}
});

app.listen(PORT, console.log('servidor on '));


