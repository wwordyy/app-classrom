import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {Register} from './components/auth/register'
import { Login } from './components/auth/login'
import { Dashboard } from './components/observer/dashboard'

function App() {

  return (
    <div>
        <BrowserRouter>
          <Routes>

            <Route path='/register' element={<Register/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/observer/main' element= {<Dashboard/>}/>


          </Routes>
        
        </BrowserRouter>
    </div>
  )
}

export default App
