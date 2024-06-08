import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Stock from './Stock';
import StockDetail from './StockDetails';
import Header from './components/Header';

const App = () => {
  return (
    <>
    <Header/>
    <Router>
    <Routes>
      <Route path="/" element={<Stock />} />
      <Route path="/stock/:symbol" element={<StockDetail />} />
    </Routes>
  </Router>
  </>
  );
}

export default App;

