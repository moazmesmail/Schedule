import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../contexts/Context/Context";

export default function Nav() {

    const { data } = useContext(Context);

    const handleSave = () => {
        if (!data) {
            alert("No data to save!");
            return;
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const now = new Date();
        const localTime = now.toLocaleString("sv-SE").replace(/[: ]/g, "-");
        const filename = `data_${localTime}.json`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid ">
                    <Link className="navbar-brand" to="/">
                        Schedule
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className="collapse navbar-collapse"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-5">
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/"
                                >
                                    Home
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/teachers"
                                >
                                    Teachers
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/schedule"
                                >
                                    Schedule
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/slots"
                                >
                                    Slots
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/subjects"
                                >
                                    Subjects
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className="nav-link active"
                                    aria-current="page"
                                    to="/classes"
                                >
                                    Classes
                                </Link>
                            </li>
                        </ul>
                        {/* 💾 Save button on right side */}
                        <button
                            className="btn btn-success ms-auto"
                            onClick={handleSave}
                            disabled={!data}
                        >
                            💾 Save
                        </button>
                        {/* <form className="d-flex" role="search">
                            <input
                                className="form-control me-2"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                            />
                            <button
                                className="btn btn-outline-success"
                                type="submit"
                            >
                                Search
                            </button>
                        </form> */}
                    </div>
                </div>
            </nav>
        </>
    );
}
