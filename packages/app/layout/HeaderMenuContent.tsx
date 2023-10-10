import * as React from 'react'
import { Popover, YStack } from 'tamagui'
import Link from 'next/link'
import { useAtom } from 'jotai'
import { createSession } from 'protolib'
import { Session } from 'protolib'

export const HeaderMenuContent = React.memo(function HeaderMenuContent() {
  const [session, setSession] = useAtom(Session)
  return (
    <YStack miw={230} px="$5" py="$4" ai="flex-end" gap="12px" display='flex' flexDirection='column'>
      {session.loggedIn ? <>
        {session.user?.type == 'admin' ? <Link className='w-full h-fit hover:text-[#898989]' href="/admin/files/data/pdfs">Control Panel</Link> : null}
        <Link className='w-full h-fit rounded-md hover:text-[#898989]' onClick={() => setSession(createSession())} href="">Logout</Link>
      </> : <Link className='w-full h-fit hover:text-[#898989]' href="/auth/login">Login</Link>}
      {/* <Separator my="$4" w="100%" />

          <Separator my="$4" w="100%" /> */}
    </YStack>
  )
})