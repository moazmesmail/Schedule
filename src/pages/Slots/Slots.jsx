import { useContext, useState } from "react";
import { Context } from "../../contexts/Context/Context";
import { Link } from "react-router-dom";

export default function Slots() {
    const { data } = useContext(Context);
    const [day, setDay] = useState("sun");
    const [slot, setSlot] = useState(1);

    if (!data || !data.length) return <p>No data available</p>;

    // Filter + sort teachers alphabetically
    const freeTeachers = data
        .filter(
            (teacher) =>
                teacher.days?.[day]?.exists &&
                teacher.days[day].free_slots?.includes(slot)
        )
        .sort((a, b) => {
            const aCount = a.days?.[day]?.free_slots?.length || 0;
            const bCount = b.days?.[day]?.free_slots?.length || 0;

            // Sort by free count descending, then name ascending
            if (bCount !== aCount) return bCount - aCount;
            return a.teacher.localeCompare(b.teacher);
        });

    return (
        <div className="container text-center mt-4">
            <h1 className="mb-4 fw-bold display-5">Free Teachers</h1>

            <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
                <select
                    className="form-select w-auto fs-5"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                >
                    {["sun", "mon", "tus", "wed", "thr"].map((d, i) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                <select
                    className="form-select w-auto fs-5"
                    value={slot}
                    onChange={(e) => setSlot(Number(e.target.value))}
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <option key={s} value={s}>
                            Slot {s}
                        </option>
                    ))}
                </select>
            </div>
            <h2>
                Free Teachers: {freeTeachers.length}
            </h2>
            {freeTeachers.length ? (
                <div className="row justify-content-center">
                    <table className="table table-striped table-bordered table-hover align-middle text-center">
                        <thead>
                            <tr>
                                <th>Teacher</th>
                                <th>Free Slots Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {freeTeachers.map((t, _) => {
                                const freeCount =
                                    t.days?.[day]?.free_slots?.length || 0;
                                const teacherIndex = data.findIndex(
                                    (x) => x.teacher === t.teacher
                                );
                                return (
                                    <tr key={teacherIndex}>
                                        <td className="fw-bold text-primary">
                                            <Link
                                                to={`/teacher/${teacherIndex}`}
                                                className="text-decoration-none"
                                            >
                                                {t.teacher}
                                            </Link>
                                        </td>
                                        <td className="fw-semibold">
                                            {freeCount}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="fs-3 text-muted">
                    No teachers free at this slot.
                </p>
            )}
        </div>
    );
}
