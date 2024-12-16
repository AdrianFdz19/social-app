import { Routes, Route } from 'react-router-dom'
import './App.css'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import NestedRoute from './layouts/NestedRoute'
import Profile from './pages/Profile/Profile'
import LayerWithHeader from './layouts/LayerWithHeader'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<NestedRoute />} >
          <Route element={<LayerWithHeader />} >
            <Route path='/' element={<Home />} ></Route>
            <Route path='/profile/:profileUserId' element={<Profile />} ></Route>
          </Route>
        </Route>
    
        <Route path='/sign-up' element={<SignUp />} ></Route>
        <Route path='/sign-in' element={<SignIn />} ></Route>
      </Routes>
    </div>
  )
}

export default App
