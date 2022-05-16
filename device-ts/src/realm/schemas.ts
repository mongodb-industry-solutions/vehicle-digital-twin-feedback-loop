import { ObjectId } from 'bson';
import Realm from 'realm';

export class Device {
    
    public _id = new ObjectId;
    public name = "";
    public owner_id = "";
    public isOn = false;
    public flexibleData?: Realm.Dictionary<string>;
    public components: Array<Component> = [];

    public static schema = {
        name: 'Device',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            owner_id: 'string',
            isOn: 'bool',
            components: 'Component[]',
            flexibleData: 'string{}'
        }
    }
}

export class Component {

    public _id = new ObjectId;
    public name = "";
    public owner_id = "";

    public static schema = {
        name: 'Component',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string?',
            owner_id: 'string'
        }
    }
}
