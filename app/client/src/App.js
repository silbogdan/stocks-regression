import MainScreen from './screens/MainScreen';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<MainScreen />} />
      <Route path="stock" />
    </Routes>
  );
}

export default App;
