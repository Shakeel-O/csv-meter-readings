module.exports = {
  dialect: "sqlite",
  storage: ':memory:',
    pool: {
    max: 1,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};