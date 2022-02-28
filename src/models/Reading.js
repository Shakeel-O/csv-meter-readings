module.exports = (sequelize, Sequelize) => {
  const Reading = sequelize.define("reading", {
    meter_reading: {
      type: Sequelize.STRING
    },
    account_id: {
      type: Sequelize.STRING
    },
    reading: {
      type: Sequelize.INTEGER
    }
  });

  return Reading;
};