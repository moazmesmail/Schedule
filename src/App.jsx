import { useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Provider, { Context } from "./contexts/Context/Context.jsx";
import Nav from "./components/Nav/Nav.jsx";
import Home from "./pages/Home/Home.jsx";
import Schedule from "./pages/Schedule/Schedule.jsx";
import Slots from "./pages/Slots/Slots.jsx";
import Teachers from "./pages/Teachers/Teachers.jsx";
import Teacher from "./pages/Teacher/Teacher.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useContext } from "react";
import SubjectsTable from "./pages/Subjects/subjects.jsx";
import ClassesTable from "./pages/Classes/Classes.jsx";

function AppContent() {
    const { data, setData } = useContext(Context);

    // 🧠 Load data from localStorage when the app starts
    useEffect(() => {
        const savedData = localStorage.getItem("appData");
        if (savedData) {
            setData(JSON.parse(savedData));
        }
    }, [setData]);

    // 💾 Save data automatically when it changes
    useEffect(() => {
        if (data) {
            console.log('save data')
            localStorage.setItem("appData", JSON.stringify(data));
        }
    }, [data]);

    return (
        <Router basename={import.meta.env.BASE_URL}>
            <Nav />
            <div className="container-xl mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/schedule" element={<Schedule />} />
                    <Route path="/slots" element={<Slots />} />
                    <Route path="/teachers" element={<Teachers />} />
                    <Route path="/teacher/:id" element={<Teacher />} />
                    <Route path="/subjects" element={<SubjectsTable />} />
                    <Route path="/classes" element={<ClassesTable />} />
                </Routes>
            </div>
        </Router>
    );
}

export default function App() {
    return (
        <Provider>
            <AppContent />
        </Provider>
    );
}
