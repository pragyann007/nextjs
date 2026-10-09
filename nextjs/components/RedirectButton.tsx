
"use client"

import { useRouter } from "next/navigation"

const RedirectButton = ({route}:{route:string}) => {
    const router = useRouter();
    const handleRoute = (route:string)=>{
        router.push(`/${route}`)
    }
  return (
    <div>
          <button onClick={()=>handleRoute(route)} className='bg-white text-black p-3 rounded-2xl ' >Go to {route}</button>
    </div>
  )
}

export default RedirectButton