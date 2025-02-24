import { Command, DEFAULT_TARGET_SITE, getData, StorageKey } from "~utils"

let oldTabUrls: string[] = []

let fakeTab: chrome.tabs.Tab

const oldWindows = new Map<number, Record<string, any>>()

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    const targetSite = (await getData(StorageKey.TARGET_SITE)) as string

    if (request.type === Command.Toggle) {
      if (oldWindows?.size) {
        // for (let tab of oldTabUrls) {
        //   chrome.tabs.create({ url: tab })
        // }

        // if (fakeTab) {
        //   chrome.tabs.remove(fakeTab.id)
        //   fakeTab = null
        // }
        // oldTabUrls = null

        for (const [id, win] of oldWindows) {
          const newWin = await chrome.windows.create({
            left: win.left,
            top: win.top,
            width: win.width,
            height: win.height,
            focused: win.focused
          })
          Promise.all(
            win.tabs.map((tab) =>
              chrome.tabs.create({
                url: tab.url,
                active: tab.active,
                windowId: newWin.id
              })
            )
          )
        }

        if (fakeTab) {
          chrome.tabs.remove(fakeTab.id)
          fakeTab = null
        }

        oldWindows.clear()
      } else {
        // chrome.tabs.query({}, (tabs) => {
        //   chrome.tabs
        //     .create({ url: targetSite || DEFAULT_TARGET_SITE })
        //     .then((tab) => {
        //       fakeTab = tab
        //       tab.active = true
        //     })
        //   oldTabUrls = tabs.filter((tab) => !!tab.url).map((tab) => tab.url)
        //   for (let tab of tabs) {
        //     chrome.tabs.remove(tab.id)
        //   }
        // })
        const windows = await chrome.windows.getAll({ populate: true })

        for (let window of windows) {
          const tabs = window.tabs ?? []
          oldWindows.set(window.id, {
            left: window.left,
            top: window.top,
            width: window.width,
            height: window.height,
            focused: window.focused,
            tabs: tabs.map((tab) => ({
              url: tab.url,
              active: tab.active
            }))
          })
          for (let tab of tabs) {
            chrome.tabs.remove(tab.id)
          }
        }

        chrome.tabs
          .create({ url: targetSite || DEFAULT_TARGET_SITE })
          .then((tab) => {
            fakeTab = tab
            tab.active = true
          })
      }
    }

    sendResponse("close success")
  }
)
