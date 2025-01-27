import { DataTypes, Model, Optional, Sequelize } from 'sequelize';

interface PreferenceAttributes {
  id: number;
  userId: number;
  language: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  wakeTime: string;
  bedTime: string;
  weight: 'Kg' | 'lbs';
  height: 'cm' | 'ft/inches';
  bloodGlucose: 'mmol/l' | 'mg/dl';
  cholesterol: 'mmol/l' | 'mg/dl';
  bloodPressure: 'kPa' | 'mmHg';
  distance: 'km' | 'miles';
  systemEmails: boolean;
  memberServiceEmails: boolean;
  sms: boolean;
  phoneCall: boolean;
  post: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type PreferenceCreationAttributes = Optional<PreferenceAttributes, 'id'>;

class Preference extends Model<PreferenceAttributes, PreferenceCreationAttributes> implements PreferenceAttributes {
  public id!: number;
  public userId!: number;
  public language!: string;
  public breakfast!: string;
  public lunch!: string;
  public dinner!: string;
  public wakeTime!: string;
  public bedTime!: string;
  public weight!: 'Kg' | 'lbs';
  public height!: 'cm' | 'ft/inches';
  public bloodGlucose!: 'mmol/l' | 'mg/dl';
  public cholesterol!: 'mmol/l' | 'mg/dl';
  public bloodPressure!: 'kPa' | 'mmHg';
  public distance!: 'km' | 'miles';
  public systemEmails!: boolean;
  public memberServiceEmails!: boolean;
  public sms!: boolean;
  public phoneCall!: boolean;
  public post!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initModel(sequelize: Sequelize) {
    Preference.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        language: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        breakfast: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lunch: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        dinner: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        wakeTime: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        bedTime: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        weight: {
          type: DataTypes.ENUM('Kg', 'lbs'),
          allowNull: true,
        },
        height: {
          type: DataTypes.ENUM('cm', 'ft/inches'),
          allowNull: true,
        },
        bloodGlucose: {
          type: DataTypes.ENUM('mmol/l', 'mg/dl'),
          allowNull: true,
        },
        cholesterol: {
          type: DataTypes.ENUM('mmol/l', 'mg/dl'),
          allowNull: true,
        },
        bloodPressure: {
          type: DataTypes.ENUM('kPa', 'mmHg'),
          allowNull: true,
        },
        distance: {
          type: DataTypes.ENUM('km', 'miles'),
          allowNull: true,
        },
        systemEmails: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        memberServiceEmails: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        sms: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        phoneCall: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        post: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
      },
      {
        sequelize,
        tableName: 'preferences',
        timestamps: true,
      }
    );
  }
}

export default Preference;
