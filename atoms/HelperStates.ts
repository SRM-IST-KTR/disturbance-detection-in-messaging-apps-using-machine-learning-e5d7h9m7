import { atom } from "recoil";

export const Emoji = atom({
  key: 'Emoji',
  default: false
})

export const UserUpdate = atom({
  key: 'UserUpdate',
  default: false
})

export const UserData = atom({
  key: 'UserData',
  default: {}
})

export const TintColor = atom({
  key: 'TintColor',
  default: 'blue'
})

export const AvatarLock = atom({
  key: 'AvatarLock',
  default: false
})
