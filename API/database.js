import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'root',
  host: 'dpg-crl9gd8gph6c73e217u0-a.frankfurt-postgres.render.com',
  database: 'blockchain_db_ctdg',
  password: '4C8fV7fQeUinwP6kCjn9yH19mrhzCYTk',
  port: 5432,
  ssl: {
    rejectUnauthorized: false  // Important pour accepter des certificats auto-signés
  }
})



