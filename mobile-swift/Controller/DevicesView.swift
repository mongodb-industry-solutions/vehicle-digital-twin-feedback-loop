//
//  DevicessView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI

struct DevicesView: View {
    @ObservedObject var viewModel: ViewModel
    @State private var showingAddDevice = false
    
    var body: some View {
        NavigationView {
            VStack{
                // The list shows the items in the realm.
                List {
                    if let devices = viewModel.devices {
                        ForEach(devices.freeze()) { device in
                            NavigationLink(device.name, destination: DeviceDetailView(device: device))
                        }
                        .onDelete(perform: delete)
                    }
                }
                Button("Add Item", action: {showingAddDevice = true})
            }
            .navigationTitle("Devices")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Logout", action: viewModel.logout)
                }
            }
        }
        .navigationViewStyle(.stack)
        .sheet(isPresented: $showingAddDevice) {
            // show the add item view
            AddView(viewModel: viewModel, isPresented: $showingAddDevice)
        }
    }
    
    func delete(at offsets: IndexSet) {
        viewModel.deleteItem(at: offsets)
    }
}


struct AddView: View {
    @ObservedObject var viewModel: ViewModel
    @Binding var isPresented: Bool
    
    var body: some View {
        VStack {
            HStack(alignment: .center) {
                Text("Item Name:")
                    .font(.callout)
                    .bold()
                TextField("Enter a name...", text: $viewModel.itemName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }.padding()
            Button("Add", action: {
                viewModel.addItem()
                isPresented = false
            })
            Button("Dismiss", action: {isPresented = false})
        }
    }
}

struct ItemsView_Previews: PreviewProvider {
    static var previews: some View {
        if #available(iOS 15.0, *) {
            DevicesView(viewModel: ViewModel())
                .previewInterfaceOrientation(.portrait)
        } else {
            // Fallback on earlier versions
        }
    }
}
