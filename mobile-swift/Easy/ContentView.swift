//
//  ContentView.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI

struct ContentView: View {
    
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        ZStack {
            if (viewModel.app.currentUser != nil) {
                DevicesView(viewModel: viewModel)
            } else {
                LoginView(viewModel: viewModel)
            }
            if viewModel.progressView {
                ProgressView()
                    .scaleEffect(2)
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
