var DataTypes = require("sequelize").DataTypes;
var _follow = require("./follow");
var _user = require("./user");

function initModels(sequelize) {
  var follow = _follow(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  follow.belongsTo(user, { as: "following", foreignKey: "following_id"});
  user.hasMany(follow, { as: "follows", foreignKey: "following_id"});
  follow.belongsTo(user, { as: "followed", foreignKey: "followed_id"});
  user.hasMany(follow, { as: "followed_follows", foreignKey: "followed_id"});

  return {
    follow,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
