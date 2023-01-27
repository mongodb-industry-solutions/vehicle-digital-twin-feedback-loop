//
//  LoginView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI


struct LoginView: View {
    // Hold an error if one occurs so we can display it.
    @State var error: Error?
    @State var username: String = "demo"
    @State var password: String = "demopw"
    
    
    // Keep track of whether login is in progress.
    @State var isLoggingIn = false
    var body: some View {
        VStack {
            Image("LoginBack")
                .padding(.top, 0)
            Text("Welcome to the Vehicle Controller")
                .font(.title)
                .fontWeight(.medium)
                .multilineTextAlignment(.center)
                .padding(.bottom, 25)
                .padding(.top, 25)
            
            Form {
                TextField("Username", text: $username)
                SecureField("Password", text: $password)
            }
            
            if isLoggingIn {
                ProgressView()
            }
            if let error = error {
                Text("Error: \(error.localizedDescription)")
            }
            Button("Login")
            {
                // Button pressed, so log in
                isLoggingIn = true
                app!.login(credentials: .emailPassword(email: username, password: password)) { result in
                    isLoggingIn = false
                    if case let .failure(error) = result {
                        print("Failed to log in: \(error.localizedDescription)")
                        // Set error to observed property so it can be displayed
                        self.error = error
                        return
                    }
                    // Other views are observing the app and will detect
                    // that the currentUser has changed. Nothing more to do here.
                    print("Logged in")
                }
            }.disabled(isLoggingIn)
    
                .padding()
                .position(x:200, y:20)
                .foregroundColor(.accentColor)
                
            
            HStack{
                Text("Powered by ")
                    .font(.caption)
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 25)
                Image("LoginAtlas")
                    .padding(.bottom, 25)
                    .imageScale(.small)
            }
        }
    }
}

