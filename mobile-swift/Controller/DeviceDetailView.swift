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
                Section(header: Text("CONTROL")) {
                    Toggle(isOn: $device.isOn) {
                        Text("Device Status")
                    }
                }
                Section(header: Text("ABOUT")) {
                    HStack {
                        Text("Owner ID")
                        Spacer()
                        Text(device.owner_id)
                    }
                    List(Array(device.flexibleData.keys), id: \.self) { key in
                        HStack {
                            Text(key)
                            Spacer()
                            Text(device.flexibleData[key] ?? "")
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
