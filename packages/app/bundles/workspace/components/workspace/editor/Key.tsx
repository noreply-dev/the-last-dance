export function Key({ chars, to }: { chars: string, to: string }) {
  return <div className="h-fit w-full flex flex-row justify-center items-center
    text-[#6F6F6F] font-thin">
    <p>press&nbsp;</p>
    <p
      className="bg-[#0056ff] px-2 rounded-[5px] text-white
        border-[1px] border-solid border-[#7ba5ff]"
    >{chars}</p>
    <p>&nbsp;to {to}</p>
  </div>
}