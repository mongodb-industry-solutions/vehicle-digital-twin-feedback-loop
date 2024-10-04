//
//  ControllerApp.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI

// SwiftUI App Lifecycle
// MongoDB Sample Code: https://www.mongodb.com/docs/realm/sdk/swift/swiftui-tutorial/#complete-code

@main
struct EasyApp: SwiftUI.App {
    @Environment(\.scenePhase) private var scenePhase
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
