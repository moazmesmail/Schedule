import { createContext, useState } from "react";


const Context = createContext()

const Provider = ({ children }) => {
    const [data, setData] = useState([
        {
            teacher: "",
            places: [1,2,3,4, 5, 6, 7],
            nonExistDays: [1,2,3,4,5],
            freeslots: [[], [], [], [], []],
        },
    ]);
    const values = { data, setData };
    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    );
};

export { Context };
export default Provider;

