import { ObjectId } from 'bson';

export class Device { //extends Realm.Object {
    
    public _id = new ObjectId;
    public name = "";
    public owner_id = "";
    public isOn = false;
    public components: Array<Component> = [];

    public static schema = {//: Realm.ObjectSchema = {
        name: 'Device',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            owner_id: 'string',
            isOn: 'bool',
            components: 'Component[]'
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
