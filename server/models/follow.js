const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Follow', {
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
    bookmark: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0
    },
    accept: {
      type: DataTypes.INTEGER,
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
    tableName: 'follow',
    timestamps: true,
    underscored: true,
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
