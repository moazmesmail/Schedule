import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Provider from "./contexts/Context/Context.jsx";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home.jsx";
import Schedule from "./pages/Schedule/Schedule.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import Teacher from "./pages/Teacher/Teacher.jsx";

function App() {

    return (
        <>
            <Provider>
                <Nav/>
                <Home />
                <Schedule />
                <Teachers />
                <Teacher />
            </Provider>
        </>
    );
}

export default App;
