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
    @Persisted var name: String = ""
    @Persisted var owner_id: String = ""
}

class Component: Object {
    @Persisted(primaryKey: true) var _id: ObjectId

    @Persisted var name: String?

    @Persisted var owner_id: String = ""
}
