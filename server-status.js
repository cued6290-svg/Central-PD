const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  try {
    if (event.httpMethod === 'GET') {
      const result = await pool.query(
        'SELECT status FROM server_status ORDER BY updated_at DESC LIMIT 1'
      );
      
      const status = result.rows[0]?.status || 'ONLINE';
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status })
      };
    }

    if (event.httpMethod === 'POST') {
      const { status } = JSON.parse(event.body);
      
      if (!status) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ message: 'Status es requerido' })
        };
      }

      await pool.query(
        'INSERT INTO server_status (status, updated_at) VALUES ($1, NOW())',
        [status]
      );
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Estado guardado', status })
      };
    }

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Error en el servidor', error: error.message })
    };
  }
};

Haz clic en "Commit changes"
Repite el proceso para crear package.json en la raíz:
{
  "name": "central-pd",
  "version": "1.0.0",
  "dependencies": {
    "pg": "^8.11.0"
  }
}
