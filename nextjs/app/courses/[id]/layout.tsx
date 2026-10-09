import React from 'react'

const CourseLayout = ({children}:{children:React.FC}) => {
  return (
    <>
        <div className='bg-orange-400 w-screen h-20 flex p-4 mt-10 items-center ' >
            <h1 className='text-4xl ' >
                Courses
            </h1>
        </div>
        {children}
    </>

  )
}

export default CourseLayout
