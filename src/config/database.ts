import 'dotenv/config';

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    }
  },
  test: {
    url: process.env.DATABASE_TEST_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? { require: true, rejectUnauthorized: false } : false
    }
  }
};
