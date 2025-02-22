export const DEFAULT_SHORTCUT_KEY = ["Home"]
export const DEFAULT_TARGET_SITE = "https://ai.com/"

export enum Command {
  Toggle = "TOGGLE_TAB_STATUS",
  reset = "RESET"
}

export enum StorageKey {
  TARGET_SITE = "TARGET_SITE",
  SHORTCUT_KEY = "SHORTCUT_KEY",
  STATUS = "STATUS"
}

export const setData = (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve({ [key]: value })
    })
  })
}

export const getData = (key: string) => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key])
    })
  })
}
