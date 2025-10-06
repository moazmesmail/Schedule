import { useContext, useState } from "react";
import { Context } from "../../contexts/Context/Context";

export default function Slots() {
    const { data } = useContext(Context);
    const [day, setDay] = useState(0);
    const [slot, setSlot] = useState(1);

    if (!data || !data.length) return <p>No data available</p>;

    // Filter + sort teachers alphabetically
    const freeTeachers = data
        .filter((teacher) => teacher.freeslots?.[day]?.includes(slot))
        .sort((a, b) => a.teacher.localeCompare(b.teacher));

    return (
        <div className="container text-center mt-4">
            <h1 className="mb-4 fw-bold display-5">Free Teachers</h1>

            <div className="d-flex justify-content-center align-items-center gap-3 mb-5">
                <select
                    className="form-select w-auto fs-5"
                    value={day}
                    onChange={(e) => setDay(Number(e.target.value))}
                >
                    {["Sun", "Mon", "Tue", "Wed", "Thu"].map((d, i) => (
                        <option key={d} value={i}>
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

            {freeTeachers.length ? (
                <div className="row justify-content-center">
                    {freeTeachers.map((t ) => (
                        <div key={t.teacher} className="col-auto mb-3">
                            <h2 className="fw-bold text-primary display-4">
                                <span key={t.teacher}>
                                    {t.teacher}
                                </span>
                            </h2>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="fs-3 text-muted">
                    No teachers free at this slot.
                </p>
            )}
        </div>
    );
}
