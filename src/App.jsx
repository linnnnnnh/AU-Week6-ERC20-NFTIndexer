import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Indexers from './Indexers';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Indexers />} />
      </Routes>
    </Router>
  )
}

export default App;
