import { useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { Context } from "../../contexts/Context/Context";
import React from "react";


export default function Teacher() {
    const { id } = useParams();
    const teacherIndex = Number(id);
    const { data, setData } = useContext(Context);
    const navigate = useNavigate();
    const [displayDays, setDisplayDays] = useState(true);
    const [displayPlaces , setDisplayPlaces] = useState(true)

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
            <button
                className="btn btn-outline-primary mb-4 "
                onClick={() => setDisplayPlaces(!displayPlaces)}
            >
                {displayPlaces ? "Hide Places row" : "Show Places row"}
            </button>

            <div className="days_table">
                <table className="table table-striped table-bordered table-hover align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th>Day</th>
                            {[...Array(totalSlots)].map((_, i) => (
                                <th key={i + 1}> {i + 1} </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(teacher.days)
                            .filter(([_, dayData]) => dayData.exists)
                            .map(([dayKey, dayData]) => (
                                <React.Fragment key={dayKey}>
                                    {/* Day row */}
                                    <tr>
                                        <td className="fw-bold text-capitalize">
                                            {dayKey}
                                        </td>
                                        {[...Array(totalSlots)].map((_, i) => {
                                            const slotNum = i + 1;
                                            const isFree =
                                                dayData.free_slots?.includes(
                                                    slotNum
                                                );

                                            return (
                                                <td
                                                    key={slotNum}
                                                    onClick={() =>
                                                        toggleSlot(
                                                            dayKey,
                                                            slotNum
                                                        )
                                                    }
                                                    className={`cursor-pointer ${
                                                        isFree
                                                            ? "bg-success"
                                                            : "table-danger"
                                                    }`}
                                                    style={{
                                                        userSelect: "none",
                                                    }}
                                                >
                                                    {slotNum}
                                                </td>
                                            );
                                        })}
                                    </tr>

                                    {/* Places row */}
                                    {displayPlaces && (
                                        <tr>
                                            <td className="text-muted">
                                                Places
                                            </td>
                                            {[...Array(totalSlots)].map(
                                                (_, i) => {
                                                    const slotNum = i + 1;
                                                    const isPlaceEnabled =
                                                        dayData.places?.includes(
                                                            slotNum
                                                        );

                                                    return (
                                                        <td
                                                            key={slotNum}
                                                            className={`cursor-pointer ${
                                                                isPlaceEnabled
                                                                    ? "bg-primary text-white"
                                                                    : "table-light"
                                                            }`}
                                                            onClick={() =>
                                                                togglePlace(
                                                                    dayKey,
                                                                    slotNum
                                                                )
                                                            }
                                                            style={{
                                                                userSelect:
                                                                    "none",
                                                            }}
                                                        >
                                                            P{slotNum}
                                                        </td>
                                                    );
                                                }
                                            )}
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
