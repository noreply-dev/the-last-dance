import { HomeScreen } from 'app/features/home'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { useSession, withSession } from 'protolib'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'

export default function Page(props: any) {
  useSession(props.pageSession)
  const [body, setBody] = useState<any>(null)

  useEffect(() => {
    setBody(document.body)
    console.log('page session', props.pageSession)
  }, [])

  return (
    <>
      <Head>
        <title>Auna PDFs</title>
      </Head>
      {/* <HomeScreen {...props} /> */}
      <div className="h-full w-full flex flex-col justify-center items-center">
        <Image
          className="absolute top-9 left-9 bg-white rounded-full
          animate-blur opacity-0"
          src="/auna-logo.png"
          alt="auna logo"
          height={40}
          width={40}
        />
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
          <Link
            href={props.pageSession.loggedIn
              ? "/admin/files"
              : "/auth/login?return=/admin/files"
            }
          >login</Link>
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
      </div>
    </>
  )
}

export const getServerSideProps = SSR(async (context: NextPageContext) => withSession(context, undefined))