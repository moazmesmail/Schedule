import { useContext, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Provider from "./contexts/Context/Context.jsx";
import  JsonUploader  from "./components/JsonUploader/JsonUploader";
function App() {

    return (
        <>
            <Provider>
                <JsonUploader />
            </Provider>
        </>
    );
}

export default App;
