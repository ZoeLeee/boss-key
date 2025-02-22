import { Command, DEFAULT_TARGET_SITE, getData, StorageKey } from "~utils"

let oldTabs: chrome.tabs.Tab[] = []

let fakeTab: chrome.tabs.Tab

// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(
  async function (request, sender, sendResponse) {
    const targetSite = (await getData(StorageKey.TARGET_SITE)) as string

    if (request.type === Command.Toggle) {
      if (oldTabs?.length) {
        for (let tab of oldTabs) {
          chrome.tabs.create({ url: tab.url })
        }

        if (fakeTab) {
          chrome.tabs.remove(fakeTab.id)
          fakeTab = null
        }
        oldTabs = null
      } else {
        chrome.tabs.query({}, (tabs) => {
          chrome.tabs
            .create({ url: targetSite || DEFAULT_TARGET_SITE })
            .then((tab) => {
              fakeTab = tab
            })
          oldTabs = tabs.filter((tab) => !!tab.url)
          for (let tab of tabs) {
            chrome.tabs.remove(tab.id)
          }
        })
      }
    }

    sendResponse("close success")
  }
)
