import React from 'react'

interface IProps {
    children:React.ReactNode,
    analytics:React.ReactNode,
    notifications:React.ReactNode
}
function DashboardLayout({children,analytics,notifications}:IProps) {
  return (
    <div>
        {analytics}
        {children}
        {notifications}
    </div>
  )
}

export default DashboardLayout