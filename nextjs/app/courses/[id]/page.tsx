import Link from 'next/link'
import React from 'react'

type Params  = Promise<{id:string}>
const page = async ({params}:{params:Params}) => {

  return (
    <div>I am parent parent page.. and my child is {(await params).id}.
  <Link href={"/"}>Go to home!</Link>
    </div>
  )
}

export default page