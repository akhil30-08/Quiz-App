import { Route, Routes } from 'react-router-dom';
import './index.css';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import Results from './pages/Results';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />}></Route>
        <Route path='/take-quiz' element={<QuizPage />}></Route>
        <Route path='/results' element={<Results />}></Route>
      </Routes>
    </>
  );
}

export default App;
