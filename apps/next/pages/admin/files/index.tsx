import AdminPanel from 'app/features/admin'
import Head from 'next/head'
import { SSR } from '../../../conf'
import { NextPageContext } from 'next'
import { API, redirect, withSession } from 'protolib'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router';
import { promises as fs } from 'fs';
import fsSync from 'fs'

const FileBrowser = dynamic(() => import('../../../components/FileBrowser'), {
  ssr: false,
})

export default function FilesPage({workspace, data}:any) {
  const router = useRouter();
  const { name } = router.query;
  return (
    <>
      <Head>
        <title>Protofy - Admin Panel</title>
      </Head>
      <AdminPanel workspace={workspace}>
        <FileBrowser path={data?.CurrentPath} file={data?.CurrentFile} filesState={data?.filesState} />
      </AdminPanel>
    </>
  )
}

export const getServerSideProps = SSR(async (context:NextPageContext) => {
    const nameSegments = context.query.name as string[];
    
    let props = {}
    const path = nameSegments ? nameSegments.join('/') : '';
    //@ts-ignore
    const currentFile = context.query.file ? context.query.file.split('/')[0] : ''
    props = {
      data: {
        filesState: await API.get('/adminapi/v1/files/'+path) ?? { data: [] },
        CurrentPath: path,
        CurrentFile: currentFile
      }
    }
    console.log('Requesting to: *****************', '/adminapi/v1/files/'+path)
    

    return withSession(context, ['admin'], {
      ...props,
      workspace: await API.get('/adminapi/v1/workspaces')
    })
})