//
//  DeviceDetailView.swift
//  Controller
//
//  Created by Felix Reichenbach on 13.05.22.
//

import SwiftUI
import RealmSwift


struct VehicleDetailView: View {
    @ObservedRealmObject var vehicle: Vehicle
    @State private var showingCommandView = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Attributes")) {
                    HStack {
                        Text("VIN")
                        Spacer()
                        Text(vehicle.vin)
                    }
                    HStack {
                        Text("Mixed Types")
                        Spacer()
                        switch vehicle.mixedTypes {
                        case .string(_):
                            Text(vehicle.mixedTypes.stringValue ?? "")
                        case .bool(_):
                            Text(String(vehicle.mixedTypes.boolValue!))
                        case .double(_):
                            Text(String(vehicle.mixedTypes.doubleValue!))
                        case .float(_):
                            Text(String(vehicle.mixedTypes.floatValue!))
                        case .int(_):
                            Text(String(vehicle.mixedTypes.intValue!))
                        case .date(_):
                            if #available(iOS 15.0, *) {
                                Text(vehicle.mixedTypes.dateValue?.ISO8601Format() ?? "")
                            } else {
                                // Fallback on earlier versions
                            }
                        default:
                            Text("\(vehicle.mixedTypes.stringValue ?? "other")")
                        }

                    }
                }
                Section(header: Text("CONTROLS")) {
                    Toggle(isOn: $vehicle.isOn) {
                        Text("Engine")
                    }
                }
                Section(header: Text("Battery")) {
                    HStack {
                        Text("Voltage")
                        Spacer()
                        Text("\(vehicle.battery?.voltage ?? 0)")
                    }
                    HStack {
                        Text("Current")
                        Spacer()
                        Text("\(vehicle.battery?.current ?? 0)")
                    }
                    HStack {
                        Text("Status")
                        Spacer()
                        if (vehicle.battery?.status == "NOK") {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .foregroundColor(.red)
                                .imageScale(.large)
                        } else {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                                .imageScale(.large)
                        }
                    }
                }
                Section(header: Text("Commands: \(vehicle.cmds.count)")) {
                    List {
                        ForEach(vehicle.cmds) { cmd in
                            HStack {
                                Text(cmd.command ?? "")
                                Spacer()
                                Text(cmd.status?.rawValue ?? "")
                            }
                        }
                    }
                }
                Section(header: Text("Components: \(vehicle.components.count)")) {
                    List {
                        ForEach(vehicle.components, id: \._id) { component in
                            HStack {
                                Text(component.name ?? "")
                            }
                        }
                    }
                }
                Button("Send Command", action: {showingCommandView = true})
            }
        }
        .navigationBarTitle(vehicle.name)
        .sheet(isPresented: $showingCommandView) {
            CommandView(vehicle: vehicle, isPresented: $showingCommandView)
        }
    }
}

struct CommandView: View {
    @ObservedRealmObject var vehicle: Vehicle
    @Binding var isPresented: Bool
    @State var command: String = ""
    @State var key: String = ""
    @State var value: String = ""
    
    var body: some View {
        Text("Submit Command").font(.title)
        VStack() {
            HStack() {
                TextField("Enter Command", text: $command)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                Spacer()
            }.padding()
            HStack() {
                Button("Send", action: sendCommand)
                Button("Dismiss", action: {isPresented = false})
            }
        }
    }
    
    func sendCommand(){
        $vehicle.cmds.append(Cmd(value: ["command": command, "status": CmdStatus.submitted]))
        isPresented = false
    }
}


struct DeviceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        VehicleDetailView(vehicle: Vehicle())
    }
}
