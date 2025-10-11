import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../contexts/Context/Context";

export default function Teacher() {
    const { id } = useParams();
    const teacherIndex = Number(id);
    const { data, setData } = useContext(Context);
    const navigate = useNavigate();
    const [displayDays, setDisplayDays] = useState(true);

    const days = ["sun", "mon", "tus", "wed", "thr"];
    const totalSlots = 8;
    const allPlaces = [1, 2, 3, 4, 5, 6, 7];

    if (!data || !data.length) return <p>No data loaded yet.</p>;
    const teacher = data[teacherIndex];
    if (!teacher) return <p>Teacher not found.</p>;

    const absentDays = Object.entries(teacher.days || {})
        .filter(([_, d]) => !d.exists)
        .map(([dayName]) => dayName);

    // --- Toggle day existence ---
    const toggleDay = (dayKey) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };

        // Initialize days object if it doesn't exist
        if (!t.days) {
            t.days = {};
        }

        const dayData = {
            free_slots: [],
            places: [],
            exists: true,
            ...(t.days[dayKey] || {}),
        };

        dayData.exists = !dayData.exists;

        t.days = { ...t.days, [dayKey]: dayData };
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    // --- Toggle slot ---
    const toggleSlot = (dayKey, slotNum) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };

        // Initialize days object if it doesn't exist
        if (!t.days) {
            t.days = {};
        }

        const dayData = {
            free_slots: [],
            places: [],
            exists: true,
            ...(t.days[dayKey] || {}),
        };

        // Ensure free_slots is an array of numbers
        const slotSet = new Set(
            (dayData.free_slots || []).map((s) => Number(s))
        );

        const slotNumber = Number(slotNum);
        if (slotSet.has(slotNumber)) {
            slotSet.delete(slotNumber);
        } else {
            slotSet.add(slotNumber);
        }

        dayData.free_slots = Array.from(slotSet).sort((a, b) => a - b);

        t.days = { ...t.days, [dayKey]: dayData };
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    // --- Toggle place ---
    const togglePlace = (dayKey, placeCode) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };

        // Initialize days object if it doesn't exist
        if (!t.days) {
            t.days = {};
        }

        const dayData = {
            free_slots: [],
            places: [],
            exists: true,
            ...(t.days[dayKey] || {}),
        };

        // Ensure places is an array of numbers
        const placeSet = new Set((dayData.places || []).map((p) => Number(p)));

        const placeNumber = Number(placeCode);
        if (placeSet.has(placeNumber)) {
            placeSet.delete(placeNumber);
        } else {
            placeSet.add(placeNumber);
        }

        dayData.places = Array.from(placeSet).sort((a, b) => a - b);

        t.days = { ...t.days, [dayKey]: dayData };
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    // --- Navigation ---
    const nextTeacher = () =>
        navigate(`/teacher/${(teacherIndex + 1) % data.length}`);
    const prevTeacher = () =>
        navigate(`/teacher/${(teacherIndex - 1 + data.length) % data.length}`);

    return (
        <div className="container mt-4 text-center">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <button
                    onClick={prevTeacher}
                    className="btn btn-outline-primary"
                >
                    ⬅ Prev
                </button>
                <h1 className="mb-0">{teacher.teacher}</h1>
                <button
                    onClick={nextTeacher}
                    className="btn btn-outline-primary"
                >
                    Next ➡
                </button>
            </div>

            {/* Toggle Days */}
            <h4
                className="mb-3"
                style={{ cursor: "pointer" }}
                onClick={() => setDisplayDays(!displayDays)}
            >
                Days
            </h4>
            {displayDays && (
                <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                    {days.map((day) => {
                        const isAbsent = absentDays.includes(day);
                        return (
                            <div
                                key={day}
                                onClick={() => toggleDay(day)}
                                className={`p-3 rounded text-white fw-bold ${
                                    isAbsent ? "bg-danger" : "bg-success"
                                }`}
                                style={{
                                    width: "100px",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    textTransform: "uppercase",
                                }}
                            >
                                {day}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Each Day Section — EXCLUDE absent days */}
            {days.map((dayKey) => {
                const dayData = teacher.days?.[dayKey] || {
                    free_slots: [],
                    places: [],
                    exists: true,
                };
                if (!dayData.exists) return null;

                const freeSlots = new Set(
                    (dayData.free_slots || []).map((s) => Number(s))
                );
                const dayPlaces = new Set(
                    (dayData.places || []).map((p) => Number(p))
                );

                return (
                    <div key={dayKey} className="mb-5">
                        <h4 className="mb-3 text-success">
                            {dayKey.toUpperCase()}
                        </h4>

                        {/* Free Slots Table */}
                        <div className="table-responsive mb-3">
                            <table className="table table-bordered text-center align-middle">
                                <thead className="table-secondary">
                                    <tr>
                                        {Array.from(
                                            { length: totalSlots },
                                            (_, i) => (
                                                <th key={i}>Slot {i + 1}</th>
                                            )
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {Array.from(
                                            { length: totalSlots },
                                            (_, i) => {
                                                const slotNum = i + 1;
                                                const isFree =
                                                    freeSlots.has(slotNum);
                                                return (
                                                    <td
                                                        key={i}
                                                        onClick={() =>
                                                            toggleSlot(
                                                                dayKey,
                                                                slotNum
                                                            )
                                                        }
                                                        style={{
                                                            cursor: "pointer",
                                                            backgroundColor:
                                                                isFree
                                                                    ? "green"
                                                                    : "transparent",
                                                            color: isFree
                                                                ? "white"
                                                                : "black",
                                                            transition: "0.2s",
                                                        }}
                                                    >
                                                        {isFree ? "Free" : ""}
                                                    </td>
                                                );
                                            }
                                        )}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Places Table */}
                        <div className="table-responsive">
                            <table className="table table-bordered text-center align-middle">
                                <thead className="table-secondary">
                                    <tr>
                                        {allPlaces.map((place) => (
                                            <th key={place}>Place {place}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        {allPlaces.map((place) => {
                                            const hasPlace =
                                                dayPlaces.has(place);
                                            return (
                                                <td
                                                    key={place}
                                                    onClick={() =>
                                                        togglePlace(
                                                            dayKey,
                                                            place
                                                        )
                                                    }
                                                    style={{
                                                        cursor: "pointer",
                                                        backgroundColor:
                                                            hasPlace
                                                                ? "blue"
                                                                : "transparent",
                                                        color: hasPlace
                                                            ? "white"
                                                            : "black",
                                                        transition: "0.2s",
                                                    }}
                                                >
                                                    {hasPlace ? "✔" : ""}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
