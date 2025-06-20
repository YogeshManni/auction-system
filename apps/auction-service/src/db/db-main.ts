const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  connection: {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'user',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'auction_db',
  },
});

knex.raw('select 1+1 as result').catch((err) => {
  console.log(err);
  process.exit(1);
});

export const bookshelf = require('bookshelf')(knex);
