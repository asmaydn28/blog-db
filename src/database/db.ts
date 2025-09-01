import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: 'postgres://postgres:postgres@localhost:5432/blog_db'
});

export default db;
