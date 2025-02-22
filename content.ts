import isHotkey from "is-hotkey"

import { Command, DEFAULT_SHORTCUT_KEY, getData, StorageKey } from "~utils"

console.log("Boss Key content script loaded")

window.addEventListener(
  "keydown",
  async (e) => {
    const shortcutKey = (await getData(StorageKey.SHORTCUT_KEY)) as string[]
    const isSaveHotkey = isHotkey(shortcutKey ?? DEFAULT_SHORTCUT_KEY)

    if (isSaveHotkey(e)) {
      e.stopPropagation()
      e.preventDefault()
      chrome.runtime.sendMessage({ type: Command.Toggle }, function (response) {
        console.log(response)
      })
      return false
    }
  },
  true
)
