import { useContext } from "react";
import { Context } from "../../contexts/Context/Context";
import { Link } from "react-router-dom";

export default function Teachers() {
    const { data, setData } = useContext(Context);
    const days = ["Sun", "Mon", "Tus", "Wed", "Thr"];

    if (!data || !data.length)
        return (
            <p className="text-center text-muted mt-3">
                No teacher data available.
            </p>
        );

    // Delete teacher handler
    const deleteTeacher = (index) => {
        const updated = data.filter((_, i) => i !== index);
        setData(updated);
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Teachers Overview</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover align-middle">
                    <thead className="table-danger text-center">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Teacher</th>
                            <th scope="col">Places</th>
                            <th scope="col">Absent Days</th>
                            <th scope="col">Actions</th> {/* New column */}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((t, i) => {
                            const absentDays = t.days.length
                                ? t.days.map((d) => days[d - 1]).join(", ")
                                : "—";
                            return (
                                <tr key={i} className="text-center">
                                    <td>
                                        <Link to={`/teacher/${i}`}>
                                            {i + 1}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link
                                            to={`/teacher/${i}`}
                                            className="text-decoration-none fw-semibold text-primary"
                                        >
                                            {t.teacher}
                                        </Link>
                                    </td>
                                    <td>{t.places.join(", ")}</td>
                                    <td>{absentDays}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => deleteTeacher(i)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
