'use client'

import { ConfigContext } from "@/context/ConfigContext"
import { WorkspaceContext } from "@/context/WorkspaceContext"
import { fileFromPdfPage } from "@/lib/pdf"
import React, { useContext, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Lottie from 'lottie-react'
import spinner from '@/public/spinner.json'
import jsonToUrl from '@autotrof/json-to-url'

export function ConfigBuilder() {
  const { config } = useContext(ConfigContext)
  const { workspace, setWorkspace } = useContext(WorkspaceContext)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState(false)

  const parseFile = async () => {
    // no parse if there is a bad config
    try {
      const _ = JSON.parse(config)
    } catch {
      return
    }

    setParsing(true)
    const pageFile = await fileFromPdfPage(workspace.currentPage > 0 ? workspace.currentPage - 1 : 0)

    if (!(pageFile instanceof File)) {
      setParsing(false)
      setError(true)
      return null
    }

    // create a form with the file
    const form = new FormData()
    form.append('filePdf', pageFile)

    // fetch the pdf service 
    const url = 'http://51.75.204.30:3000/upload/page?' + jsonToUrl(JSON.parse(config))

    const response = await fetch(url, {
      method: 'POST',
      body: form
    }).then(res => res.json())
      .then(data => data)
      .catch(() => {
        setParsing(false)
        setError(true)
      })

    if (response.status !== "200") {
      setParsing(false)
      setError(true)
      return
    }

    const pages = [...workspace.pages]
    pages[workspace.currentPage] = response.data

    setWorkspace({
      ...workspace,
      pages
    })
  }

  return <>
    <h1
      className="text-white text-xl"
    >Configure parser</h1>
    {
      parsing &&
      createPortal(
        <div className="absolute top-0 left-0 grid place-items-center
          h-full w-full bg-[#000000d6] z-50">
          <div className="h-fit w-fit px-6 py-4
            bg-[#0A0A0A] border border-solid border-[#4D4D4D]
            rounded-lg animate-appear flex flex-row justify-center items-center
            gap-3"
          >
            <p className="text-[#6F6F6F] font-thin text-sm"
            >
              Generating page <br />products
            </p>
            <Lottie
              animationData={spinner}
              style={{
                height: '80px', width: '80px', padding: '0px',
                marginRight: '-30px', marginLeft: '-20px', marginBlock: '-20px'
              }}
            />
          </div>
        </div>,
        document.body
      )
    }
    {
      error &&
      createPortal(
        <div
          onClick={() => setError(false)}
          className="absolute top-0 left-0 grid place-items-center
            h-full w-full bg-[#000000d6] z-50">
          <div className="h-fit w-fit px-6 py-4
            bg-[#0A0A0A] border border-solid border-[#911c1c]
            rounded-lg animate-appear flex flex-row justify-center items-center
            gap-3 text-center"
          >
            <p className="text-[#ff3939] font-thin text-sm"
            >
              Something went wrong<br /> parsing the page
            </p>
          </div>
        </div>,
        document.body
      )
    }
    <OptionsJson />
    <div className="h-fit w-full flex flex-row justify-center items-center
    gap-4">
      <button
        onClick={() => parseFile()}
        className="h-10 w-fit px-20 rounded-lg border-[2px] 
        border-solid border-[#1F1F1F] text-[#6F6F6F] font-light
        hover:bg-[#D9D9D9] transition-all ease-in-out duration-[0.12s]
        cursor-pointer"
      >Parse</button>
    </div>
  </>
}

function OptionsJson() {
  const { config, setConfig } = useContext(ConfigContext)
  const editorRef = useRef<any>(null)

  // THIS IS A BASIC JSON CHECKER TEXT AREA METHOD
  const validate = () => {
    try {
      const validConfig = JSON.parse(config)
      setConfig(JSON.stringify(validConfig, null, 2))
      editorRef!.current.style.border = '0px solid red'
    } catch (e) {
      editorRef!.current.style.border = '1px solid red'
    }
  }

  const handleChange = (e: any) => {
    const updated = e.target.value
    setConfig(updated)
  }

  return (
    <code className="h-full w-full bg-transparent">
      <textarea
        ref={editorRef}
        onBlur={validate}
        onChange={handleChange}
        value={config}
        className={`h-full w-full resize-none outline-none p-5
          bg-transparent rounded-xl text-[#6F6F6F] focus:bg-[#1f1f1f]
          transition-all ease-in-out duration-[0.12s]`}
      />
    </code>
  )
}