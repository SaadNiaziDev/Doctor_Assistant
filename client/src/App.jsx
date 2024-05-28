import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import { useEffect, useState } from 'react'
import { shallow } from 'zustand/shallow'
import { Intake } from './components/IntakeForm'
import Recording from './components/Recording'
import { Login, Signup } from './components/Auth'
import { Sidebar } from './components/Layout'
import { useLumedStore } from './store/lumedStore'

function App() {
  const user = useLumedStore( ( state ) => state.user );
  const [ getContext ] = useLumedStore( ( state ) => [ state.context ], shallow );
  const [ loading, setLoading ] = useState( true )
  const [ progress, setProgress ] = useState( 'start' )

  useEffect( () => {

    ( async () => {
      setLoading( true );
      await getContext();
      setLoading( false );
    } )();
  }, [] )

  return (
    <>
      {!loading && <Routes>
        <Route path='/intake/:patientId' element={<Intake />} />
        <Route path='/recording/:patientId' element={<Recording />} />
        {user && <>
          {/* <Route path='/home/:patientId' element={<Home />} /> */}
          <Route path='/' element={<Sidebar progress={progress} setProgress={setProgress} />}>
            <Route path='/' element={<Dashboard progress={progress} setProgress={setProgress} />} />
          </Route>
          <Route path='*' element={<Navigate to='/' />} />
        </>}
        {!user && <>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </>}
      </Routes>}

    </>
  )
}

export default App
