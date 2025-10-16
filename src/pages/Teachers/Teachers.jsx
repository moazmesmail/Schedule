import { useContext } from "react";
import { Context } from "../../contexts/Context/Context";
import { Link, useNavigate } from "react-router-dom"; 

export default function Teachers() {
    const { data, setData } = useContext(Context);
    const days = ["Sun", "Mon", "Tus", "Wed", "Thr"];
    const navigate = useNavigate();

    if (!data || !data.teachers.length)
        return (
            <p className="text-center text-muted mt-3">
                No teacher data available.
            </p>
        );

    // Delete teacher handler
    const deleteTeacher = (index) => {
        if (!data?.teachers) return;
        const updatedTeachers = data.teachers.filter((_, i) => i !== index);
        setData({ ...data, teachers: updatedTeachers });
    };


    // Add new teacher handler
    const addTeacher = () => {
        const newTeacher = {
            teacher: "",
            religon: "",
            slots_per_week: 0,
            available_days: [],
            courses: [],
            classes: [],
            days: days.reduce(
                (acc, d) => ({
                    ...acc,
                    [d.toLowerCase()]: {
                        exists: true,
                        free_slots: [],
                        places: [],
                    },
                }),
                {}
            ),
        };

        const updatedTeachers = [...data.teachers, newTeacher];
        setData({ ...data, teachers: updatedTeachers });

        // navigate to the new teacher page
        navigate(`/teacher/${updatedTeachers.length - 1}`);
    };

    return (
        <div className="container mt-4">
            <div className="mb-3 text-center">
                <button
                    className="btn btn-outline-primary"
                    onClick={addTeacher}
                >
                    ➕ New Teacher
                </button>
            </div>
            <h3 className="mb-3 text-center">Teachers Overview</h3>
            <div className="table-responsive">
                <table className="table table-bordered table-striped table-hover align-middle">
                    <thead className="table-danger text-center">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Teacher</th>
                            <th scope="col">Absent Days</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data["teachers"].map((t, i) => {
                            const dayEntries = Object.entries(t.days || {});
                            const absentDays =
                                dayEntries
                                    .filter(([_, d]) => !d.exists)
                                    .map(([dayKey]) => {
                                        const dayIndex = parseInt(dayKey) - 1;
                                        return days[dayIndex] || `Day${dayKey}`;
                                    })
                                    .join(", ") || "—";

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
