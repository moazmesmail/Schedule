import { createContext, useState } from "react";


const Context = createContext()

const Provider = ({ children }) => {
    const [data, setData] = useState(null);
    const values = { data, setData };
    return (
        <Context.Provider value={values}>
            {children}
        </Context.Provider>
    );
};

export { Context };
export default Provider;

