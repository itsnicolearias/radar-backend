# Notifications

This document provides instructions on how to set up and test the push notification system.

## Firebase Configuration

To enable push notifications, you need to configure the Firebase Admin SDK with your service account credentials.

### 1. Obtain Firebase Service Account Key

1.  Go to the [Firebase Console](https://console.firebase.google.com/).
2.  Select your project.
3.  Go to **Project settings** > **Service accounts**.
4.  Click **Generate new private key**. A JSON file will be downloaded.

### 2. Set Environment Variables

Rename the downloaded JSON file to `serviceAccountKey.json` and place it in the root of the project. Then, set the following environment variables in your `.env` file:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY="your-private-key"
```

You can find these values in the `serviceAccountKey.json` file.

## Testing Notifications

You can test push notifications by sending requests to the appropriate endpoints.

### Testing in the Foreground

When the app is in the foreground, you can listen for incoming notifications and display them in the UI.

### Testing in the Background

When the app is in the background or closed, the operating system will handle the notification and display it in the system tray.

### Disabling Notifications

To test the `notificationsEnabled` flag, you can set it to `false` for a user in the database. When this flag is false, the user should not receive any push notifications.
