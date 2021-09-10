const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('follow', {
    idx_follow: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    following_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idx_user'
      }
    },
    followed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'idx_user'
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    bookmark: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    accept: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'follow',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx_follow" },
        ]
      },
      {
        name: "fk_follow_user",
        using: "BTREE",
        fields: [
          { name: "followed_id" },
        ]
      },
      {
        name: "fk_follow_user1",
        using: "BTREE",
        fields: [
          { name: "following_id" },
        ]
      },
    ]
  });
};
