import React from 'react'

interface Params {
    slug?:string[]|undefined
}

const page = async ({params}:{params:Params}) => {
    const {slug} = await params;
    console.log(slug)


    return (
    <div>

<h1>My routes are</h1>

{
    slug?.map((elem:string)=>(
        <h4>{elem}</h4>
    ))
}
    </div>
  )
}

export default page