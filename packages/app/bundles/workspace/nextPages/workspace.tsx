import Editor from "../components/workspace/Editor";
import PdfPage from "../components/workspace/PdfPage";
import PdfPreview from "../components/workspace/PdfPreviewer";
import { useSession, withSession } from 'protolib'
import { NextPageContext } from 'next'
import { atom, useAtom } from 'jotai'

export const FileBlobAtom = atom('https://www.grupo-sm.com/sites/sm-espana/files/resources/Imagenes/MKT/aprendo-en-casa/Religion/Secundaria/Peli%CC%81cula-14.-1-La-Misio%CC%81n.pdf')
export const PagesIndexesAtom = atom([])

export function getComputedPage(currentPage: any, human: any) {
  return human ? currentPage : currentPage - 1
}


export function Workspace(props: any) {
  useSession(props.pageSession)
  const [fileBlobUrl] = useAtom(FileBlobAtom)

  return (
    <>
      {
        fileBlobUrl
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

export const serverExecuted = async (context: NextPageContext) => {
  return withSession(context, ['admin'])
}