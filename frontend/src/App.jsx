import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/section/Header'
import Hero from './components/section/Hero'
import PredictPage from './components/section/PredictPage';

function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/" element={<Hero/>} />
        <Route path="/predict" element={<PredictPage/>} />
      </Routes>
    </Router>
  )
}

export default App
