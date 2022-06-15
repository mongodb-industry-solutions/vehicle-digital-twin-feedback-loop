import { ObjectId } from 'bson';
import Realm from 'realm';


/**
 * Realm object schema/class definition for a device object within typescript
 */
export class Device {
  static schema: Realm.ObjectSchema = {
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

  _id: ObjectId;
  name = "";
  owner_id: string;
  isOn = false;
  sensor?: number;
  // Field type which supports multiple multiple data types
  mixedTypes = "";
  // Lie because https://github.com/realm/realm-js/issues/2469
  components = [] as any;
  // Dictionary which supports adding new key value pairs with support for the 'mixed' data types
  flexibleData?: Realm.Dictionary<Realm.Mixed>;

  constructor(
    name: string,
    owner_id: string
  ) {
    this.name = name;
    this.owner_id = owner_id;
    this._id = new ObjectId
  }
}

/**
 * Realm object schema/class definition for a component object within typescript
 */
export class Component {
  static schema: Realm.ObjectSchema = {
    name: 'Component',
    primaryKey: '_id',
    properties: {
      _id: 'objectId',
      name: 'string?',
      owner_id: 'string'
    }
  }

  _id = new ObjectId;
  name?: string;
  owner_id: string;

  constructor(name: string, owner_id: string) {
    this.name = name;
    this.owner_id = owner_id;
  }
}

/**
 * Realm object schema/class definition for a sensor measurement object within typescript
 */
export class Sensor {
  static schema: Realm.ObjectSchema = {
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