import { useEffect, useState } from "react"

import {
  DEFAULT_SHORTCUT_KEY,
  DEFAULT_TARGET_SITE,
  getData,
  setData,
  StorageKey
} from "~utils"

function IndexPopup() {
  const [shortKey, setShortKey] = useState([""])

  const [site, setSite] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSite(e.target.value)
    setData(StorageKey.TARGET_SITE, e.target.value)
  }

  useEffect(() => {
    getData(StorageKey.SHORTCUT_KEY).then((res: string[]) => {
      console.log("res: ", res)
      console.log("DEFAULT_SHORTCUT_KEY: ", DEFAULT_SHORTCUT_KEY)
      setShortKey(res ?? DEFAULT_SHORTCUT_KEY)
    })

    getData(StorageKey.TARGET_SITE).then((res: string) => {
      setSite(res || DEFAULT_TARGET_SITE)
    })
  }, [])

  return (
    <div
      style={{
        padding: 16
      }}>
      目标网站: <input value={site} onChange={handleChange} />
      快捷键: <div>{shortKey.join("+")}</div>
    </div>
  )
}

export default IndexPopup
