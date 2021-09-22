var DataTypes = require("sequelize").DataTypes;
var _follow = require("./follow");
var _group = require("./group");
var _user = require("./user");

function initModels(sequelize) {
  var follow = _follow(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  user.hasMany(follow, {as: "following", foreignKey:"following_id"});
  follow.belongsTo(user, {as: "user_of_following_id", foreignKey: "following_id"});

  user.hasMany(follow, {as: "followed", foreignKey:"followed_id"});
  follow.belongsTo(user, {as: "user_of_followed_id", foreignKey: "followed_id"});

  follow.hasMany(group, {as: "groups", foreignKey: "idx_follow"});
  group.belongsTo(follow, {as: "follow_follow_idx_follow", foreignKey: "idx_follow"});

  return {
    follow,
    group,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
