//
//  DevicessView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI
import RealmSwift

struct DevicesView: View {
    // This view opens a synced realm.
    // We've injected a `flexibleSyncConfiguration` as an environment value,
    // so `@AsyncOpen` here opens a realm using that configuration.
    @AsyncOpen(appId: Bundle.main.object(forInfoDictionaryKey:"Atlas_App_ID") as? String, timeout: 4000) var asyncOpen
    
    var body: some View {
        // Because we are setting the `ownerId` to the `user.id`, we need
        // access to the app's current user in this view.
        //let user = app?.currentUser
        switch asyncOpen {
            // Starting the Realm.asyncOpen process.
            // Show a progress view.
        case .connecting:
            ProgressView()
            // Waiting for a user to be logged in before executing
            // Realm.asyncOpen.
        case .waitingForUser:
            ProgressView("Waiting for user to log in...")
            // The realm has been opened and is ready for use.
            // Show the content view.
        case .open(_):
            DevicesListView()
            // The realm is currently being downloaded from the server.
            // Show a progress view.
        case .progress(let progress):
            ProgressView(progress)
            // Opening the Realm failed.
            // Show an error view.
        case .error(let error):
            ErrorView(error: error)
        }
    }
}
struct ErrorView: View {
    var error: Error
    
    var body: some View {
        VStack {
            Text("Error opening the realm: \(error.localizedDescription)")
        }
    }
}


struct DevicesListView: View {
    
    @ObservedResults(Device.self) var devices
    
    var body: some View {
        NavigationView {
            VStack{
                // The list shows the items in the realm.
                List {
                    ForEach(devices) { device in
                        NavigationLink(device.name, destination: DeviceDetailView(device: device))
                    }
                    .onDelete(perform: $devices.remove)
                }
            }
            .navigationTitle("Devices")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Logout", action: logout)
                }
            }
        }
        .navigationViewStyle(.stack)
    }
    
    func logout() {
        guard let user = app!.currentUser else {
            return
        }
        user.logOut() { error in
            // Other views are observing the app and will detect
            // that the currentUser has changed. Nothing more to do here.
            print("Logged out")
        }
    }
}
