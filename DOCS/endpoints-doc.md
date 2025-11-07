# API Endpoints Documentation

This document provides a comprehensive reference for all the API endpoints, including their methods, paths, descriptions, and expected request/response types.

## Authentication (`/api/auth`)

### POST /register

- **Description:** Register a new user
- **Request Body:** `RegisterUserInput`
- **Response Type:** `IAuthResponse`
  ```json
  {
    "token": "string",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isVerified": "boolean",
      "displayName": "string | null",
      "birthDate": "Date | null"
    }
  }
  ```

### POST /login

- **Description:** Login user
- **Request Body:** `LoginUserInput`
- **Response Type:** `IAuthResponse`
  ```json
  {
    "token": "string",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isVerified": "boolean",
      "displayName": "string | null",
      "birthDate": "Date | null"
    }
  }
  ```

### POST /resend-verification

- **Description:** Resend verification email
- **Request Body:** `ResendVerificationEmailInput`
- **Response Type:** `IResendVerificationEmailResponse`
  ```json
  {
    "message": "string"
  }
  ```

### GET /verify-email/:token

- **Description:** Verify user email
- **Request Params:** `token: string`
- **Response Type:** `IVerifyEmailResponse`
  ```json
  {
    "message": "string",
    "user": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "isVerified": "boolean",
      "displayName": "string | null",
      "birthDate": "Date | null"
    }
  }
  ```

## Connections (`/api/connections`)

### POST /

- **Description:** Create a new connection
- **Request Body:** `CreateConnectionInput`
- **Response Type:** `IConnectionResponse`
  ```json
  {
    "connectionId": "string",
    "senderId": "string",
    "receiverId": "string",
    "status": "ConnectionStatus",
    "createdAt": "Date",
    "updatedAt": "Date",
    "Sender": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "Receiver": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
  ```

### GET /accepted

- **Description:** Get accepted connections
- **Response Type:** `IConnectionResponse[]`
  ```json
  [
    {
      "connectionId": "string",
      "senderId": "string",
      "receiverId": "string",
      "status": "ConnectionStatus",
      "createdAt": "Date",
      "updatedAt": "Date",
      "Sender": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      },
      "Receiver": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  ]
  ```

### GET /pendings

- **Description:** Get pending connections
- **Response Type:** `IConnectionResponse[]`
  ```json
  [
    {
      "connectionId": "string",
      "senderId": "string",
      "receiverId": "string",
      "status": "ConnectionStatus",
      "createdAt": "Date",
      "updatedAt": "Date",
      "Sender": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      },
      "Receiver": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  ]
  ```

### PATCH /:connectionId

- **Description:** Update a connection
- **Request Params:** `connectionId: string`
- **Request Body:** `UpdateConnectionInput`
- **Response Type:** `IConnectionResponse`
  ```json
  {
    "connectionId": "string",
    "senderId": "string",
    "receiverId": "string",
    "status": "ConnectionStatus",
    "createdAt": "Date",
    "updatedAt": "Date",
    "Sender": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    },
    "Receiver": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
  ```

### DELETE /:connectionId

- **Description:** Delete a connection
- **Request Params:** `connectionId: string`
- **Response Type:** `IDeleteConnectionResponse`
  ```json
  {
    "message": "string"
  }
  ```

## Messages (`/api/messages`)

### GET /

- **Description:** Get recent conversations
- **Request Query:** `page: number`, `limit: number`, `all: boolean`
- **Response Type:** `IConversationsResponse`
  ```json
  {
    "conversations": [
      {
        "conversationId": "string",
        "user": {
          "userId": "string",
          "displayName": "string | null",
          "isVerified": "boolean",
          "Profile": {
            "photoUrl": "string | null"
          }
        },
        "lastMessage": {
          "content": "string",
          "createdAt": "Date",
          "isRead": "boolean",
          "senderId": "string"
        },
        "unreadCount": "number"
      }
    ],
    "total": "number"
  }
  ```

### POST /

- **Description:** Create a new message
- **Request Body:** `SendMessageInput`
- **Response Type:** `IMessageResponse`
  ```json
  {
    "messageId": "string",
    "senderId": "string",
    "receiverId": "string",
    "content": "string",
    "isRead": "boolean",
    "createdAt": "Date",
    "updatedAt": "Date"
  }
  ```

### GET /:userId

- **Description:** Obtain messages with a user
- **Request Params:** `userId: string`
- **Response Type:** `IMessageResponse[]`
  ```json
  [
    {
      "messageId": "string",
      "senderId": "string",
      "receiverId": "string",
      "content": "string",
      "isRead": "boolean",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
  ```

### PATCH /read

- **Description:** Mark a message as read
- **Request Body:** `MarkAsReadInput`
- **Response Type:** `IMarkAsReadResponse`
  ```json
  {
    "message": "string"
  }
  ```

### GET /unread/count

- **Description:** Obtain unread messages count
- **Response Type:** `IUnreadMessagesResponse`
  ```json
  {
    "count": "number"
  }
  ```

## Notifications (`/api/notifications`)

### GET /

- **Description:** Get all user's notifications
- **Response Type:** `INotificationResponse[]`
  ```json
  [
    {
      "notificationId": "string",
      "userId": "string",
      "type": "NotificationType",
      "message": "string",
      "isRead": "boolean",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
  ```

### PATCH /read

- **Description:** Mark a notification as read
- **Request Body:** `MarkNotificationsAsReadInput`
- **Response Type:** `IMarkNotificationsAsReadResponse`
  ```json
  {
    "message": "string"
  }
  ```

### GET /unread/count

- **Description:** Get unread notifications count
- **Response Type:** `IUnreadNotificationCountResponse`
  ```json
  {
    "count": "number"
  }
  ```

### DELETE /:notificationId

- **Description:** Delete a notification
- **Request Params:** `notificationId: string`
- **Response Type:** `IDeleteNotificationResponse`
  ```json
  {
    "message": "string"
  }
  ```

## Profiles (`/api/profiles`)

### GET /

- **Description:** Get my profile
- **Response Type:** `IProfileResponse`
  ```json
  {
    "profileId": "string",
    "userId": "string",
    "photoUrl": "string | null",
    "bio": "string | null",
    "location": "string | null",
    "website": "string | null",
    "birthDate": "Date | null",
    "gender": "string | null",
    "pronouns": "string | null",
    "height": "number | null",
    "zodiac": "string | null",
    "education": "string | null",
    "work": "string | null",
    "interests": "string[] | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "User": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
  ```

### POST /

- **Description:** Create my profile
- **Request Body:** `CreateProfileInput`
- **Response Type:** `IProfileResponse`
  ```json
  {
    "profileId": "string",
    "userId": "string",
    "photoUrl": "string | null",
    "bio": "string | null",
    "location": "string | null",
    "website": "string | null",
    "birthDate": "Date | null",
    "gender": "string | null",
    "pronouns": "string | null",
    "height": "number | null",
    "zodiac": "string | null",
    "education": "string | null",
    "work": "string | null",
    "interests": "string[] | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "User": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
  ```

### PATCH /

- **Description:** Update my profile
- **Request Body:** `UpdateProfileInput`
- **Response Type:** `IProfileResponse`
  ```json
  {
    "profileId": "string",
    "userId": "string",
    "photoUrl": "string | null",
    "bio": "string | null",
    "location": "string | null",
    "website": "string | null",
    "birthDate": "Date | null",
    "gender": "string | null",
    "pronouns": "string | null",
    "height": "number | null",
    "zodiac": "string | null",
    "education": "string | null",
    "work": "string | null",
    "interests": "string[] | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "User": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string"
    }
  }
  ```

### DELETE /

- **Description:** Delete my profile
- **Response Type:** `IDeleteProfileResponse`
  ```json
  {
    "message": "string"
  }
  ```

### POST /view

- **Description:** Record a profile view
- **Request Body:** `viewedId: string`
- **Response Type:** `IProfileViewResponse`
  ```json
  {
    "profileViewId": "string",
    "viewerId": "string",
    "viewedId": "string",
    "createdAt": "Date",
    "updatedAt": "Date",
    "Viewer": {
      "userId": "string",
      "firstName": "string",
      "lastName": "string",
      "displayName": "string | null"
    }
  }
  ```

### GET /views

- **Description:** Get users who viewed my profile
- **Response Type:** `IProfileViewResponse[]`
  ```json
  [
    {
      "profileViewId": "string",
      "viewerId": "string",
      "viewedId": "string",
      "createdAt": "Date",
      "updatedAt": "Date",
      "Viewer": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "displayName": "string | null"
      }
    }
  ]
  ```

## Radar (`/api/radar`)

### GET /nearby

- **Description:** Get nearby users, events, and signals
- **Request Query:** `latitude: number`, `longitude: number`, `radius: number`
- **Response Type:** `IRadarNearbyResponse`
  ```json
  {
    "users": [
      {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "displayName": "string | null",
        "birthDate": "Date | null",
        "isVerified": "boolean",
        "lastLatitude": "number | null",
        "lastLongitude": "number | null",
        "lastSeenAt": "Date | null",
        "distance": "number",
        "Profile": {
          "photoUrl": "string | null",
          "bio": "string | null",
          "age": "number | null",
          "interests": "string[] | null"
        }
      }
    ],
    "events": [],
    "signals": [
      {
        "signalId": "string",
        "senderId": "string",
        "note": "string | null",
        "createdAt": "Date",
        "updatedAt": "Date",
        "distance": "number"
      }
    ]
  }
  ```

## Signals (`/api/signals`)

### POST /send

- **Description:** Send a signal
- **Request Body:** `note?: string`
- **Response Type:** `ISignalResponse`
  ```json
  {
    "signalId": "string",
    "senderId": "string",
    "note": "string | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "distance": "number"
  }
  ```

## Users (`/api/users`)

### GET /

- **Description:** Get logged user
- **Response Type:** `IUserResponse`
  ```json
  {
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "displayName": "string | null",
    "birthDate": "Date | null",
    "isVerified": "boolean",
    "invisibleMode": "boolean",
    "isVisible": "boolean",
    "lastLatitude": "number | null",
    "lastLongitude": "number | null",
    "lastSeenAt": "Date | null",
    "createdAt": "Date",
    "updatedAt": "Date",
    "Profile": {
      "profileId": "string",
      "userId": "string",
      "photoUrl": "string | null",
      "bio": "string | null",
      "location": "string | null",
      "website": "string | null",
      "birthDate": "Date | null",
      "gender": "string | null",
      "pronouns": "string | null",
      "height": "number | null",
      "zodiac": "string | null",
      "education": "string | null",
      "work": "string | null",
      "interests": "string[] | null",
      "createdAt": "Date",
      "updatedAt": "Date",
      "User": {
        "userId": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string"
      }
    }
  }
  ```

### PATCH /

- **Description:** Update logged user
- **Request Body:** `UpdateUserInput`
- **Response Type:** `IUpdateUserResponse`
  ```json
  {
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "displayName": "string | null",
    "birthDate": "Date | null",
    "invisibleMode": "boolean",
    "isVisible": "boolean"
  }
  ```

### PATCH /location

- **Description:** Update user location
- **Request Body:** `UpdateLocationInput`
- **Response Type:** `IUpdateLocationResponse`
  ```json
  {
    "userId": "string",
    "latitude": "number | null",
    "longitude": "number | null",
    "lastSeenAt": "Date"
  }
  ```

### PATCH /visibility

- **Description:** Toggle user visibility
- **Request Body:** `ToggleVisibilityInput`
- **Response Type:** `IToggleVisibilityResponse`
  ```json
  {
    "userId": "string",
    "isVisible": "boolean"
  }
  ```
