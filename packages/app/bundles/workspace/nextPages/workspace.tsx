import Editor from "../components/workspace/Editor";
import PdfPage from "../components/workspace/PdfPage";
import PdfPreview from "../components/workspace/PdfPreviewer";
import { WorkspaceProvider } from "../context/WorkspaceContext";
import { useSession, withSession } from 'protolib'
import { NextPageContext } from 'next'
import { atom, useAtom } from 'jotai'

export const FileBlobAtom = atom('')

export function Workspace(props: any) {
  useSession(props.pageSession)
  const [fileBlobUrl] = useAtom(FileBlobAtom)

  return (
    <>
      {
        fileBlobUrl
          ? <div className="h-full w-full flex flex-row justify-start items-start
          bg-red-400">
            <div className="h-full min-w-[15vw] bg-[#171717] flex flex-col justify-start items-center
          py-10">
              <p className="text-red-400">PDF pages</p>
              {/* <PdfPreview /> */}
            </div>
            {/*       <PdfPage />
        <Editor /> */}
          </div >
          : <div className="h-full w-full grid place-items-center">
            <p>No file provided</p>
          </div>
      }
    </>
  )
}

export const serverExecuted = async (context: NextPageContext) => {
  return withSession(context, ['admin'])
}