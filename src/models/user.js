'use strict';
const {
  Model
} = require('sequelize');

// const PROTECTED_ATTRIBUTES = ['password', 'birthdate']

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(User, {
        as: "created",
        foreignKey: "created_by",
      })

      this.belongsTo(User, {
        as: "updated",
        foreignKey: "updated_by",
      })
    }

    toJSON() {
      
      // DI KO NASABAYAN TONG PART NA TO HEHE
      // let attributes = this.get()
      // for (key of PROTECTED_ATTRIBUTES) {
      //   delete attributes[key]
      // }

      // return attributes

      return { ...this.get(), password: undefined }
      
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
      },
      unique: {msg: 'Email must be unique.'}
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
    created_by: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id'
      }
    },
    updated_by: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'id'
      }
    }
  }, {
    sequelize,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    modelName: 'User',
  });
  return User;
};
