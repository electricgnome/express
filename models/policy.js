'use strict';
module.exports = (sequelize, DataTypes) => {
  var policy = sequelize.define('policy', {
    policy_id: DataTypes.STRING,
    carrier: DataTypes.STRING,
    policy_type: DataTypes.STRING,
    agent: DataTypes.STRING,
    down_payment: DataTypes.DECIMAL(5,2),
    premium: DataTypes.DECIMAL(5,2),
    effective_date: DataTypes.DATEONLY,
    renewal_date: DataTypes.DATEONLY,
    status: DataTypes.STRING
  }, {});
  policy.associate = function(models) {
    // associations can be defined here
  };
  return policy;
};