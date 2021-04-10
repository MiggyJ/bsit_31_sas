'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'First Name should not be null.' },
        notEmpty: {msg: 'First Name should not be empty.'}
      }
    },
    middle_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Last Name should not be null.' },
        notEmpty: {msg: 'Last Name should not be empty.'}
      }
    },
    full_name: {
      type: DataTypes.STRING,
      set(value) {
        if (this.middle_name != '') {
          this.setDataValue(
            'full_name',
            this.first_name + + ' ' + this.middle_name + ' ' + this.last_name
          )
        } else {
          this.setDataValue('full_name', this.first_name + ' ' + this.last_name)
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [['Male', 'Female']],
          msg: 'Gender should be Male or Female'
        }
      }
    },
    civil_status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: 'Please enter a valid email'},
        unique: {msg: 'Email must be unique.'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Active"
    },
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'User',
  });
  return User;
};