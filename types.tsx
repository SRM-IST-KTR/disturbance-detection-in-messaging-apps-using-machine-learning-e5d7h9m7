/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
  ChatRoom: undefined;
  Contacts: undefined
};

export type MainTabParamList = {
  Chats: undefined;
  ImportantMessages: undefined;
  ImportantContacts: undefined
};

export type User = {
  id: String;
  name: String;
  imageUri: String;
  status: String;
}

export type Message = {
  id: String;
  content: String;
  createdAt: String;
  user: User;
  chatRooID: String;
}

export type ChatRoom = {
  id: String;
  users: User[];
  lastMessageID: String;
  lastMessage: Message;
}

export type ChatListItemProps = {
  chatRoom: ChatRoom;
}

export type ContactListItemProps = {
  user: User;
}
