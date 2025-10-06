import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Provider from "./contexts/Context/Context.jsx";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home.jsx";
import Schedule from "./pages/Schedule/Schedule.jsx";
import Slots from "./pages/Slots/Slots.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import Teacher from "./pages/Teacher/Teacher.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

    return (
        <>
            <Provider>
                <Router>
                    <Nav />
                    <div className="container-xl mt-4">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/slots" element={<Slots />} />
                            <Route path="/teachers" element={<Teachers />} />
                            <Route path="/teacher/:id" element={<Teacher />} />
                        </Routes>
                    </div>
                </Router>
            </Provider>
        </>
    );
}

export default App;
