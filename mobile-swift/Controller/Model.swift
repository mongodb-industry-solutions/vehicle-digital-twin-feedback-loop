//
//  DataModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import Foundation
import RealmSwift

class Vehicle: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var _id: String
    @Persisted var battery: Battery?
    @Persisted var components: List<Component>
    @Persisted var current: Int?
    @Persisted var owner_id: String = ""
    @Persisted var isOn: Bool = false
    @Persisted var mixedTypes: AnyRealmValue
    @Persisted var name: String = ""
    @Persisted var commands: List<Command>
}

class Battery: EmbeddedObject {
    @Persisted var capacity: Int?
    @Persisted var current: Int?
    @Persisted var sn: String?
    @Persisted var voltage: Int?
    @Persisted var status: String?
}

class Component: Object {
    @Persisted(primaryKey: true) var _id: ObjectId?
    @Persisted var name: String?
    @Persisted var owner_id: String = ""
}

class Command: EmbeddedObject, Identifiable {
    @Persisted var command: String?
    @Persisted var status: CmdStatus?
    @Persisted var ts: Date? = Date()
}

enum CmdStatus: String, PersistableEnum {
    case submitted
    case inProgress
    case completed
    case failed
}
