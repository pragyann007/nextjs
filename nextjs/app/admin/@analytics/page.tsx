import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='w-50 h-50 bg-amber-300' >I am analytics page
    
    <Link href={"/admin/sales"}>Go to sales page</Link>

    </div>
  )
}

export default page