import { ObjectId } from 'bson';
import Realm from 'realm';


/**
 * Realm object schema/class definition for a device object within typescript
 * https://github.com/realm/realm-js/releases
 */
export class Device extends Realm.Object<Device> {
  _id = new ObjectId;
  name = "";
  owner_id!: string;
  isOn = false;
  sensor?: number;
  // Field type which supports multiple multiple data types
  mixedTypes = "";
  // Lie because https://github.com/realm/realm-js/issues/2469
  components = [] as any;
  // Dictionary which supports adding new key value pairs with support for the 'mixed' data types
  flexibleData?: Realm.Dictionary<Realm.Mixed>;

  static schema = {
    name: 'Device',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string',
      owner_id: 'string',
      isOn: 'bool',
      sensor: 'int?',
      mixedTypes: 'mixed',
      flexibleData: '{}',
      components: 'Component[]'
    }
  }
}

/**
 * Realm object schema/class definition for a component object within typescript
 */
export class Component extends Realm.Object<Component> {
  _id!: ObjectId;
  name?: string;
  owner_id!: string;

  static schema = {
    name: 'Component',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string?',
      owner_id: 'string'
    }
  }
}

/**
 * Realm object schema/class definition for a sensor measurement object within typescript
 */
export class Sensor extends Realm.Object<Sensor> {
  static schema = {
    name: 'Sensor',
    asymmetric: true,
    primaryKey: '_id',
    properties: {
      _id: 'objectId?',
      sensorId: 'string?',
      timestamp: 'date?',
      value: 'int?',
    }
  }
}


/*

JSON Schema

{
  "title": "Sensor",
  "bsonType": "object",
  "required": [
    "_id",
    "name",
    "owner_id",
    "value"
  ],
  "properties": {
    "_id": {
      "bsonType": "objectId"
    },
    "name": {
      "bsonType": "string"
    },
    "owner_id": {
      "bsonType": "string"
    },
    "value": {
      "bsonType": "long"
    }
  }
}

*/