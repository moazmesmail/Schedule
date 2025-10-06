import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../contexts/Context/Context";

export default function Teacher() {
    const { id } = useParams();
    const teacherIndex = Number(id);
    const { data, setData } = useContext(Context);
    const navigate = useNavigate();

    const days = ["Sun", "Mon", "Tus", "Wed", "Thr"];
    const totalSlots = 8;

    if (!data || !data.length) return <p>No data loaded yet.</p>;

    const teacher = data[teacherIndex];
    if (!teacher) return <p>Teacher not found.</p>;

    // --- Ensure freeslots array always has 5 days ---
    const ensureDataConsistency = () => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };

        if (!Array.isArray(t.freeslots) || t.freeslots.length < 5) {
            t.freeslots = Array.from(
                { length: 5 },
                (_, i) => t.freeslots?.[i] || []
            );
            updatedData[teacherIndex] = t;
            setData(updatedData);
        }
    };
    ensureDataConsistency();

    const absentDays = new Set(teacher.days || []);
    const allPlaces = teacher.places || [];
    // --- Toggle place ---
    const togglePlace = (placeCode) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };
        const placeSet = new Set(t.places || []);

        if (placeSet.has(placeCode)) placeSet.delete(placeCode);
        else placeSet.add(placeCode);

        t.places = Array.from(placeSet).sort();
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    const togglePlaces = (places) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };

        // if places 

        t.places = places;
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };
    // --- Toggle absent day ---
    const toggleDay = (dayNumber) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };
        const daysSet = new Set(t.days || []);

        if (daysSet.has(dayNumber)) daysSet.delete(dayNumber);
        else daysSet.add(dayNumber);

        t.days = Array.from(daysSet).sort((a, b) => a - b);
        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    // --- Toggle free slot ---
    const toggleSlot = (dayIndex, slotNum) => {
        const updatedData = [...data];
        const t = { ...updatedData[teacherIndex] };
        const freeslots = [...(t.freeslots || [])];

        if (!Array.isArray(freeslots[dayIndex])) freeslots[dayIndex] = [];

        const slotSet = new Set(freeslots[dayIndex]);
        if (slotSet.has(slotNum)) slotSet.delete(slotNum);
        else slotSet.add(slotNum);

        freeslots[dayIndex] = Array.from(slotSet).sort((a, b) => a - b);
        t.freeslots = freeslots;

        updatedData[teacherIndex] = t;
        setData(updatedData);
    };

    // --- Navigation Handlers ---
    const nextTeacher = () => {
        const nextIndex = (teacherIndex + 1) % data.length;
        navigate(`/teacher/${nextIndex}`);
    };

    const prevTeacher = () => {
        const prevIndex = (teacherIndex - 1 + data.length) % data.length;
        navigate(`/teacher/${prevIndex}`);
    };

    return (
        <div className="container mt-4 text-center">
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

            {/* Absent Day Toggle */}
            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                {days.map((day, index) => {
                    const dayNum = index + 1;
                    const isAbsent = absentDays.has(dayNum);
                    return (
                        <div
                            key={index}
                            onClick={() => toggleDay(dayNum)}
                            className={`p-3 rounded text-white fw-bold ${
                                isAbsent ? "bg-danger" : "bg-secondary"
                            }`}
                            style={{
                                width: "100px",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            {/* Places Toggle */}
            <h4 className="mb-3">Preferred Places</h4>

            <div className="d-flex justify-content-center gap-3 flex-wrap mb-3">
                {/* Building A Button */}
                <div
                    key="A"
                    onClick={() => {
                        togglePlaces([1,2,3]);
                    }}
                    className="p-3 rounded text-white fw-bold bg-primary"
                    style={{
                        width: "120px",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    Building A
                </div>

                {/* Building B Button */}
                <div
                    key="B"
                    onClick={() => {
                        togglePlaces([4,5,6,7]);

                    }}
                    className="p-3 rounded text-white fw-bold bg-primary"
                    style={{
                        width: "120px",
                        cursor: "pointer",
                        userSelect: "none",
                    }}
                >
                    Building B
                </div>
            </div>
            <div className="d-flex justify-content-center gap-3 flex-wrap mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((place) => {
                    const hasPlace = (teacher.places || []).includes(place);
                    return (
                        <div
                            key={place}
                            onClick={() => togglePlace(place)}
                            className={`p-3 rounded text-white fw-bold ${
                                hasPlace ? "bg-success" : "bg-secondary"
                            }`}
                            style={{
                                width: "100px",
                                cursor: "pointer",
                                userSelect: "none",
                            }}
                        >
                            {place}
                        </div>
                    );
                })}
            </div>

            {/* Schedule Slots */}
            <h4 className="mb-3">Weekly Schedule</h4>
            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-secondary">
                        <tr>
                            <th>Day</th>
                            {Array.from({ length: totalSlots }, (_, i) => (
                                <th key={i}>Slot {i + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map((day, dayIndex) => {
                            const dayNum = dayIndex + 1;
                            const isAbsent = absentDays.has(dayNum);
                            const freeSlots = new Set(
                                teacher.freeslots?.[dayIndex] || []
                            );

                            return (
                                <tr key={dayIndex}>
                                    <td
                                        className={
                                            isAbsent
                                                ? "bg-danger text-white"
                                                : ""
                                        }
                                    >
                                        {day}
                                    </td>
                                    {Array.from(
                                        { length: totalSlots },
                                        (_, slotIndex) => {
                                            const slotNum = slotIndex + 1;
                                            const isFree =
                                                freeSlots.has(slotNum);

                                            return (
                                                <td
                                                    key={slotIndex}
                                                    onClick={() =>
                                                        !isAbsent &&
                                                        toggleSlot(
                                                            dayIndex,
                                                            slotNum
                                                        )
                                                    }
                                                    style={{
                                                        cursor: isAbsent
                                                            ? "not-allowed"
                                                            : "pointer",
                                                        backgroundColor: isFree
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
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
