import { createPortal } from 'react-dom'
import { useAtom } from 'jotai'
import { GPTHelperAtom, ProductField } from './Products'
import { ProductsAtom, removeField } from '../../../context/ProductsContext'
import { CurrentPageAtom, getComputedPage } from '../../../context/WorkspaceContext'
import Image from 'next/image'


// assets
import chatgpt from '../../../resources/chatgpt.png'

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
  const [GPTHelperVisible, setGPTHelperVisible] = useAtom(GPTHelperAtom)
  const [productsData] = useAtom(ProductsAtom)
  const [currentPage] = useAtom(CurrentPageAtom)

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
        <p className='text-[#696969] text-base mb-5 text-center'>Fill the first product of <br /> your page, then leave chatGPT  <br />  complete your page.</p>
        <button className='grid place-items-center w-full h-fit 
          bg-[#74aa9d] mb-2 px-3 py-2 rounded-md border-none outline-none active:outline-3 active:outline 
          active:outline-[#74aa9d] active:outline-offset-2 duration-[0.12s]
            active:scale-[0.94] focus:outline-[#74aa9d] focus:outline-offset-2'
        >Fill page</button>
      </div>
    </div>

  )
}