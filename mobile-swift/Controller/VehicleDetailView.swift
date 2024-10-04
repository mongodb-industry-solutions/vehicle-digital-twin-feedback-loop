//
//  DeviceDetailView.swift
//  Controller
//
//  Created by Felix Reichenbach on 13.05.22.
//

import Combine
import DittoSwift
import SwiftUI

@MainActor
class VehicleDetailViewModel: ObservableObject {
    @Published var vehicle: VehicleModel
    @Published var isOn: Bool
    @Published var batteryVoltage: Int
    @Published var batteryCurrent: Int
    @Published var batteryStatus: String
    @Published var commands: [Command]
    @Published var components: [Component]

    private let dittoStore = DittoManager.shared.ditto.store
    private var storeObserver: DittoStoreObserver?
    
    init(vehicle: VehicleModel) {
        self.vehicle = vehicle
        self.isOn = vehicle.isOn
        self.batteryVoltage = vehicle.battery.voltage
        self.batteryCurrent = vehicle.battery.current
        self.batteryStatus = vehicle.battery.status
        self.commands = vehicle.commands
        self.components = vehicle.components
        
        do {
            try updateStoreObserver()
        } catch {
            print("VehicleDetailViewModel - ERROR initializing observer: \(error.localizedDescription)")
        }
    }
    
    private func updateStoreObserver() throws {
        if let observer = storeObserver {
            observer.cancel()
            storeObserver = nil
        }

        let query = "SELECT * FROM COLLECTION vehicle WHERE _id == :_id"
        storeObserver = try dittoStore.registerObserver(query: query, arguments: ["_id": vehicle._id]) { [weak self] result in
            guard let self = self else { return }
            guard let updatedVehicle = result.items.first else { return }
            
            DispatchQueue.main.async {
                self.vehicle = VehicleModel(updatedVehicle.jsonString()) ?? self.vehicle
                self.isOn = self.vehicle.isOn
                self.batteryVoltage = self.vehicle.battery.voltage
                self.batteryCurrent = self.vehicle.battery.current
                self.batteryStatus = self.vehicle.battery.status
                self.commands = self.vehicle.commands
                self.components = self.vehicle.components
            }
        }
    }

    func toggleEngine() {
        isOn.toggle()
        saveChanges()
    }

    func saveChanges() {
        let query = """
        UPDATE vehicle SET
            isOn = :isOn
        WHERE _id == :_id
        """
        
        Task {
            do {
                try await dittoStore.execute(
                    query: query,
                    arguments: [
                        "isOn": isOn,
                        "_id": vehicle._id
                    ]
                )
            } catch {
                print("VehicleDetailViewModel - ERROR saving changes: \(error.localizedDescription)")
            }
        }
    }

    func addCommand(command: Command) {
        commands.append(command)
        let query = """
        UPDATE vehicle SET
            commands = :commands
        WHERE _id == :_id
        """
        
        Task {
            do {
                try await dittoStore.execute(
                    query: query,
                    arguments: [
                        "commands": commands.map { ["command": $0.command, "status": $0.status, "ts": $0.ts] },
                        "_id": vehicle._id
                    ]
                )
            } catch {
                print("VehicleDetailViewModel - ERROR adding command: \(error.localizedDescription)")
            }
        }
    }
}

struct VehicleDetailView: View {
    @StateObject var viewModel: VehicleDetailViewModel
    @State private var showingCommandView = false
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("Attributes")) {
                    HStack {
                        Text("VIN")
                        Spacer()
                        Text(viewModel.vehicle._id)
                    }
                    HStack {
                        Text("Miscellaneous")
                        Spacer()
                        //switch viewModel.vehicle.mixedTypes {
                        //case .string(_):
                            Text(viewModel.vehicle.mixedTypes ?? "")
                        /*case .bool(_):
                            Text(String(viewModel.vehicle.mixedTypes.boolValue!))
                        case .double(_):
                            Text(String(viewModel.vehicle.mixedTypes.doubleValue!))
                        case .float(_):
                            Text(String(viewModel.vehicle.mixedTypes.floatValue!))
                        case .int(_):
                            Text(String(viewModel.vehicle.mixedTypes.intValue!))
                        case .date(_):
                            if #available(iOS 15.0, *) {
                                Text(viewModel.vehicle.mixedTypes.dateValue?.ISO8601Format() ?? "")
                            } else {
                                // Fallback on earlier versions
                            }
                        default:
                            Text("\(viewModel.vehicle.mixedTypes.stringValue ?? "other")")
                        }*/

                    }
                }
                Section(header: Text("CONTROLS")) {
                    Toggle(isOn: $viewModel.isOn) {
                        Text("Engine")
                    }
                    .onChange(of: viewModel.isOn) { newValue in
                        viewModel.toggleEngine()
                    }
                }
                Section(header: Text("Battery")) {
                    HStack {
                        Text("Voltage")
                        Spacer()
                        Text("\(viewModel.vehicle.battery.voltage ?? 0)")
                    }
                    HStack {
                        Text("Current")
                        Spacer()
                        Text("\(viewModel.vehicle.battery.current ?? 0)")
                    }
                    HStack {
                        Text("Status")
                        Spacer()
                        if (viewModel.vehicle.battery.status == "NOK") {
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
                Section(header: Text("Commands: \(viewModel.commands.count)")) {
                    List(viewModel.commands, id: \.self) { cmd in
                        HStack {
                            Text(cmd.command)
                            Spacer()
                            Text(cmd.status)
                        }
                    }
                }
                Section(header: Text("Components: \(viewModel.components.count)")) {
                    List(viewModel.components, id: \.self) { component in
                        Text(component.name)  // Display each component directly if it's a String
                    }
                }
                Button(action: {showingCommandView = true}){
                    Text("Send Command").frame(maxWidth: .infinity, alignment: .center)
                }
            }
        }
        .navigationBarTitle(viewModel.vehicle.name)
        .sheet(isPresented: $showingCommandView) {
            CommandView(viewModel: viewModel, isPresented: $showingCommandView)
        }
    }
}

struct CommandView: View {
    @ObservedObject var viewModel: VehicleDetailViewModel
    @Binding var isPresented: Bool
    @State var key: String = ""
    @State var value: String = ""
    @State private var selectedCommand = "Reset Battery"
    let commands = ["Reset Battery"]
    
    var body: some View {
        VStack() {
            List {
                Picker("Commands", selection: $selectedCommand) {
                    ForEach(commands, id: \.self) {
                        Text($0)
                    }
                }
            }
            HStack() {
                Button("Send", action: sendCommand)
            }
        }
    }
    
    func sendCommand(){
        //$vehicle.commands.append(Command(value: ["command": selectedCommand, "status": CmdStatus.submitted] as [String : Any]))
        let newCommand = Command(command: selectedCommand, status: "submitted", ts: "\(Date())")
        viewModel.addCommand(command: newCommand)
        isPresented = false
    }
}


struct DeviceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        let sampleVehicle = VehicleModel(
            _id: "5UXFE83578L342684",
            battery: Battery(capacity: 1000, current: 28, sn: "123", status: "OK", voltage: 69),
            device_id: "device_12345",
            isOn: true,
            mixedTypes: "Change Type",
            name: "My Car",
            owner_id: "6508d7bc73e92d4da43bb271",
            components: [],
            commands: [Command(command: "Reset Battery", status: "completed", ts: "2024-08-28T16:43:48.201Z")]
        )
        
        VehicleDetailView(viewModel: VehicleDetailViewModel(vehicle: sampleVehicle))
    }
}
