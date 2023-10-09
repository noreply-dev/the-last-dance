import Editor from "../components/workspace/Editor";
import PdfPage from "../components/workspace/PdfPage";
import PdfPreview from "../components/workspace/PdfPreviewer";
import { useSession, withSession } from 'protolib'
import { NextPageContext } from 'next'
import { atom, useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export const FileBlobAtom = atom('')
export const PagesIndexesAtom = atom([])

export function Workspace(props: any) {
  useSession(props.pageSession)
  const router = useRouter()
  const [fileBlobUrl, setFileBlobUrl] = useAtom(FileBlobAtom)
  const [isFileQuery, setIsFileQuery] = useState(router.query.file
    ? true
    : false)

  useEffect(() => {
    if (props.pdfData) {
      console.log(props.pdfData)
      const file = new Blob([Buffer.from(props.pdfData, 'base64')], {
        type: 'application/pdf'
      })

      const blobUrl = URL.createObjectURL(file)
      setFileBlobUrl(blobUrl)
    }
  }, [])

  return (
    <>
      {
        isFileQuery
          ? <div className="h-full w-full flex flex-row justify-start items-start">
            <div className="h-full min-w-[15vw] width-[15vw] bg-[#171717] flex flex-col justify-start items-center
              py-10">
              <p className="text-white">PDF pages</p>
              <PdfPreview />
            </div>
            <PdfPage />
            <Editor />
          </div >
          : <div className="h-full w-full grid place-items-center">
            <p>No file provided</p>
          </div>
      }
    </>
  )
}

export const getServerSideProps = async (context: NextPageContext, { fs, path }: { fs: any, path: any }) => {
  const baseUrl = '/home/ubuntu/auna/the-last-dance/22-05/'
  const { file } = context.query

  let base64 = ''
  if (file) {
    const filePath = path.join(baseUrl, file)

    const buffer = fs.readFileSync(filePath)
    base64 = buffer.toString('base64')
  }

  return withSession(context, ['admin'], { pdfData: base64 })
}