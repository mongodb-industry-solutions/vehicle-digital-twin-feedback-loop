import { ObjectId } from 'bson';
import Realm, { Dictionary } from 'realm';

/**
 * Realm object schema/class definition for a device object within typescript
 * https://github.com/realm/realm-js/releases
 * https://github.com/realm/realm-js/issues/1795 -> applied works
 */
export class Vehicle {
  public _id?: ObjectId | null;
  public name: string;
  public device_id!: string;
  public vin!: string;
  public isOn: boolean;
  public commands: Command[] = [];
  // Field type which supports multiple multiple data types
  public mixedTypes?: Realm.Mixed | null;
  // Lie because https://github.com/realm/realm-js/issues/2469
  public components: Component[] = [];
  // Dictionary which supports adding new key value pairs with support for the 'mixed' data types
  public flexibleData?: Realm.Dictionary<Realm.Mixed> | null;
  // Embedded battery object
  public battery?: Battery | null;

  static schema: Realm.ObjectSchema = {
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

  constructor(name: string, device_id: string, vin: string, battery: Battery) {
    this._id = new ObjectId;
    this.name = name;
    this.device_id = device_id;
    this.vin = vin;
    this.isOn = true;
    this.battery = battery;
  }
}

/**
 * Realm object schema/class definition for an embedded battery object
 */
export class Battery {
  public sn: string = "n/a";
  public capacity?: number;
  public voltage?: number;
  public current?: number;


  static schema: Realm.ObjectSchema = {
    name: 'Battery',
    embedded: true,
    properties: {
      sn: 'string?',
      capacity: 'int?',
      voltage: 'int?',
      current: 'int?'
    }
  }

  constructor(sn: string, capacity: number) {
    this.sn = sn;
    this.capacity = capacity;
  }
}

/**
 * Realm object schema/class definition for a component object within typescript
 */
export class Component {
  public _id: ObjectId;
  public name?: string | null;
  public device_id!: string;

  static schema: Realm.ObjectSchema = {
    name: 'Component',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string?',
      device_id: 'string'
    }
  }

  constructor(name: string, device_id: string) {
    this._id = new ObjectId;
    this.name = name;
    this.device_id = device_id;
  }
}

/**
 * Realm object schema/class definition for a sensor measurement object within typescript
 */
export class Sensor {
  public _id!: ObjectId;
  public device_id!: string;
  public type = 'battery';
  public sn!: string;
  public timestamp!: Date;
  public voltage!: number;
  public current!: number;

  public measurements?: Measurement[] = [{ts:"123", voltage: 12, current: 123}];

  static schema: Realm.ObjectSchema = {
    name: 'Sensor',
    asymmetric: true,
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      device_id: 'string',
      sn: 'string',
      timestamp: 'date',
      voltage: 'int',
      current: 'int',
      measurements: 'Measurement[]'
    }
  }

  constructor(device_id: string, sn: string, voltage: number, current: number) {
    this._id = new ObjectId;
    this.device_id = device_id;
    this.sn = sn;
    this.timestamp = new Date();
    this.voltage = voltage;
    this.current = current;
  }
}

/**
 * Realm object schema/class definition for measurement object
 */
 export class Measurement {
  public ts: string = "n/a";
  public voltage?: number;
  public current?: number;


  static schema: Realm.ObjectSchema = {
    name: 'Measurement',
    embedded: true,
    properties: {
      ts: 'string?',
      voltage: 'int?',
      current: 'int?'
    }
  }

  constructor(ts: string, voltage: number, current: number) {
    this.ts = ts;
    this.voltage = voltage;
    this.current = current
  }
}

/**
 * Command object to run operations on the device
 */
export class Command {
  public _id!: ObjectId;
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