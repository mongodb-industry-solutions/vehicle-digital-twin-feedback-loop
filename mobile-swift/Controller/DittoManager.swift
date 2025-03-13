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
            identity: DittoIdentity.onlinePlayground(
                appID: Env.DITTO_APP_ID,
                token: Env.DITTO_PLAYGROUND_TOKEN,
                enableDittoCloudSync: false,
                customAuthURL: URL(string: Env.DITTO_CUSTOM_AUTH_URL)
            )
        )        
        
        // Set the Ditto Websocket URL
        var config = DittoTransportConfig()
        let webSocketURL = Env.DITTO_WEBSOCKET_URL
        config.connect.webSocketURLs.insert(webSocketURL)
        
        // Optionally enable all P2P transports if using P2P Sync
        // Do not call this if only using Ditto Cloud Sync
        config.enableAllPeerToPeer()
        ditto.transportConfig = config
        
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
