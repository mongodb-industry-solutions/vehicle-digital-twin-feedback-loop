//
//  DeviceDetailView.swift
//  Controller
//
//  Created by Felix Reichenbach on 13.05.22.
//

import SwiftUI
import RealmSwift


struct DeviceDetailView: View {
    @ObservedRealmObject var device: Device
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Attributes")) {
                    HStack {
                        Text("Owner ID")
                        Spacer()
                        Text(device.owner_id)
                    }
                    HStack {
                        Text("Mixed Types")
                        Spacer()
                        Text(device.mixedTypes.stringValue ?? "No String: \(type(of: device.mixedTypes))")
                    }
                    List(Array(device.flexibleData.keys), id: \.self) { key in
                        HStack {
                            Text(key)
                            Spacer()
                            Text(device.flexibleData[key]?.stringValue ?? "No string but  \(type(of: device.flexibleData[key]))")
                        }
                    }
                }
                Section(header: Text("CONTROLS")) {
                    Toggle(isOn: $device.isOn) {
                        Text("Time Series")
                    }
                }
                Section(header: Text("Sensors")) {
                    HStack {
                        Text("Sensor")
                        Spacer()
                        Text("\(device.sensor)")
                    }
                }
                Section(header: Text("Components: \(device.components.count)")) {
                    List {
                        ForEach(device.components, id: \._id) { component in
                            HStack {
                                Text(component.name ?? "")
                            }
                        }
                    }
                }
            }
            .navigationBarTitle(device.name)
        }
        .navigationViewStyle(.stack)
    }
}


struct DeviceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        DeviceDetailView(device: Device())
    }
}
