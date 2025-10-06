import { useContext } from "react";
import { Context } from "../../contexts/Context/Context";
import { Link } from "react-router-dom";

export default function Teachers() {
    const { data, setData } = useContext(Context);
    const days = ["Sun", "Mon", "Tus", "Wed", "Thr"];
    // If no data yet
    if (!data || !data.length)
        return (
            <p className="text-center text-muted mt-3">
                No teacher data available.
            </p>
        );

    // Build table
    return (
        <div className="container mt-4">
            <h3 className="mb-3 text-center">Teachers Overview</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover align-middle">
                    <thead className="table-danger">
                        <tr className="text-center">
                            <th scope="col">#</th>
                            <th scope="col">Teacher</th>
                            <th scope="col">Places</th>
                            <th scope="col">Absent Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((t, i) => {
                            // Convert day numbers to names
                            const absentDays = t.days.length
                                ? t.days.map((d) => days[d - 1]).join(", ")
                                : "—";
                            return (
                                <tr key={i}>
                                    <td>
                                        <Link
                                            to={`/teacher/${i}`}
                                            className="text-center"
                                        >
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
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
