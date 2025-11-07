# API Endpoints Documentation

This document provides a comprehensive reference for all the API endpoints, including their methods, paths, descriptions, and expected request/response types.

## Authentication (`/api/auth`)

| Method | Path | Description | Controller | Service | Request Body | Request Params | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| POST | /register | Register a new user | `register` | `registerUser` | `RegisterUserInput` | - | `IAuthResponse` |
| POST | /login | Login user | `login` | `loginUser` | `LoginUserInput` | - | `IAuthResponse` |
| POST | /resend-verification | Resend verification email | `resendVerificationEmail` | `resendVerificationEmail` | `ResendVerificationEmailInput` | - | `IResendVerificationEmailResponse` |
| GET | /verify-email/:token | Verify user email | `verifyEmail` | `verifyEmail` | - | `token: string` | `IVerifyEmailResponse` |

## Connections (`/api/connections`)

| Method | Path | Description | Controller | Service | Request Body | Request Params | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| POST | / | Create a new connection | `createConnection` | `createConnection` | `CreateConnectionInput` | - | `IConnectionResponse` |
| GET | /accepted | Get accepted connections | `getAcceptedConnections` | `getConnectionsByUserId` | - | - | `IConnectionResponse[]` |
| GET | /pendings | Get pending connections | `getPendingConnections` | `getPendingConnections` | - | - | `IConnectionResponse[]` |
| PATCH | /:connectionId | Update a connection | `updateConnection` | `updateConnection` | `UpdateConnectionInput` | `connectionId: string` | `IConnectionResponse` |
| DELETE | /:connectionId | Delete a connection | `deleteConnection` | `deleteConnection` | - | `connectionId: string` | `IDeleteConnectionResponse` |

## Messages (`/api/messages`)

| Method | Path | Description | Controller | Service | Request Body | Request Params | Request Query | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |:--- |
| GET | / | Get recent conversations | `getRecentConversations` | `getRecentConversations` | - | - | `page`, `limit`, `all` | `IConversationsResponse` |
| POST | / | Create a new message | `sendMessage` | `sendMessage` | `SendMessageInput` | - | - | `IMessageResponse` |
| GET | /:userId | Obtain messages with a user | `getMessages` | `getMessagesBetweenUsers` | - | `userId: string` | - | `IMessageResponse[]` |
| PATCH | /read | Mark a message as read | `markAsRead` | `markMessagesAsRead` | `MarkAsReadInput` | - | - | `IMarkAsReadResponse` |
| GET | /unread/count | Obtain unread messages count | `getUnreadCount` | `getUnreadMessageCount` | - | - | - | `IUnreadMessagesResponse` |

## Notifications (`/api/notifications`)

| Method | Path | Description | Controller | Service | Request Body | Request Params | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| GET | / | Get all user's notifications | `getNotifications` | `getNotificationsByUserId` | - | - | `INotificationResponse[]` |
| PATCH | /read | Mark a notification as read | `markAsRead` | `markNotificationsAsRead` | `MarkNotificationsAsReadInput` | - | `IMarkNotificationsAsReadResponse` |
| GET | /unread/count | Get unread notifications count | `getUnreadCount` | `getUnreadNotificationCount` | - | - | `IUnreadNotificationCountResponse` |
| DELETE | /:notificationId | Delete a notification | `deleteNotification` | `deleteNotification` | - | `notificationId: string` | `IDeleteNotificationResponse` |

## Profiles (`/api/profiles`)

| Method | Path | Description | Controller | Service | Request Body | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| GET | / | Get my profile | `getProfile` | `getProfileByUserId` | - | `IProfileResponse` |
| POST | / | Create my profile | `createProfile` | `createProfile` | `CreateProfileInput` | `IProfileResponse` |
| PATCH | / | Update my profile | `updateProfile` | `updateProfile` | `UpdateProfileInput` | `IProfileResponse` |
| DELETE | / | Delete my profile | `deleteProfile` | `deleteProfile` | - | `IDeleteProfileResponse` |
| POST | /view | Record a profile view | `viewProfile` | `createProfileView` | `viewedId: string` | `IProfileViewResponse` |
| GET | /views | Get users who viewed my profile | `getProfileViews` | `getProfileViews` | - | `IProfileViewResponse[]` |

## Radar (`/api/radar`)

| Method | Path | Description | Controller | Service | Request Query | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| GET | /nearby | Get nearby users, events, and signals | `getNearby` | `getNearbyAll` | `latitude: number`, `longitude: number`, `radius: number` | `IRadarNearbyResponse` |

## Signals (`/api/signals`)

| Method | Path | Description | Controller | Service | Request Body | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| POST | /send | Send a signal | `sendSignal` | `createSignal` | `note?: string` | `ISignalResponse` |

## Users (`/api/users`)

| Method | Path | Description | Controller | Service | Request Body | Response Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| GET | / | Get logged user | `getUser` | `getUserById` | - | `IUserResponse` |
| PATCH | / | Update logged user | `updateUser` | `updateUser` | `UpdateUserInput` | `IUpdateUserResponse` |
| PATCH | /location | Update user location | `updateLocation` | `updateUserLocation` | `UpdateLocationInput` | `IUpdateLocationResponse` |
| PATCH | /visibility | Toggle user visibility | `toggleVisibility` | `toggleVisibility` | `ToggleVisibilityInput` | `IToggleVisibilityResponse` |
