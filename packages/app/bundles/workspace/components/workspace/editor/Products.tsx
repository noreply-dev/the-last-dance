'use client'

import {
  FocusFieldAtom,
  FocusProductAtom,
  ProductsAtom,
  ProductsSchemasAtom,
  addField,
  removeField
} from "../../../context/ProductsContext"
import { getComputedPage } from "../../../context/WorkspaceContext"
import { useRef, useState } from "react"
import { Key } from "./Key"
import { PageActions } from "./PageActions"
import Image from "next/image"
import { ProductsList } from "./ProductsList"
import { atom, useAtom } from 'jotai'
import { CurrentPageAtom } from "../../../context/WorkspaceContext"

export const productsListAtom = atom(false)

export function Products() {
  const [currentPage] = useAtom(CurrentPageAtom)

  const [pagesSchemas, setPagesSchemas] = useAtom(ProductsSchemasAtom)
  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct] = useAtom(FocusProductAtom)

  const [showKeys, setShowKeys] = useState(true)
  const productRef = useRef<HTMLDivElement>(null)

  function updateSchemas(str: string) {
    const newPagesSchemas = [...pagesSchemas]
    newPagesSchemas[getComputedPage(currentPage, false)] = str

    setPagesSchemas(newPagesSchemas)

    // avoid empty string
    if (str === '') return

    // if there'n "," do not update the fields
    if (str[str.length - 1] !== ',') return

    // update fields
    const newFields = str
      .split(',')
      .filter(field => field !== '')
      .map((field: any) => field.trim())

    // atomic update
    const newPages = [...pagesData]
    const updatedProducts = newPages[getComputedPage(currentPage, false)]
      .map((product: any) => {
        const reduceProduct: any = { ...product }

        newFields.forEach((field: string) => {
          reduceProduct[field as keyof typeof reduceProduct] = product[field] || 'not set'
        })

        return reduceProduct
      })

    // update products for the whole page 
    newPages[getComputedPage(currentPage, false)] = [...updatedProducts]

    setPagesData(newPages)
  }

  return <>
    <h1
      className="text-[#fff] font-semibold text-2xl mb-3"
    >Products</h1>
    <p
      className="text-[#6F6F6F] text-base mb-7"
    >Select all the products that may be present on this page and the save.</p>
    <div className="mb-8 h-fit w-full flex flex-col justify-start items-start gap-4">
      <p className="text-white">Product schema</p>
      <input
        id="schemaInput"
        type="text"
        value={pagesSchemas[getComputedPage(currentPage, false)]}
        onChange={(e) => updateSchemas(e.target.value)}
        className="h-fit w-full px-4 py-2 bg-[#292929] placeholder:text-[#4E4E4E]
            rounded-md text-white font-light border-none outline-none focus:outline-3 
            focus:outline focus:outline-[#0056ff] focus:outline-offset-2 
            transition-all ease-in-out delay-[.01s] mb-3"
        placeholder="e.g. name, price, color" />
      <Key chars="ctrl + n" to="add field" />
    </div>
    <div
      className="relative h-fit w-full flex flex-col justify-start"
      ref={productRef}
    >
      <Product product={pagesData[getComputedPage(currentPage, false)][focusProduct]} />
    </div>
    <div className="w-full h-fit text-white flex flex-col mb-7">
      {
        showKeys
          ? <div className="flex flex-col justify-center items-center gap-4 mt-3">
            <Key chars="ctrl + a" to="go down" />
            <Key chars="ctrl + s" to="go up" />
            <Key chars="enter" to="go to the new product" />
            <Key chars="ctrl + backspace" to="go to the prev. product" />
            <p className="mt-3 cursor-pointer text-[#6f6f6f]" onClick={() => setShowKeys(false)}>tap to hide shortcuts</p>
          </div>
          : <div className="flex flex-row justify-center items-end gap-4">
            <p className="mt-3 cursor-pointer text-[#6f6f6f] hover:py-4
              ease-in-out transition-all duration-[0.12s] px-4 py-2" onClick={() => setShowKeys(true)}>tap to show shortcuts</p>
          </div>
      }
    </div>
    <div className="h-fit w-full flex flex-col justify-start items-start gap-4 mb-8">
      <p className="text-white">Page actions</p>
      <PageActions />
    </div>
    <ProductsList />
  </>
}

function Product({ product }: { product: any }) {
  const [currentPage] = useAtom(CurrentPageAtom)

  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct] = useAtom(FocusProductAtom)
  const [propertyName, setPropertyName] = useState('')

  return (<div className="w-full h-fit text-white flex flex-col mb-7">
    <p className="text-white mb-4">Current Product: {focusProduct + 1}</p>
    {
      Object.keys(product)
        .map((key: any, index: number) => {
          if (!key) return null

          return <ProductField
            key={index}
            keyName={key}
            fieldIndex={index}
          />
        })
    }
    <form className='flex flex-row justify-start items-center my-4 gap-3'>
      <input
        type="text"
        placeholder='property name'
        value={propertyName}
        onChange={(e) => setPropertyName(e.target.value)}
        className='w-full h-fit px-4 
            py-2 bg-[#292929] rounded-md text-[#6f6f6f] border border-solid
            border-[#6F6F6F] placeholder:text-[#4E4E4E] outline-none
            focus:outline-2 focus:outline-[#6F6F6F] transition-all ease-in-out
            duration-[0.08s]'
      />
      <button
        onClick={(e) => {
          e.preventDefault()

          addField(
            setPagesData,
            pagesData,
            getComputedPage(currentPage, false),
            focusProduct,
            propertyName
          )
          setPropertyName('')
        }}
        className="h-fit w-full flex flex-row justify-center items-center px-4 
            py-2 bg-[#D9D9D9] rounded-md text-[#6f6f6f] font-light border-none 
            outline-none focus:outline-3 focus:outline focus:outline-[#D9D9D9] 
            focus:outline-offset-2 transition-all ease-in-out duration-[.08s] gap-3
            active:scale-[0.94]"
      >
        <p>Add product property</p>
        <Image src='/return.svg' alt="return icon" height={20} width={20} />
      </button>
    </form>
  </div>)
}

export function ProductField(
  { keyName, fieldIndex }
    : { keyName: string, fieldIndex: number }
) {
  const [currentPage] = useAtom(CurrentPageAtom)

  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct, setFocusProduct] = useAtom(FocusProductAtom)
  const [focusField, setFocusField] = useAtom(FocusFieldAtom)

  const product = pagesData[getComputedPage(currentPage, false)][focusProduct]

  return (
    <div
      className="h-fit w-full flex flex-row justify-start items-start
        gap-3 mb-4">
      <p className="h-fit w-fit px-4 py-2 bg-[#292929]
          rounded-md text-[#4E4E4E] whitespace-nowrap cursor-default">{keyName.length > 32 ? keyName.slice(0, 32) + '...' : keyName}</p>
      <input
        onClick={() => {
          setFocusField(fieldIndex)
        }}
        type="text"
        className={`h-fit w-full px-4 py-2 bg-[#292929] placeholder:text-[#4E4E4E]
          rounded-md text-white font-light border-none outline-none ${focusField === fieldIndex
            ? 'outline-3 outline outline-[#0056ff] outline-offset-2'
            : ''
          }
          transition-all ease-in-out duration-[0.12s]`}
        placeholder={'not set'}
        value={
          product[keyName as keyof typeof product] === 'not set'
            ? ''
            : product[keyName as keyof typeof product]
        }
        onChange={(e) => {
          const value = e.target.value as string

          const pages = [...pagesData]
          const changableProduct: any = pages[getComputedPage(currentPage, false)][focusProduct]

          changableProduct[keyName as keyof typeof changableProduct] = value
          setPagesData(pages)
        }}
      />
      <button
        onClick={() => {
          removeField(
            setPagesData,
            pagesData,
            getComputedPage(currentPage, false),
            focusProduct,
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