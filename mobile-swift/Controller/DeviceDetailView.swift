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
        Form {
            Text(device.name)
                .font(.title)
                .padding()
            Toggle(isOn: $device.isOn) {
                Text("Status")
            }
        }
    }
}


struct DeviceDetailView_Previews: PreviewProvider {
    static var previews: some View {
        DeviceDetailView(device: Device())
    }
}
