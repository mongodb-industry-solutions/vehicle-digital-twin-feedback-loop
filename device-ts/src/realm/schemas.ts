import { ObjectId } from 'bson';
import Realm, { Dictionary } from 'realm';

/**
 * Realm object schema/class definition for a device object within typescript
 */
export class Vehicle extends Realm.Object<Vehicle> {
  public _id!: ObjectId | null;
  public name!: string;
  public device_id!: string;
  public vin!: string;
  public isOn!: boolean;
  public cmds?: Cmd[] = [];
  // Field type which supports multiple multiple data types
  public mixedTypes?: Realm.Mixed | null;
  // Lie because https://github.com/realm/realm-js/issues/2469
  public components?: Component[] = [];
  // Embedded battery object
  public battery?: Unmanaged<Battery> | null;

  static schema = {
    name: 'Vehicle',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      device_id: 'string',
      vin: 'string',
      isOn: 'bool',
      cmds: { type: 'list', objectType: 'Cmd' },
      mixedTypes: 'mixed?',
      components: 'Component[]',
      battery: 'Battery?'
    }
  }
}

/**
 * Realm object schema/class definition for an embedded battery object
 */
export class Battery extends Realm.Object<Battery> {
  public sn: string = "n/a";
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

export class Cmd extends Realm.Object<Cmd> {
  
  public command?: string;
  public status?: string;

  static schema = {
    name: 'Cmd',
    embedded: true,
    properties: {
      command: 'string?',
      status: 'string?',
    },
  };
}


/**
 * Realm object schema/class definition for a component object within typescript
 */
export class Component extends Realm.Object<Component> {
  public _id?: ObjectId;
  public name?: string | null;
  public device_id!: string;

  static schema = {
    name: 'Component',
    primaryKey: '_id',
    properties: {
      _id: 'objectId?',
      name: 'string?',
      device_id: 'string'
    }
  }
}

/**
 * Realm object schema/class definition for a sensor measurement object within typescript
 */
export class Sensor extends Realm.Object<Component> {
  public _id!: ObjectId;
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
 * Realm object schema/class definition for measurement object
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