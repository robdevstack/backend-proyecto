CREATE DATABASE marketplace;
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  titulo VARCHAR(1000),
  img TEXT,
  descripcion TEXT,
  precio VARCHAR(25)
);
CREATE TABLE usuarios (
	id SERIAL PRIMARY KEY,
  numero VARCHAR(225),
  nombre VARCHAR(50)
	email VARCHAR(255),
	password TEXT
);

INSERT INTO posts (id, titulo, img, descripcion, precio) VALUES (1, 'auto rojo clasico', 'https://docs.gimp.org/2.8/es/images/tutorials/quickie-jpeg-100.jpg', 'Auto clasico de lujo bien cuidado por años', 3500000  );
