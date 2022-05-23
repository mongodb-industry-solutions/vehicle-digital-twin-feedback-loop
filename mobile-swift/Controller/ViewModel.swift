//
//  ViewModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 04.06.21.
//

import Foundation
import RealmSwift
import Combine

class ViewModel: ObservableObject {
    
    var realm: Realm?
    @Published var username: String = "demo"
    @Published var password: String = "demopw"
    @Published var error: String = ""
    @Published var itemName: String = ""
    @Published var progressView: Bool = false
    
    @Published var devices: RealmSwift.Results<Device>?
    
    let app: RealmSwift.App = RealmSwift.App(id: "<-- Realm App ID -->")
    var notificationToken: NotificationToken?
    
    init() {
        print("init")
        openRealm()
    }
    
    
    func login() {
        print("userlogin: \(username)")
        self.progressView = true
        app.login(credentials: Credentials.emailPassword(email: username, password: password)) { result in
            switch result {
            case .success:
                self.openRealm()
                DispatchQueue.main.async {
                    self.error = ""
                    self.progressView = false
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    print("Failed to log in: \(error.localizedDescription)")
                    self.error = error.localizedDescription
                    self.progressView = false
                }
            }
        }
    }
    
    
    func logout() {
        print("logout")
        self.progressView = true
        self.notificationToken?.invalidate()
        app.currentUser?.logOut() { result in
        }
        self.progressView = false
    }
    
    
    func openRealm() {
        // If there is no user logged in, exit function.
        guard let user = app.currentUser else {
            return
        }
        print("User custom data: \(user.customData)\(user.id)")
        var config = user.flexibleSyncConfiguration()
        config.objectTypes = [Device.self, Component.self]
        Realm.asyncOpen(configuration: user.flexibleSyncConfiguration()) { result in
            switch result {
            case .success(let realm):
                self.realm = realm
                let subscriptions = realm.subscriptions
                subscriptions.write {
                    subscriptions.removeAll()
                    subscriptions.append(QuerySubscription<Device>(name: "Devices") {
                        $0.owner_id == user.id
                    })
                    subscriptions.append(QuerySubscription<Component>(name: "Components") {
                        $0.owner_id == user.id
                    })
                }
                self.devices = realm.objects(Device.self).sorted(byKeyPath: "_id", ascending: true)
                self.notificationToken = realm.observe { notification, realm in
                    print("Notification")
                    self.objectWillChange.send()
                }
                
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }
    
    
    func addItem() {
        print("addDevice")
        try! devices?.realm?.write(withoutNotifying: [notificationToken!]){
            devices?.realm!.add(Device(value: ["owner_id": app.currentUser?.id, "name": itemName]))
        }
        objectWillChange.send()
    }
    
    func deleteItem(at offsets: IndexSet) {
        print("delete")
        
        /*guard let realm = self.realm else {
         print("Delete Failed")
         return
         }*/
        try! devices?.realm?.write(withoutNotifying: [notificationToken!]){
            devices?.realm!.delete(devices![offsets.first!])
        }
    }
}
