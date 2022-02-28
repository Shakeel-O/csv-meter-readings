module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
        account_id: {
            type: Sequelize.STRING
        },
        first_name: {
            type: Sequelize.STRING
        },
        surname: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
    });

    return Account;
};