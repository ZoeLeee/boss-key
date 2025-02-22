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

  const [edit, setEdit] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSite(e.target.value)
    setData(StorageKey.TARGET_SITE, e.target.value)
  }

  const handleShortKeyChange = (v: string[]) => {
    setShortKey(v)
    setData(StorageKey.SHORTCUT_KEY, v)
  }

  useEffect(() => {
    getData(StorageKey.SHORTCUT_KEY).then((res: string[]) => {
      setShortKey(res ?? DEFAULT_SHORTCUT_KEY)
    })

    getData(StorageKey.TARGET_SITE).then((res: string) => {
      setSite(res || DEFAULT_TARGET_SITE)
    })
  }, [])

  return (
    <div
      onKeyDown={(e) => {
        e.stopPropagation()
        e.preventDefault()
        
        if (!edit) return

        const values = []
        if (e.ctrlKey) {
          values.push("Ctrl")
        }

        if (e.altKey) {
          values.push("Alt")
        }

        if (e.shiftKey) {
          values.push("Shift")
        }

        if (e.metaKey) {
          values.push("Meta")
        }

        values.push(e.key)

        handleShortKeyChange(values)

        setEdit(false)
      }}
      style={{
        padding: 16
      }}>
      目标网站: <input value={site} onChange={handleChange} />
      快捷键(双击编辑):{" "}
      <input value={edit ? "输入快捷键" : shortKey.join("+")} onDoubleClick={() => setEdit(true)} />
    </div>
  )
}

export default IndexPopup
