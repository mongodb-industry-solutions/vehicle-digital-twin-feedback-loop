//
//  ControllerApp.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI

// SwiftUI App Lifecycle
// https://learnappmaking.com/swiftui-app-lifecycle-how-to/

@main
struct EasyApp: SwiftUI.App {
    @Environment(\.scenePhase) private var scenePhase
    
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .onChange(of: scenePhase) { phase in
            //print(phase)
        }
    }
}
