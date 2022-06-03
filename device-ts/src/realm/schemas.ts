import { ObjectId } from 'bson';
import Realm from 'realm';


/**
 * Realm object schema/class definition for a device object within typescript
 */
export class Device {

    public _id = new ObjectId;
    public name = "";
    public owner_id = "";
    public isOn = false;
    public sensor = 0;
    // Field type which supports multiple multiple data types
    public mixedTypes = "";
    // Dictionary which supports adding new key value pairs with support for the 'mixed' data types
    public flexibleData?: Realm.Dictionary<Realm.Mixed>;
    public components: Realm.List<Component>;

    constructor() {
        // Lie because https://github.com/realm/realm-js/issues/2469
        this.components = [] as any;
    }

    public static schema: Realm.ObjectSchema = {
        name: 'Device',
        primaryKey: '_id',
        properties: {
            _id: { type: 'objectId', default: new ObjectId },
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
export class Component {

    public _id = new ObjectId;
    public name = "";
    public owner_id = "";

    public static schema: Realm.ObjectSchema = {
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
export class Sensor {

    public _id = new ObjectId;
    public name = "";
    public owner_id = "";
    public value = 0;

    public static schema: Realm.ObjectSchema = {
        name: 'Sensor',
        primaryKey: '_id',
        asymmetric: true,
        properties: {
            _id: 'objectId',
            name: 'string',
            owner_id: 'string',
            value: 'int'
        }
    }
}
