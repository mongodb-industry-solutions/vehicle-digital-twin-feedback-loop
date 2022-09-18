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
    @State private var showingCommandView = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Attributes")) {
                    HStack {
                        Text("Device ID")
                        Spacer()
                        Text(device.device_id)
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
                        Text("Device Status")
                    }
                }
                Section(header: Text("Sensors")) {
                    HStack {
                        Text("Voltage")
                        Spacer()
                        Text("\(device.voltage ?? 0)")
                    }
                    HStack {
                        Text("Current")
                        Spacer()
                        Text("\(device.current ?? 0)")
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
                Button("Send Command", action: {showingCommandView = true})
            }
            .navigationBarTitle(device.name)
        }
        .navigationViewStyle(.stack)
        .sheet(isPresented: $showingCommandView) {
            // show the add item view
            CommandView(device: device.thaw()!, isPresented: $showingCommandView)
        }
    }
}

struct CommandView: View {
    @ObservedObject var device: Device
    @Binding var isPresented: Bool
    
    var body: some View {
        VStack {
            HStack(alignment: .center) {
                Text("Item Name:")
                    .font(.callout)
                    .bold()
                TextField("Enter a name...", text: $device.name)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }.padding()
            Button("Add", action: {
                isPresented = false
            })
            Button("Dismiss", action: {isPresented = false})
        }
    }
}


struct DeviceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        DeviceDetailView(device: Device())
    }
}
