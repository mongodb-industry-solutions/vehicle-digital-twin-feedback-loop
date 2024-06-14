
import Realm, {BSON} from 'realm';

/**
 * Schema/class definition for the vehicle object
 */
export class Vehicle extends Realm.Object<Vehicle> {
  public _id!: string;
  public name!: string;
  public owner_id!: string;
  public isOn!: boolean;
  public commands!: Realm.List<Command>;
  public mixedTypes?: Realm.Mixed;  // Field type which supports multiple data types
  public components!: Realm.List<Component>;
  public battery?: Battery;

  static schema = {
    name: 'Vehicle',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      name: 'string',
      owner_id: 'string',
      isOn: 'bool',
      commands: 'Command[]',
      mixedTypes: 'mixed?',
      components: 'Component[]',
      battery: 'Battery?'
    }
  }
}

/**
 * Schema/class definition for an embedded battery object
 */
export class Battery extends Realm.Object<Battery> {
  public sn?: string;
  public capacity?: number;
  public voltage?: number;
  public current?: number;
  public status?: string;

  static schema = {
    name: 'Battery',
    embedded: true,
    properties: {
      sn: 'string?',
      capacity: 'int?',
      voltage: 'int?',
      current: 'int?',
      status: 'string?'
    }
  }
}

/**
 * Schema/class definition for a commands list command object
 */
export class Command extends Realm.Object<Command> {
  public command?: string;
  public status?: string;
  public ts?: Date;

  static schema = {
    name: 'Command',
    embedded: true,
    properties: {
      command: 'string?',
      status: 'string?',
      ts: 'date?'
    },
  };
}

/**
 * Schema/class definition for a component object
 */
export class Component extends Realm.Object<Component> {
  public _id?: BSON.ObjectId;
  public name?: string | null;
  public owner_id!: string;

  static schema = {
    name: 'Component',
    primaryKey: '_id',
    properties: {
      _id: 'objectId?',
      name: 'string?',
      owner_id: 'string'
    }
  }
}

/**
 * Schema/class definition for a sensor measurement object
 */
export class Sensor extends Realm.Object<Component> {
  public _id!: BSON.ObjectId;
  public vin!: string;
  public type = 'battery';
  public sn?: string;
  public measurements!: Realm.List<Measurement>;

  static schema = {
    name: 'Sensor',
    asymmetric: true,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      vin: 'string',
      type: 'string',
      sn: 'string?',
      measurements: 'Measurement[]'
    }
  }
}

/**
 * Schema/class definition for measurement object
 */
export class Measurement extends Realm.Object<Measurement> {
  public ts!: Date;
  public voltage?: number;
  public current?: number;

  static schema: Realm.ObjectSchema = {
    name: 'Measurement',
    embedded: true,
    properties: {
      ts: 'date',
      voltage: 'int?',
      current: 'int?'
    }
  }
}