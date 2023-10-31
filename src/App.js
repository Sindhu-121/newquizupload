import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Testyear from './components/Testyear'
import Images from './components/Images';
import Uploadformet from './components/Uploadformet';

function App() {
  return (
    <BrowserRouter>
   
     <Routes>
     <Route path='/' element={ <Uploadformet />}/>
     <Route path='/' element={<Testyear/>}/>
     <Route path='/quiz_all/:test_id' element={<Images/>} />
     </Routes>
    
    
    </BrowserRouter>
  );
}
export default App;
