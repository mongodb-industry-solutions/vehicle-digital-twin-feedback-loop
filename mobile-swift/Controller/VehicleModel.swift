//
//  VehicleModel.swift
//  Controller
//
//  Created by Rami Pinto on 2/9/24.
//

import DittoSwift

struct Battery: Codable {
    var capacity: Int
    var current: Int
    var sn: String
    var status: String
    var voltage: Int
}

struct Command: Codable, Hashable {
    var command: String
    var status: String
    var ts: String
}

struct VehicleModel {
    let _id: String
    var battery: Battery
    var device_id: String
    var isOn: Bool
    var mixedTypes: String
    var name: String
    var owner_id: String
    var components: [String]
    var commands: [Command]
}

extension VehicleModel {
    
    /// Convenience initializer returns instance from `QueryResultItem.value`
    init(_ value: [String: Any?]) {
        self._id = value["_id"] as! String
        
        // Parse battery dictionary into Battery struct
        if let batteryDict = value["battery"] as? [String: Any?] {
            self.battery = Battery(
                capacity: batteryDict["capacity"] as? Int ?? 0,
                current: batteryDict["current"] as? Int ?? 0,
                sn: batteryDict["sn"] as? String ?? "",
                status: batteryDict["status"] as? String ?? "",
                voltage: batteryDict["voltage"] as? Int ?? 0
            )
        } else {
            self.battery = Battery(capacity: 0, current: 0, sn: "", status: "", voltage: 0)
        }
        
        self.device_id = value["device_id"] as? String ?? ""
        self.isOn = value["isOn"] as? Bool ?? false
        self.mixedTypes = value["mixedTypes"] as? String ?? ""
        self.name = value["name"] as? String ?? ""
        self.owner_id = value["owner_id"] as? String ?? ""
        self.components = value["components"] as? [String] ?? []
        
        // Parse commands array into array of Command structs
        if let commandsArray = value["commands"] as? [[String: Any?]] {
            self.commands = commandsArray.compactMap { commandDict in
                guard
                    let command = commandDict["command"] as? String,
                    let status = commandDict["status"] as? String,
                    let ts = commandDict["ts"] as? String
                else {
                    return nil
                }
                return Command(command: command, status: status, ts: ts)
            }
        } else {
            self.commands = []
        }
    }
}

extension VehicleModel {
    
    /// Returns properties as key/value pairs for DQL INSERT query
    var value: [String: Any?] {
        [
            "_id": _id,
            "battery": [
                "capacity": battery.capacity,
                "current": battery.current,
                "sn": battery.sn,
                "status": battery.status,
                "voltage": battery.voltage
            ],
            "device_id": device_id,
            "isOn": isOn,
            "mixedTypes": mixedTypes,
            "name": name,
            "owner_id": owner_id,
            "components": components,
            "commands": commands.map { [
                "command": $0.command,
                "status": $0.status,
                "ts": $0.ts
            ]}
        ]
    }
}

extension VehicleModel: Identifiable, Equatable {
    
    /// Required for SwiftUI List view
    var id: String {
        return _id
    }
    
    /// Required for List animation
    static func == (lhs: Self, rhs: Self) -> Bool {
        lhs.id == rhs.id
    }
}

extension VehicleModel {
    
    /// Convenience initializer returns model instance with default values, not from Ditto data
    static func new() -> VehicleModel {
        VehicleModel()
    }
}

extension VehicleModel: Codable {

    /// Returns optional instance decoded from `QueryResultItem.jsonString()`
    init?(_ json: String) {
        do {
            self = try JSONDecoder().decode(Self.self, from: Data(json.utf8))
        } catch {
            print("ERROR CODABLE:", error.localizedDescription)
            return nil
        }
    }
}

extension VehicleModel {
    
    /// Convenience initializer with defaults for previews and instances generated for new vehicles
    init(
        battery: Battery = Battery(capacity: 0, current: 0, sn: "", status: "", voltage: 0),
        device_id: String = "",
        isOn: Bool = false,
        mixedTypes: String = "",
        name: String = "",
        owner_id: String = "",
        components: [String] = [],
        commands: [Command] = []
    ) {
        self._id = UUID().uuidString
        self.battery = battery
        self.device_id = device_id
        self.isOn = isOn
        self.mixedTypes = mixedTypes
        self.name = name
        self.owner_id = owner_id
        self.components = components
        self.commands = commands
    }
}
