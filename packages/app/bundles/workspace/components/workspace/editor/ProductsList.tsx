import React, { useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useAtom } from 'jotai'
import { ProductField, productsListAtom } from './Products'
import { ProductsAtom, removeField } from 'context/ProductsContext'
import { WorkspaceContext, getComputedPage } from 'context/WorkspaceContext'
import { JSONViewer } from 'protolib'
import Image from 'next/image'

export function ProductsList() {
  const [productsListVisible, setProductsListVisible] = useAtom(productsListAtom)

  return <>
    {
      productsListVisible && createPortal(
        <AllProductsModal />,
        document.body
      )
    }
  </>
}

function AllProductsModal() {
  const [productsListVisible, setProductsListVisible] = useAtom(productsListAtom)
  const [productsData] = useAtom(ProductsAtom)
  const { workspace } = useContext(WorkspaceContext)

  return (
    <div
      className='absolute top-0 left-0 h-screen w-screen bg-[#0a0a0a9f] z-9999
        grid place-items-center'
      onClick={() => setProductsListVisible(false)}>
      <div
        className='w-fit max-w-[40vw] max-h-2/3 h-2/3 overflow-hidden flex flex-col rounded-3xl 
          bg-[#0f0f0f] border border-solid border-[#323232] px-8 py-6'
        onClick={((e) => e.stopPropagation())}
      >
        <p className='text-2xl text-white mb-4'>Page products</p>
        <div className='flex flex-col h-full w-full overflow-scroll
          gap-4 pt-4 pr-1'>
          {

            productsData[getComputedPage(workspace, false)].map((product: any, index: number) => {
              return <ListProduct product={product} key={index} productIndex={index} />
            })
          }
        </div>
      </div>
    </div>

  )
}

function ListProduct({ product, productIndex }: { product: any, productIndex: number }) {
  return (
    <div className='flex flex-col w-full h-fit'>
      {
        Object.keys(product).map((field: string, index: number) => {
          if (!field) return null

          return <ListProductField
            keyName={field}
            productIndex={productIndex}
            key={index}
          />
        })
      }
    </div>
  )
}


function ListProductField({
  productIndex,
  keyName
}: {
  productIndex: number,
  keyName: string
}) {
  const { workspace } = useContext(WorkspaceContext)

  const [pagesData, setPagesData] = useAtom(ProductsAtom)

  const product = pagesData[getComputedPage(workspace, false)][productIndex]

  return (
    <div
      className="h-fit w-full flex flex-row justify-start items-start
        gap-3 mb-4">
      <p className="h-fit w-fit px-4 py-2 bg-[#292929]
          rounded-md text-[#4E4E4E] whitespace-nowrap cursor-default">{keyName.length > 32 ? keyName.slice(0, 32) + '...' : keyName}</p>
      <input
        type="text"
        className={`h-fit w-full px-4 py-2 bg-[#292929] placeholder:text-[#4E4E4E]
          rounded-md text-white font-light border-none outline-none focus:outline-3 
          outline focus:outline-[#0056ff] focus:outline-offset-2 transition-all ease-in-out 
          duration-[0.12s]`}
        placeholder={'not set'}
        value={
          product[keyName as keyof typeof product] === 'not set'
            ? ''
            : product[keyName as keyof typeof product]
        }
        onChange={(e) => {
          const value = e.target.value as string

          const pages = [...pagesData]
          const changableProduct: any = pages[getComputedPage(workspace, false)][productIndex]

          changableProduct[keyName as keyof typeof changableProduct] = value
          setPagesData(pages)
        }}
      />
      <button
        onClick={() => {
          removeField(
            setPagesData,
            pagesData,
            getComputedPage(workspace, false),
            productIndex,
            keyName
          )
        }}
        className="h-full min-w-fit px-4 bg-[#292929]
          rounded-md border-none outline-none active:outline-3 active:outline 
          active:outline-[#FF0000] active:outline-offset-2 duration-[0.12s]
            active:scale-[0.94] focus:outline-[#FF0000] focus:outline-offset-2"
      >
        <Image src="/trash.svg" alt="delete field icon" height={18} width={18} />
      </button>
    </div>
  )
}