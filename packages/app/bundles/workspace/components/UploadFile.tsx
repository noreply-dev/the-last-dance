import { fileToBase64 } from "lib/sessionFs"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useRef, useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useAtom } from 'jotai'
import { fileBlobAtom, fileDataAtom } from "pages/index"

export default function UploadFile() {
  const [, setFileBlob] = useAtom(fileBlobAtom)
  const [, setFileData] = useAtom(fileDataAtom)
  const [body, setBody] = useState<any>(null)
  const ref = useRef<HTMLInputElement>(null)
  const nextRouter = useRouter()

  useEffect(() => {
    setBody(document.body)
  }, [])

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target) return
    let element = e.target as HTMLInputElement
    if (!element?.files) return console.log('No files')
    const file = element.files[0]

    // file blob url
    const blobURL = URL.createObjectURL(file)
    setFileBlob(blobURL)

    // file content
    const fileContent = fileToBase64(file)
    setFileData(fileContent)

    nextRouter.push('/workspace')
  }

  return (
    <div
      className="grid place-items-center h-fit w-full animate-zoom-out opacity-0"
    >
      <h1
        style={{ fontFamily: 'Poppins' }}
        className="font-semibold text-[50px] text-white mb-2"
      >Auna pdf parser</h1>
      <p
        style={{ fontFamily: 'Poppins' }}
        className="text-white font-normal text-lg mb-9"
      ><span className="bg-[#0056ff81] text-white mr-2 h-fi i
        w-fit px-2 py-1 rounded-md border border-solid border-[#0056ff]
        text-sm"
      >
          AI</span>assited pdf products extraction tool
      </p>
      <button
        onClick={() => { if (ref.current) ref.current?.click() }}
        className="px-4 py-2 bg-white rounded-md flex flex-row justify-center items-center gap-2
          text-black"
      >
        <Image src={"/file-text.svg"} height={15} width={15} alt="file icon" />
        select file</button>
      <input ref={ref} className="hidden" type="file" onChange={handleUpload} />
      {
        body && createPortal(
          <div className="absolute grid h-full w-full place-items-center z-[-1] ">
            <div className="bg-[#0055ff8f] h-[28vh] w-[28vw] shadow-blur blur-3xl rounded-full animate-blur
              opacity-0"></div>
          </div>,
          body
        )
      }
    </div>
  )



}