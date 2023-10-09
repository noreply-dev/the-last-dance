'use client'

import { CurrentPageAtom, getComputedPage } from '../../../context/WorkspaceContext'
import Image from 'next/image'
import { productsListAtom } from './Products'
import { FocusFieldAtom, FocusProductAtom, ProductsAtom, resetPage } from '../../../context/ProductsContext'
import { useAtom } from 'jotai'


// SOME REFACTOR HERE WILL BE GOOD BUT
// FOR THE MOMENT, "MEJOR HECHO QUE PERFECTO"

export function PageActions() {
  const [currentPage] = useAtom(CurrentPageAtom)

  const [pagesData, setPagesData] = useAtom(ProductsAtom)
  const [focusProduct] = useAtom(FocusProductAtom)
  const [, setFocusField] = useAtom(FocusFieldAtom)

  const [, setProductsListVisible] = useAtom(productsListAtom)

  const actions = [
    {
      text: 'Save page products',
      url: '/check.svg',
      action: () => { }
    },
    {
      text: 'AI page generation',
      url: '/bot.svg',
      action: () => { }
    }, {
      text: 'Show all page products',
      url: '/list.svg',
      action: () => {
        setProductsListVisible(true)
      }
    },
    {
      text: 'Reset page',
      url: '/reset.svg',
      action: () => {
        const page = getComputedPage(currentPage, false)
        resetPage(setPagesData, pagesData, page, focusProduct, setFocusField)
      }
    },
  ]

  return (
    <div
      className="h-fit w-full flex flex-col justify-start items-start">
      {
        actions.map((action) => {
          return <div
            key={action.text}
            onClick={action.action}
            className="h-fit w-full flex flex-row justify-start items-center bg-transparent
             hover:bg-[#D9D9D9] p-4 gap-3 rounded-md group transition-all ease-in-out 
             duration-[0.12s] cursor-pointer hover:scale-[1.03] active:scale-[0.98]">
            <div
              className={`h-fit w-fit grid place-items-center p-2 bg-[#1F1F1F] rounded-md
                transition-all ease-in-out delay-[0.02s] duration-[0.12s] group-hover:rotate-12
                group-hover:bg-[#BEBEBE]
              `}
            >
              <Image src={action.url} alt='list products icon' width={20} height={20} />
            </div>
            <p
              className='text-[#6f6f6f] group-hover:text-[#000000]
                transition-all ease-in-out duration-[0.12s]'
            >{action.text}</p>
          </div>
        })
      }
    </div>
  )
}