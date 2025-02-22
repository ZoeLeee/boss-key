import { Command, DEFAULT_TARGET_SITE, getData, StorageKey } from "~utils"

let oldTabUrls: string[] = []

let fakeTab: chrome.tabs.Tab

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    const targetSite = (await getData(StorageKey.TARGET_SITE)) as string

    if (request.type === Command.Toggle) {
      if (oldTabUrls?.length) {
        for (let tab of oldTabUrls) {
          chrome.tabs.create({ url: tab })
        }

        if (fakeTab) {
          chrome.tabs.remove(fakeTab.id)
          fakeTab = null
        }
        oldTabUrls = null
      } else {
        chrome.tabs.query({}, (tabs) => {
          chrome.tabs
            .create({ url: targetSite || DEFAULT_TARGET_SITE })
            .then((tab) => {
              fakeTab = tab
              tab.active = true
            })
          oldTabUrls = tabs.filter((tab) => !!tab.url).map((tab) => tab.url)
          for (let tab of tabs) {
            chrome.tabs.remove(tab.id)
          }
        })
      }
    }

    sendResponse("close success")
  }
)
