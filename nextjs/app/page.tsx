
import RedirectButton from '@/components/RedirectButton';
import { routerServerGlobal } from 'next/dist/server/lib/router-utils/router-server-context';

const page = () => {

  return (
    <div>
      hi i am home page

      <div>
        <RedirectButton route='courses/123' />
      </div>
    
    </div>
  )
}

export default page