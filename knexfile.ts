import type { Knex } from 'knex';

const config: { [key:string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1', 
      database: 'blog_db',
      user: 'postgres',
      password: 'postgres'
    },
    migrations: {
      directory: './src/database/migrations'
    }
  }
};




export default config;