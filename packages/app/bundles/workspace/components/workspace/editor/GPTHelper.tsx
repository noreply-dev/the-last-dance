import { createPortal } from 'react-dom'
import { useAtom } from 'jotai'
import { GPTHelperAtom, ProductField } from './Products'
import { FocusProductAtom, ProductsAtom, removeField } from '../../../context/ProductsContext'
import { CurrentPageAtom, getComputedPage } from '../../../context/WorkspaceContext'
import Image from 'next/image'
import { useRouter } from 'next/router'

// assets
import chatgpt from '../../../resources/chatgpt.png'
import { useState } from 'react'

export function GPTHelper() {
  const [GPTHelperVisible, setGPTHelperVisible] = useAtom(GPTHelperAtom)

  return <>
    {
      GPTHelperVisible && createPortal(
        <GPTModal />,
        document.body
      )
    }
  </>
}

function GPTModal() {
  const router = useRouter()

  const [GPTHelperVisible, setGPTHelperVisible] = useAtom(GPTHelperAtom)
  const [productsData, setProductsData] = useAtom(ProductsAtom)
  const [currentPage] = useAtom(CurrentPageAtom)
  const [focusProduct] = useAtom(FocusProductAtom)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState('Fill page')

  async function generateChatGPTPrediction() {
    const firstProduct = productsData[getComputedPage(currentPage, false)][focusProduct]

    if (!Object.keys(firstProduct).length) {
      setError(true)
      return
    }

    setLoading('...')

    const { file } = router.query
    const pdfPath = typeof file === 'string' ? file : file[file.length - 1]
    const pdfName = pdfPath.split('/')[pdfPath.split('/').length - 1]

    const requestJSON = {
      pdfName: pdfName,
      pdfPath: pdfPath,
      targetPage: getComputedPage(currentPage, false),
      firstProduct: firstProduct
    }

    const gptResponse = await fetch('http://51.75.204.30:4545/upload', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(requestJSON),
    })
      .then(res => res.json())
      .then(data => data)

    if (gptResponse.data[Object.keys(gptResponse.data)[0]]) {
      const products = gptResponse.data[Object.keys(gptResponse.data)[0]]

      const pageData = [...productsData]
      products.forEach((product, index) => {
        pageData[getComputedPage(currentPage, false)][index] = product
      })
      setProductsData(pageData)

      setGPTHelperVisible(false)
    }

    setLoading('Sorry, try again')

  }

  return (
    <div
      className='absolute top-0 left-0 h-screen w-screen bg-[#0a0a0a9f] z-9999
        grid place-items-center'
      onClick={() => setGPTHelperVisible(false)}>
      <div
        className='w-fit h-fit overflow-hidden flex flex-col 
          justify-center items-center rounded-3xl 
          bg-[#0f0f0f] border border-solid border-[#323232] px-9 py-6'
        onClick={((e) => e.stopPropagation())}
      >
        <Image src={chatgpt} alt='Chat gpt logo' height={70} width={70}
          className='rounded-[50px] mb-5' />
        <p className='text-[#74aa9d] text-lg mb-2'>chatGPT help</p>
        <p className='text-[#696969] text-base mb-5 text-center
          transition-all ease-in-out duration-[0.08s]'><span className={`${error ? 'text-red-500' : ''}`}>Fill the first product</span> of <br /> your page, then leave chatGPT  <br />  complete your page.</p>
        <button
          onClick={generateChatGPTPrediction}
          className='grid place-items-center w-full h-fit 
          bg-[#74aa9d] mb-2 px-3 py-2 rounded-md border-none outline-none active:outline-3 active:outline 
          active:outline-[#74aa9d] active:outline-offset-2 duration-[0.12s]
            active:scale-[0.94] focus:outline-[#74aa9d] focus:outline-offset-2'
        >{loading}</button>
      </div>
    </div>

  )
}