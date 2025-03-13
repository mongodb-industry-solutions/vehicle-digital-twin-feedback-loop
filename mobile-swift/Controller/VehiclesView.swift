//
//  DevicessView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import Combine
import SwiftUI
import DittoSwift

@MainActor
class VehiclesViewModel: ObservableObject {
    @Published var vehicles = [VehicleModel]()
    
    private let dittoSync = DittoManager.shared.ditto.sync
    private let dittoStore = DittoManager.shared.ditto.store
    private var subscription: DittoSyncSubscription?
    private var storeObserver: DittoStoreObserver?
    
    init() {
        try? updateSubscription()
        try? updateStoreObserver()
    }
    
    private func updateSubscription() throws {
        do {
            if let sub = subscription {
                sub.cancel()
                subscription = nil
            }
            
            let query = "SELECT * FROM COLLECTION Vehicle"
            subscription = try dittoSync.registerSubscription(query: query)
        } catch {
            print("VehiclesViewModel.\(#function) - ERROR registering subscription: \(error.localizedDescription)")
            throw error
        }
    }
    
    private func updateStoreObserver() throws {
        do {
            if let observer = storeObserver {
                observer.cancel()
                storeObserver = nil
            }
            
            let query = "SELECT * FROM COLLECTION Vehicle"
            storeObserver = try dittoStore.registerObserver(query: query) { [weak self] result in
                guard let self = self else { return }
                
                // DEBUG print to show the raw result from Ditto
                print("VehiclesViewModel.\(#function) - Fetched items from Ditto: \(result.items.count)")
                for item in result.items {
                    print("Fetched Vehicle item: \(item.jsonString())")
                }
                
                self.vehicles = result.items.compactMap { VehicleModel($0.jsonString()) }
            }
        } catch {
            print("VehiclesViewModel.\(#function) - ERROR registering observer: \(error.localizedDescription)")
            throw error
        }
    }
    
    
}

struct VehiclesView: View {
    @StateObject var viewModel = VehiclesViewModel()
    
    var body: some View {
        NavigationView {
            List {
                if viewModel.vehicles.isEmpty {
                    Text("No vehicles found.")
                        .foregroundColor(.gray)
                } else {
                    ForEach(viewModel.vehicles) { vehicle in
                        NavigationLink(destination: VehicleDetailView(viewModel: VehicleDetailViewModel(vehicle: vehicle))) {
                            Text(vehicle.name)
                        }
                    }
                }
            }
            .navigationTitle("Vehicles")
            .onAppear {
                print("VehiclesView - Vehicle count: \(viewModel.vehicles.count)")
            }
        }
    }
}

struct VehiclesView_Previews: PreviewProvider {
    static var previews: some View {
        VehiclesView()
    }
}
