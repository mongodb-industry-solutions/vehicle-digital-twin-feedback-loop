//
//  LoginView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI

struct LoginView: View {
    @ObservedObject var viewModel: ViewModel
    
    var body: some View {
        VStack {
            Text("LoginView")
            Form {
                TextField("Username", text: $viewModel.username)
                SecureField("Password", text: $viewModel.password)
            }
            if !viewModel.error.isEmpty {
                Text(viewModel.error)
                    .foregroundColor(.red)
            }
            Button("Login", action: viewModel.login)
        }
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView(viewModel: ViewModel())
    }
}
