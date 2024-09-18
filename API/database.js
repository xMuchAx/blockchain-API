import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DATABASE_USER || 'root',
  host: process.env.DATABASE_HOST || 'dpg-crl9gd8gph6c73e217u0-a.frankfurt-postgres.render.com',
  database: process.env.DATABASE_NAME || 'blockchain_db_ctdg',
  password: process.env.DATABASE_PASSWORD || '4C8fV7fQeUinwP6kCjn9yH19mrhzCYTk',
  port: process.env.DATABASE_PORT || 5432,
  ssl: {
    rejectUnauthorized: false 
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erreur de connexion à la base de données', err.stack);
  }

  console.log('Connexion réussie à la base de données');

  client.query('SELECT * from cat_users', (err, result) => {
    release(); 
    if (err) {
      return console.error('Erreur lors de la requête', err.stack);
    }
    console.log('Résultat de la requête :', result.rows);
  });
});

// Ajoute cette ligne pour exporter pool
export { pool };
