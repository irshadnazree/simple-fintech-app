# Simple Fintech App

A modern fintech application built with Expo and React Native, featuring a clean and intuitive interface for managing financial transactions.

## Tech Stack

- **Framework**: [Expo](https://expo.dev) (v52)
- **Language**: TypeScript
- **Navigation**: Expo Router with file-based routing
- **UI Components**: React Native + Expo components
- **Authentication**: Local authentication support
- **Data Storage**: Secure store implementation

## Project Structure

```
simple-fintech-app/
├── app/                   # Main application screens
│   ├── (home)/           # Home-related screens
│   └── transaction/      # Transaction-related screens
├── components/           # Reusable UI components
├── utils/               # Utility functions
├── api/                 # API integration layer
└── assets/             # Static assets
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   # or
   npx expo start
   ```

3. Choose your preferred development environment:
   - iOS Simulator
   - Android Emulator
   - Expo Go on your physical device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Start the app in iOS simulator
- `npm run android` - Start the app in Android emulator
- `npm run web` - Start the app in web browser
- `npm run test` - Run tests
- `npm run lint` - Run linting

## Features

- Modern UI with native components
- Secure local authentication
- Transaction management
- Bottom tab navigation
- Responsive layout
- TypeScript support
- Development and production builds

## Development

This project uses TypeScript for type safety and Expo's file-based routing system. The main application code is organized in the `app` directory, following the Expo Router convention.
