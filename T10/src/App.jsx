import './App.css';
import { CitiesProvider } from './contexts/CitiesContext';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Detail from './pages/Detail';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 
import Layout from './components/Layout';

const App = () => {
    return <CitiesProvider>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Layout/>}>
                    <Route index element={<Home/>}/>
                    <Route path=':cityId' element={<Detail/>}></Route>
                    <Route path='*' element={<NotFound/>}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    </CitiesProvider>;
};

export default App;