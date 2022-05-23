//
//  DataModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import Foundation
import RealmSwift

class Device: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var _id: ObjectId
    @Persisted var components: List<Component>
    @Persisted var name: String = "Device Name"
    @Persisted var owner_id: String = ""
    @Persisted var isOn: Bool = false
    @Persisted var sensor: Int = 0
    @Persisted var flexibleData: Map<String, AnyRealmValue>
    @Persisted var mixedTypes: AnyRealmValue = AnyRealmValue.string("")
}

class Component: Object {
    @Persisted(primaryKey: true) var _id: ObjectId

    @Persisted var name: String?

    @Persisted var owner_id: String = ""
}
