const { DataTypes } = require('sequelize');

/*
 get attributes dari migration saja agar
 tidak susah payah harus copy paste
 */
function getAttributesFrom(arrColumnsMigrations) {
  let attributes = {};
  for (let i = 0; i < arrColumnsMigrations.length; i += 1) {
    const { create, remove } = arrColumnsMigrations[i];

    if (create) {
      attributes = {
        ...attributes,
        ...create.columns,
      };
    } else if (remove) {
      const keys = Object.keys(remove.columns);
      for (let x = 0; x < keys.length; x += 1) {
        const key = keys[x];
        delete attributes[key];
      }
    }
  }
  return attributes;
}

class Type {
  static primaryKeyUUID(disallowNull = true, props = {}) {
    return {
      allowNull: !disallowNull,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    };
  }

  static foreignKeyUUID(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.UUID,
      ...props,
    };
  }

  static integer(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.INTEGER,
      ...props,
    };
  }

  static text(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.UUID,
      ...props,
    };
  }

  static string(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.STRING,
      ...props,
    };
  }

  static boolean(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.BOOLEAN,
      ...props,
    };
  }

  static phoneNumber(disallowNull = false, props = {}) {
    return this.string(disallowNull, props);
  }

  static email(disallowNull = false, props = {}) {
    return this.string(disallowNull, props);
  }

  static date(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.DATE,
      ...props,
    };
  }

  static harga(disallowNull = false, props = {}) {
    return {
      allowNull: !disallowNull,
      type: DataTypes.BIGINT,
      ...props,
    };
  }

  static tanggalCheckInCheckOut(disallowNull = false, props = {}) {
    return this.date(disallowNull, props);
  }

  static tanggalBerlaku(disallowNull = false, props = {}) {
    return this.date(disallowNull, props);
  }
}

module.exports = {
  Type,
  getAttributesFrom,
};
