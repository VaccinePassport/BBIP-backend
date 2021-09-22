const Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Group', {
    idx_group: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    group_no: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    idx_follow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Follow',
        key: 'idx_follow'
      }
    },
    accept: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'group',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx_group" },
        ]
      },
    ]
  });
};
