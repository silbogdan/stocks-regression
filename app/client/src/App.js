import MainScreen from './screens/MainScreen';
import StockScreen from './screens/StockScreen';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<MainScreen />} />
      <Route path="stock" element={<StockScreen />} />
    </Routes>
  );
}

export default App;
