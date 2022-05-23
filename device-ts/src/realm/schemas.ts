import { ObjectId } from 'bson';
import Realm from 'realm';

export class Device {
    
    public _id = new ObjectId;
    public name = "";
    public owner_id = "";
    public isOn = false;
    // Field type which supports multiple multiple data types
    public mixedTypes = null;
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
            _id: 'objectId',
            name: 'string',
            owner_id: 'string',
            isOn: 'bool',
            mixedTypes: 'mixed',
            flexibleData: '{}',
            components: 'Component[]'
        }
    }
}

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
