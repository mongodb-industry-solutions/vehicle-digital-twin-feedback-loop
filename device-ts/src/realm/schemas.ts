import { ObjectId } from 'bson';
import Realm, { Dictionary } from 'realm';
import { MessageChannel } from 'worker_threads';

/**
 * Realm object schema/class definition for a device object within typescript
 */
export class Vehicle extends Realm.Object<Vehicle> {
  public _id!: ObjectId | null;
  public name!: string;
  public device_id!: string;
  public vin!: string;
  public isOn!: boolean;
  public commands?: Command[] = [];
  // Field type which supports multiple multiple data types
  public mixedTypes?: Realm.Mixed | null;
  // Lie because https://github.com/realm/realm-js/issues/2469
  public components?: Component[] = [];
  // Dictionary which supports adding new key value pairs with support for the 'mixed' data types
  public flexibleData?: Realm.Dictionary<Realm.Mixed> | null;
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
      commands: 'Command[]',
      mixedTypes: 'mixed?',
      flexibleData: '{}',
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


  static schema = {
    name: 'Battery',
    embedded: true,
    properties: {
      sn: 'string?',
      capacity: 'int?',
      voltage: 'int?',
      current: 'int?'
    }
  }
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

/**
 * Command object to run operations on the device
 */
export class Command {
  public _id: ObjectId = new ObjectId;
  public device_id!: string;
  public command: string;
  public parameter?: Dictionary;
  public status?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Command',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      device_id: 'string',
      command: 'string',
      parameter: 'string{}',
      status: 'string'
    }
  }

  constructor(device_id: string, command: string, parameter?: Dictionary) {
    this.device_id = device_id;
    this.command = command;
    this.parameter = parameter
  }
}