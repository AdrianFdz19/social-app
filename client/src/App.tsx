import { Routes, Route } from 'react-router-dom'
import './App.css'
import Test from './pages/Test'

function App() {

  return (
    <div className="app">
      <Routes>
        <Route path='/' element={<h2>Home</h2>} ></Route>
        <Route path='/test' element={<Test />} ></Route>
      </Routes>
    </div>
  )
}

export default App
