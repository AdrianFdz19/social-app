import { Routes, Route } from 'react-router-dom'
import './App.css'
import SignUp from './pages/auth/SignUp'
import SignIn from './pages/auth/SignIn'
import Home from './pages/Home'
import NestedRoute from './layouts/NestedRoute'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<NestedRoute />} >
          <Route path='/' element={<Home />} ></Route>
        </Route>
    
        <Route path='/sign-up' element={<SignUp />} ></Route>
        <Route path='/sign-in' element={<SignIn />} ></Route>
      </Routes>
    </div>
  )
}

export default App
