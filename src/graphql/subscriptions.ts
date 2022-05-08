/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onMessageCreatedByChatRoomID = /* GraphQL */ `
  subscription OnMessageCreatedByChatRoomID($chatRoomID: ID!) {
    onMessageCreatedByChatRoomID(chatRoomID: $chatRoomID) {
      id
      createdAt
      content
      userID
      chatRoomID
      isImage
      isSpam
      videoCats
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onIncomingMessage = /* GraphQL */ `
  subscription OnIncomingMessage($chatRoomID: ID!, $userID: ID!) {
    onIncomingMessage(chatRoomID: $chatRoomID, userID: $userID) {
      id
      createdAt
      content
      userID
      chatRoomID
      isImage
      isSpam
      videoCats
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onChatRoomUserCreatedByUserID = /* GraphQL */ `
  subscription OnChatRoomUserCreatedByUserID($userID: ID!) {
    onChatRoomUserCreatedByUserID(userID: $userID) {
      id
      userID
      chatRoomID
      isImportant
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUserUpdatedByUserID = /* GraphQL */ `
  subscription OnUserUpdatedByUserID($id: ID!) {
    onUserUpdatedByUserID(id: $id) {
      id
      name
      imageUri
      status
      impMessages
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      videoCats
      createdAt
      updatedAt
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      name
      imageUri
      status
      impMessages
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      videoCats
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      name
      imageUri
      status
      impMessages
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      videoCats
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      name
      imageUri
      status
      impMessages
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      videoCats
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChatRoomUser = /* GraphQL */ `
  subscription OnCreateChatRoomUser {
    onCreateChatRoomUser {
      id
      userID
      chatRoomID
      isImportant
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChatRoomUser = /* GraphQL */ `
  subscription OnUpdateChatRoomUser {
    onUpdateChatRoomUser {
      id
      userID
      chatRoomID
      isImportant
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChatRoomUser = /* GraphQL */ `
  subscription OnDeleteChatRoomUser {
    onDeleteChatRoomUser {
      id
      userID
      chatRoomID
      isImportant
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateChatRoom = /* GraphQL */ `
  subscription OnCreateChatRoom {
    onCreateChatRoom {
      id
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        id
        createdAt
        content
        userID
        chatRoomID
        isImage
        isSpam
        videoCats
        user {
          id
          name
          imageUri
          status
          impMessages
          videoCats
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          createdAt
          updatedAt
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateChatRoom = /* GraphQL */ `
  subscription OnUpdateChatRoom {
    onUpdateChatRoom {
      id
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        id
        createdAt
        content
        userID
        chatRoomID
        isImage
        isSpam
        videoCats
        user {
          id
          name
          imageUri
          status
          impMessages
          videoCats
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          createdAt
          updatedAt
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteChatRoom = /* GraphQL */ `
  subscription OnDeleteChatRoom {
    onDeleteChatRoom {
      id
      chatRoomUser {
        items {
          id
          userID
          chatRoomID
          isImportant
          createdAt
          updatedAt
        }
        nextToken
      }
      messages {
        items {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        nextToken
      }
      lastMessageID
      lastMessage {
        id
        createdAt
        content
        userID
        chatRoomID
        isImage
        isSpam
        videoCats
        user {
          id
          name
          imageUri
          status
          impMessages
          videoCats
          createdAt
          updatedAt
        }
        chatRoom {
          id
          lastMessageID
          createdAt
          updatedAt
        }
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      createdAt
      content
      userID
      chatRoomID
      isImage
      isSpam
      videoCats
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      createdAt
      content
      userID
      chatRoomID
      isImage
      isSpam
      videoCats
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      createdAt
      content
      userID
      chatRoomID
      isImage
      isSpam
      videoCats
      user {
        id
        name
        imageUri
        status
        impMessages
        chatRoomUser {
          nextToken
        }
        videoCats
        createdAt
        updatedAt
      }
      chatRoom {
        id
        chatRoomUser {
          nextToken
        }
        messages {
          nextToken
        }
        lastMessageID
        lastMessage {
          id
          createdAt
          content
          userID
          chatRoomID
          isImage
          isSpam
          videoCats
          updatedAt
        }
        createdAt
        updatedAt
      }
      updatedAt
    }
  }
`;
