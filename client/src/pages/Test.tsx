
import { useAppContext } from '../contexts/AppProvider'

export default function Test() {

    const { apiUrl, appEnv } = useAppContext();
    console.log(apiUrl, appEnv)

  return (
    <div>
        <p>El ambiente es: {appEnv}</p>
        <p>El url del servidor es: {apiUrl}</p>
    </div>
  )
}
