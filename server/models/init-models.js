var DataTypes = require("sequelize").DataTypes;
var _follow = require("./follow");
var _group = require("./group");
var _user = require("./user");

function initModels(sequelize) {
  var follow = _follow(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  return {
    follow,
    group,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
