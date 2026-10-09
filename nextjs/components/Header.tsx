import React from 'react'

const Header = () => {
    const links = [
        {
            name:"Home"
        },
        {
            name:"About"
        },
        {
            name:"Contact"
        },
        {
            name:"Courses",
        }
    ]
  return (
    <div>
        <nav className='w-screen h-18 bg-amber-100  flex gap-18 text-black justify-center items-center' >

            {
                links.map((elem,indx)=>(
                    <div className=''  key={indx+1} >
                        <h1 className='cursor-pointer' >{elem.name}</h1>

                    </div>
                ))
            }


        </nav>
    </div>
    
  )
}

export default Header