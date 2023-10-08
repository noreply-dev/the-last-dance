import { withSession } from 'protolib'
import { NextPageContext } from 'next'

import { atom } from 'jotai'

export const fileBlobAtom = atom('')
export const fileDataAtom = atom('')

export function Workspace() {
  return (
    <div style={{}}>
      <p className='text-blue-500'>RUTA POR DEFECTO DEL WORKSPACE</p>
    </div>
  )
}

export const serverExecuted = async (context: NextPageContext) => {
  return withSession(context, undefined)
}