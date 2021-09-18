const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User', {
    idx_user: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    birth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    device_token: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    qr_password: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    verification_number: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sign_up_verification: {
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
    tableName: 'user',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idx_user" },
        ]
      },
    ]
  });
};
