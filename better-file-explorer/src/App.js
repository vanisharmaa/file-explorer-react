import { useState } from 'react';
import './App.css';
import Header from './components/Header';


function App() {
  const [fileStructure, setFileStructure] = useState([]);
  const callSetFileStructure = (val) => {
    setFileStructure(val);
  }
  return (
    <div className="App">
      <Header fileStructure={fileStructure} setFileStructure={callSetFileStructure} />
    </div>
  );

}

export default App;
