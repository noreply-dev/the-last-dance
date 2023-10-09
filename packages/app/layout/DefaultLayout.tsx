import { Footer } from './Footer'
import { HeaderContents } from './HeaderContents'
import { AppBar } from 'protolib'
import { ToastProvider, ToastViewport } from '@tamagui/toast'
// import { NextSeo } from 'next-seo'
import React from 'react'
import { Stack, StackProps, XStack, YStack } from 'tamagui'

export const DefaultLayout = React.forwardRef(({
  children,
  sideMenu = null,
  footer = <Footer />,
  header = <AppBar><HeaderContents /></AppBar>,
  seoProps = {},
  title = "Protofy",
  description = "Protofy",
  openGraph = {
    type: 'website',
    locale: 'en_US',
    url: 'https://protofy.xyz',
    siteName: 'Protofy',
    images: [
      {
        url: 'https://protofy.xyz/social.png',
      },
    ],
  },
  ...props
}: {
  sideMenu?: React.ReactNode | null,
  children: React.ReactNode,
  footer?: React.ReactNode,
  header?: React.ReactNode,
  seoProps?: any,
  title?: string
  description?: string,
  openGraph?: any
} & StackProps, ref: any) => {
  return (
    <Stack f={1} ref={ref} {...props}>
      {/* <NextSeo
        title={title}
        description={description}
        openGraph={openGraph}
        {...seoProps}
      /> */}

      <ToastProvider swipeDirection="horizontal">
        {header}
        <XStack f={1}>
          {sideMenu}
          <YStack f={1}>
            {children}
          </YStack>

        </XStack>

        {footer}

        <ToastViewport flexDirection="column-reverse" top="$2" left={0} right={0} />
        <ToastViewport
          multipleToasts
          name="viewport-multiple"
          flexDirection="column-reverse"
          top="$2"
          left={0}
          right={0}
        />
      </ToastProvider>
    </Stack>
  )
})
