//
//  DevicessView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI

struct DevicesView: View {
    @ObservedObject var viewModel: ViewModel
    @State private var showingAddItem = false
    
    var body: some View {
        NavigationView {
            VStack{
                // The list shows the items in the realm.
                List {
                    if let items = viewModel.items {
                        ForEach(items.freeze()) { item in
                            NavigationLink(item.name, destination: detailView(item: item))
                        }
                        .onDelete(perform: delete)
                    }
                }
                Button("Add Item", action: {showingAddItem = true})
            }
            .navigationTitle("Devices")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("Logout", action: viewModel.logout)
                }
            }
        }
        .navigationViewStyle(.stack)
        .sheet(isPresented: $showingAddItem) {
            // show the add item view
            AddView(viewModel: viewModel, isPresented: $showingAddItem)
        }
    }
    
    func delete(at offsets: IndexSet) {
        viewModel.deleteItem(at: offsets)
    }
}

struct detailView: View {
    var item:Device
    var body: some View {
        Text(item.name)
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
