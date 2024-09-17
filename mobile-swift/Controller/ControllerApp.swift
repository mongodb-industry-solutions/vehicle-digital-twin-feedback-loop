//
//  ControllerApp.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI
import RealmSwift

// SwiftUI App Lifecycle
// MongoDB Sample Code: https://www.mongodb.com/docs/realm/sdk/swift/swiftui-tutorial/#complete-code

let app: RealmSwift.App? = RealmSwift.App(id: Bundle.main.object(forInfoDictionaryKey:"Atlas_App_ID") as! String)


@main
struct EasyApp: SwiftUI.App {
    @Environment(\.scenePhase) private var scenePhase
    
    var body: some Scene {
        WindowGroup {
            if let app = app {
                ContentView(app: app)
            } else {
            }
        }
        .onChange(of: scenePhase) { phase in
            //print(phase)
        }
    }
}
