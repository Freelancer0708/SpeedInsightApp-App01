<h2>インストールに必要なもの</h2>
<code>npm install next@latest react@latest react-dom@latest
npm install --save-dev typescript @types/react @types/node
npm install next react react-dom typescript @types/react @types/node
npm install mysql2 sequelize
npm install bcryptjs jsonwebtoken
npm install --save-dev @types/bcryptjs
npm install axios
npm install @types/axios
npm install cookie                
npm install --save-dev @types/cookie
npm install sequelize mysql2 bcryptjs dotenv
npm install axios cheerio
npm install image-size
</code>

<h3>.env</h3>
<code>MYSQL_HOST=
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
JWT_SECRET=
</code>

<h3>MySQL</h3>

<code>mysql -u root -p</code>

<code>CREATE DATABASE exampledb;</code>

<code>USE exampledb;</code>

<code>CREATE TABLE Admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);</code>

<code>CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);</code>

<p>Adminsのログイン情報</p>
<code>INSERT INTO Admins (email, password, createdAt, updatedAt)
VALUES ('admin@mail.com', '$2a$10$Mzo/AcrOkAZScKDUmnBoJ.vZgZe8cVWo6AfDENJZXo7onZhITvtyS', NOW(), NOW());</code>
