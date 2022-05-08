/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchGetMessages = /* GraphQL */ `
  query BatchGetMessages($ids: [ID]) {
    batchGetMessages(ids: $ids) {
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
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const getChatListItem = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      impMessages
      chatRoomUser {
        items {
          id
          userID
          isImportant
          chatRoom {
            id
            lastMessage {
              id
              content
              isImage
              createdAt
              isSpam
              videoCats
              user {
                name
                id
              }
            }
            chatRoomUser {
              items {
                user {
                  id
                  name
                  imageUri
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const getChatUsers = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      chatRoomUser {
        items {
          chatRoom {
            chatRoomUser {
              items {
                id
                userID
                chatRoomID
                isImportant
                chatRoom {
                  id
                  lastMessage {
                    id
                    content
                    createdAt
                    user {
                      name
                      id
                    }
                  }
                  chatRoomUser {
                    items {
                      user {
                        id
                        name
                        imageUri
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getChatRoomUser = /* GraphQL */ `
  query GetChatRoomUser($id: ID!) {
    getChatRoomUser(id: $id) {
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
export const listChatRoomUsers = /* GraphQL */ `
  query ListChatRoomUsers(
    $filter: ModelChatRoomUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRoomUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getChatRoom = /* GraphQL */ `
  query GetChatRoom($id: ID!) {
    getChatRoom(id: $id) {
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
export const listChatRooms = /* GraphQL */ `
  query ListChatRooms(
    $filter: ModelChatRoomFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listChatRooms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
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
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const messagesByChatRoom = /* GraphQL */ `
  query MessagesByChatRoom(
    $chatRoomID: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    messagesByChatRoom(
      chatRoomID: $chatRoomID
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
