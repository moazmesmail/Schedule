import { useContext, useState } from "react";
import { Context } from "../../contexts/Context/Context";

export default function Schedule() {
    const { data } = useContext(Context);

    const days = ["Sun", "Mon", "Tus", "Wed", "Thr"];
    const places = ["A1", "A2", "A3", "B1", "B2", "B3"];
    const totalSlots = 8;

    const downloadSchedule = () => {
        const textData = JSON.stringify(allocations, null, 2);
        const blob = new Blob([textData], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `schedule_${selectedDay}.txt`;
        a.click();

        URL.revokeObjectURL(url);
    };

    const [allocations, setAllocations] = useState(() => {
        const init = {};
        days.forEach((day) => {
            init[day] = {};
            places.forEach((p) => {
                init[day][p] = Array(totalSlots).fill("—");
            });
        });
        return init;
    });

    const [selectedDay, setSelectedDay] = useState("Mon");
    const [numPeriods, setNumPeriods] = useState(6);

    const longestStreak = (arr) => {
        if (!arr?.length) return 0;
        let max = 1,
            cur = 1;
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] === arr[i - 1] + 1) {
                cur++;
                max = Math.max(max, cur);
            } else cur = 1;
        }
        return max;
    };

    const autoAllocate = () => {
        if (!data?.length) return alert("No teacher data loaded!");
        if (numPeriods < 1 || numPeriods > totalSlots)
            return alert("Invalid number of periods.");

        const updated = structuredClone(allocations);
        const teacherAllocCount = {};

        // Deep clone teacher data so freeslots edits don’t affect global state
        const clonedTeachers = structuredClone(data);
        const dayIndex = days.indexOf(selectedDay);

        const mondayTeachers = clonedTeachers
            .filter((t) => t.freeslots && t.freeslots[dayIndex]?.length)
            .sort(
                (a, b) =>
                    longestStreak(
                        [...b.freeslots[dayIndex]].sort((x, y) => x - y)
                    ) -
                    longestStreak(
                        [...a.freeslots[dayIndex]].sort((x, y) => x - y)
                    )
            );

        mondayTeachers.forEach((t) => (teacherAllocCount[t.teacher] = 0));

        // Use dynamic number of periods
        for (let period = 1; period <= numPeriods; period++) {
            for (const place of places) {
                // 1️⃣ Try: available + prefers place
                let teacher =
                    mondayTeachers.find(
                        (t) =>
                            t.freeslots[dayIndex].includes(period) &&
                            teacherAllocCount[t.teacher] < 3 &&
                            t.places?.includes(place)
                    ) ||
                    // 2️⃣ Fallback: available (ignore place)
                    mondayTeachers.find(
                        (t) =>
                            t.freeslots[1].includes(period) &&
                            teacherAllocCount[t.teacher] < 3
                    );

                if (!teacher) {
                    updated[selectedDay][place][period - 1] = "—";
                    continue;
                }

                updated[selectedDay][place][period - 1] = teacher.teacher;
                teacherAllocCount[teacher.teacher]++;
                teacher.freeslots[dayIndex] = teacher.freeslots[
                    dayIndex
                ].filter((x) => x !== period);
            }
        }

        setAllocations(updated);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Schedule Allocation</h2>

            <div className="card p-3 mb-4 shadow-sm">
                <div className="row g-3 align-items-end">
                    <div className="col-md-2">
                        <label className="form-label fw-bold">Day</label>
                        <select
                            className="form-select"
                            value={selectedDay}
                            onChange={(e) => setSelectedDay(e.target.value)}
                        >
                            {days.map((d) => (
                                <option key={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label fw-bold">
                            # of Periods
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            max={totalSlots}
                            value={numPeriods}
                            onChange={(e) =>
                                setNumPeriods(Number(e.target.value))
                            }
                        />
                    </div>

                    <div className="col-md-3">
                        <button
                            onClick={autoAllocate}
                            className="btn btn-primary w-100"
                        >
                            Auto Allocate
                        </button>
                    </div>
                    <div className="col-md-3">
                        <button
                            onClick={downloadSchedule}
                            className="btn btn-success w-100"
                        >
                            Download Schedule
                        </button>
                    </div>
                </div>
            </div>

            <h4 className="mb-3 text-center">
                Day: <span className="text-primary">{selectedDay}</span>
            </h4>

            <div className="table-responsive">
                <table className="table table-bordered text-center align-middle">
                    <thead className="table-secondary">
                        <tr>
                            <th>Place</th>
                            {Array.from({ length: totalSlots }, (_, i) => (
                                <th key={i}>Slot {i + 1}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {places.map((p) => (
                            <tr key={p}>
                                <td className="fw-bold">{p}</td>
                                {Array.from({ length: totalSlots }, (_, i) => (
                                    <td key={i}>
                                        {allocations[selectedDay][p][i]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
