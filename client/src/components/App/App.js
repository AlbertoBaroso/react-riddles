import AuthContext from '../../context/authContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from "react";
import './App.css';

import RiddleForm from '../RiddleForm/RiddleForm';
import RiddleList from '../RiddleList/RiddleList';
import LoginForm from '../LoginForm/LoginForm';
import TopThree from '../TopThree/TopThree';
import NotFound from '../NotFound/NotFound';
import Riddle from '../Riddle/Riddle';
import Main from './Main';

function App() {

    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <AuthContext.Provider value={loggedIn}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Main setLoggedIn={setLoggedIn} />} >
                        <Route path="" element={<RiddleList type="all" default/>} index  />
                        <Route path="mine" element={loggedIn ? <RiddleList type="mine"/> : <Navigate replace to="/"/>} />
                        <Route path="top3" element={<TopThree />} />
                        <Route path="new" element={loggedIn ? <RiddleForm /> : <Navigate replace to="/login"/>} />
                        <Route path="riddles/:riddleID" element={<Riddle />} />
                        <Route path="login" element={loggedIn ? <Navigate replace to="/mine"/> : <LoginForm setLoggedIn={setLoggedIn} />} />
                        <Route path='*' element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthContext.Provider>
    );
}

export default App;


/*
<AuthContext.Consumer>
    {(isLoggedIn) => {
        return (
            <div>
               {isLoggedIn ? <span>LOGGED IN</span> : <span>NOT LOGGED IN</span>}
            </div>
        );
    }}
</AuthContext.Consumer>
*/