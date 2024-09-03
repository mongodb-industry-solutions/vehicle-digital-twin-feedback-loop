//
//  DittoManager.swift
//  Tasks
//
//  Created by Rae McKelvey on 11/23/22.
//

import Foundation
import DittoSwift

class DittoManager: ObservableObject {    
    var ditto: Ditto    
    static var shared = DittoManager()
    
    init() {        
        ditto = Ditto(
            identity: .onlinePlayground(
                appID: Env.DITTO_APP_ID,
                token: Env.DITTO_PLAYGROUND_TOKEN
            )
        )        
        
        // disable sync with v3 peers, required for DQL
        do {
            try ditto.disableSyncWithV3()
        } catch let error {
            print("DittoManger - ERROR: disableSyncWithV3() failed with error \"\(error)\"")
        }

        // Prevent Xcode previews from syncing: non-preview simulators and real devices can sync
        let isPreview: Bool = ProcessInfo.processInfo.environment["XCODE_RUNNING_FOR_PREVIEWS"] == "1"
        if !isPreview {
            DittoLogger.minimumLogLevel = .debug
            try! ditto.startSync()
        }
    }
}
