import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../contexts/Context/Context";
import React from "react";

export default function Teacher() {
    const { id } = useParams();
    const teacherIndex = Number(id);
    const { data, setData } = useContext(Context);
    const navigate = useNavigate();

    const [displayDays, setDisplayDays] = useState(true);
    const [displayPlaces, setDisplayPlaces] = useState(true);
    const [displayFreeSlots, setDisplayFreeSlots] = useState(false);

    const days = ["sun", "mon", "tus", "wed", "thr"];
    const totalSlots = 8;

    if (!data || !data.teachers?.length) return <p>No data loaded yet.</p>;

    const [teacher, setTeacher] = useState(() => data.teachers[teacherIndex]);

    // Sync local state when teacherIndex or data changes
    useEffect(() => {
        setTeacher(data.teachers[teacherIndex]);
    }, [teacherIndex, data]);

    // Updated helper
    const updateTeacher = (updateFn) => {
        setTeacher((prev) => {
            const updated = { ...prev };
            updateFn(updated);

            // sync back to global data
            setData((prevData) => {
                const teachers = [...prevData.teachers];
                teachers[teacherIndex] = updated;
                return { ...prevData, teachers };
            });

            return updated;
        });
    };

    // --- Initialize missing keys once ---
    useEffect(() => {
        const defaults = {
            teacher: "",
            religon: "",
            slots_per_week: 0,
            available_days: [],
            courses: [],
            classes: [],
            days: {},
        };

        setData((prevData) => {
            const teachers = [...prevData.teachers];
            const teacher = { ...teachers[teacherIndex] };

            let updated = false;
            for (const key in defaults) {
                if (teacher[key] === undefined) {
                    teacher[key] = defaults[key];
                    updated = true;
                }
            }

            if (!updated) return prevData; // no change needed

            teachers[teacherIndex] = teacher;
            return { ...prevData, teachers };
        });
    }, [teacherIndex, setData]);

    // --- Toggle day existence ---
    const toggleDay = (dayKey) => {
        updateTeacher((t) => {
            if (!t.days) t.days = {};
            const dayData = {
                free_slots: [],
                places: [],
                exists: true,
                ...(t.days[dayKey] || {}),
            };
            dayData.exists = !dayData.exists;
            t.days = { ...t.days, [dayKey]: dayData };
        });
    };

    // --- Toggle slot ---
    const toggleSlot = (dayKey, slotNum) => {
        updateTeacher((t) => {
            if (!t.days) t.days = {};
            const dayData = {
                free_slots: [],
                places: [],
                exists: true,
                ...(t.days[dayKey] || {}),
            };

            const slotSet = new Set(dayData.free_slots || []);
            if (slotSet.has(slotNum)) slotSet.delete(slotNum);
            else slotSet.add(slotNum);

            dayData.free_slots = Array.from(slotSet).sort((a, b) => a - b);
            t.days = { ...t.days, [dayKey]: dayData };
        });
    };

    // --- Toggle place ---
    const togglePlace = (dayKey, placeNum) => {
        updateTeacher((t) => {
            if (!t.days) t.days = {};
            const dayData = {
                free_slots: [],
                places: [],
                exists: true,
                ...(t.days[dayKey] || {}),
            };

            const placeSet = new Set(dayData.places || []);
            if (placeSet.has(placeNum)) placeSet.delete(placeNum);
            else placeSet.add(placeNum);

            dayData.places = Array.from(placeSet).sort((a, b) => a - b);
            t.days = { ...t.days, [dayKey]: dayData };
        });
    };

    // --- Navigation ---
    const nextTeacher = () =>
        navigate(`/teacher/${(teacherIndex + 1) % data.teachers.length}`);
    const prevTeacher = () =>
        navigate(
            `/teacher/${
                (teacherIndex - 1 + data.teachers.length) % data.teachers.length
            }`
        );
    return (
        <div className="card mb-4 shadow-sm p-4 text-start">
            <h4 className="text-center mb-4 fw-bold text-primary">
                {teacher.teacher}
                <div className="d-flex justify-content-between mt-4">
                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={prevTeacher}
                    >
                        ← Previous Teacher
                    </button>

                    <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={nextTeacher}
                    >
                        Next Teacher →
                    </button>
                </div>
            </h4>

            <form className="row g-3">
                {/* Name */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Name</label>
                    <input
                        type="text"
                        value={teacher.teacher || ""}
                        className="form-control"
                        placeholder="Enter teacher name"
                        onChange={(e) =>
                            updateTeacher((t) => {
                                t.teacher = e.target.value;
                            })
                        }
                    />
                </div>

                {/* Religion */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Religion</label>
                    <select
                        value={teacher.religon || "muslim"}
                        className="form-select"
                        onChange={(e) =>
                            updateTeacher((t) => {
                                t.religon = e.target.value;
                            })
                        }
                    >
                        <option value="muslim">Muslim</option>
                        <option value="christian">Christian</option>
                    </select>
                </div>

                {/* Available Days */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Available Days</label>
                    <div className="d-flex flex-wrap gap-2">
                        {days.map((day) => {
                            const exists = teacher.days?.[day]?.exists;

                            return (
                                <span
                                    key={day}
                                    onClick={() =>
                                        updateTeacher((t) => {
                                            if (!t.days) t.days = {};
                                            const current = t.days[day] || {
                                                free_slots: [],
                                                places: [],
                                                exists: false,
                                            };
                                            t.days = {
                                                ...t.days,
                                                [day]: {
                                                    ...current,
                                                    exists: !current.exists,
                                                },
                                            };
                                        })
                                    }
                                    className={`badge p-3 ${
                                        exists ? "bg-success" : "bg-secondary"
                                    }`}
                                    style={{
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {day}
                                </span>
                            );
                        })}
                    </div>
                </div>

                {/* Slots per week */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Slots per Week</label>
                    <input
                        type="number"
                        min="15"
                        value={teacher.slots_per_week}
                        className="form-control"
                        onChange={(e) =>
                            updateTeacher((t) => {
                                t.slots_per_week =
                                    parseInt(e.target.value) || 0;
                            })
                        }
                    />
                </div>

                {/* --- Courses Table --- */}
                <div className="col-12">
                    <label className="form-label fw-bold">Courses</label>

                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Subject</th>
                                <th>Slots / Week</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {teacher.courses?.map((course, index) => (
                                <tr key={index}>
                                    {/* --- Subject select --- */}
                                    <td>
                                        <select
                                            required
                                            className="form-select"
                                            value={course.id || ""}
                                            onChange={(e) =>
                                                updateTeacher((t) => {
                                                    const subjectId = parseInt(
                                                        e.target.value
                                                    );
                                                    const subj =
                                                        data.subjects.find(
                                                            (s) =>
                                                                s.id ===
                                                                subjectId
                                                        );
                                                    t.courses[index] = {
                                                        id: subj?.id || "",
                                                        name: subj?.name || "",
                                                        slots:
                                                            t.courses[index]
                                                                ?.slots || 0,
                                                    };
                                                })
                                            }
                                        >
                                            <option value="">
                                                Select Subject
                                            </option>
                                            {data.subjects?.map((subj) => (
                                                <option
                                                    key={subj.id}
                                                    value={subj.id}
                                                >
                                                    {subj.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* --- Slots input --- */}
                                    <td style={{ width: "150px" }}>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={course.slots || ""}
                                            onChange={(e) =>
                                                updateTeacher((t) => {
                                                    t.courses[index].slots =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0;
                                                })
                                            }
                                        />
                                    </td>

                                    {/* --- Remove button --- */}
                                    <td style={{ width: "50px" }}>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger"
                                            onClick={() =>
                                                updateTeacher((t) => {
                                                    t.courses.splice(index, 1);
                                                })
                                            }
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* --- Add new course --- */}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                            updateTeacher((t) => {
                                t.courses = [
                                    ...(t.courses || []),
                                    { id: "", name: "", slots: 0 },
                                ];
                            })
                        }
                    >
                        ➕ Add Subject
                    </button>

                    <small className="text-muted ms-2">
                        {teacher.courses?.length || 0} course(s)
                    </small>
                </div>

                {/* --- Classes Table --- */}
                <div className="col-12">
                    <label className="form-label fw-bold">
                        Class Assignments
                    </label>

                    <table className="table table-bordered align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Hours / Week</th>
                                <th>Actions</th> {/* updated */}
                            </tr>
                        </thead>
                        <tbody>
                            {teacher.classes?.map((entry, index) => (
                                <tr key={index}>
                                    {/* --- Class select --- */}
                                    <td>
                                        <select
                                            required
                                            className="form-select"
                                            value={entry.class_id || ""}
                                            onChange={(e) =>
                                                updateTeacher((t) => {
                                                    t.classes[index].class_id =
                                                        parseInt(
                                                            e.target.value
                                                        );
                                                    const selected =
                                                        data.classes.find(
                                                            (cls) =>
                                                                cls.id ===
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                        );
                                                    t.classes[
                                                        index
                                                    ].class_name = selected
                                                        ? `${selected.stage} - ${selected.level} - ${selected.suffix}`
                                                        : "";
                                                })
                                            }
                                        >
                                            <option value="">
                                                Select Class
                                            </option>
                                            {data.classes?.map((cls) => (
                                                <option
                                                    key={cls.id}
                                                    value={cls.id}
                                                >
                                                    {cls.stage} - {cls.level} -{" "}
                                                    {cls.suffix}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* --- Subject select --- */}
                                    <td>
                                        <select
                                            required
                                            className="form-select"
                                            value={entry.subject_id || ""}
                                            onChange={(e) =>
                                                updateTeacher((t) => {
                                                    t.classes[
                                                        index
                                                    ].subject_id = parseInt(
                                                        e.target.value
                                                    );
                                                    const selected =
                                                        t.courses.find(
                                                            (s) =>
                                                                s.id ===
                                                                parseInt(
                                                                    e.target
                                                                        .value
                                                                )
                                                        );
                                                    t.classes[
                                                        index
                                                    ].subject_name =
                                                        selected?.name || "";
                                                })
                                            }
                                        >
                                            <option value="">
                                                Select Subject
                                            </option>
                                            {teacher.courses?.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>

                                    {/* --- Hours input --- */}
                                    <td style={{ width: "150px" }}>
                                        <input
                                            type="number"
                                            min="1"
                                            className="form-control"
                                            value={entry.hours || 0}
                                            onChange={(e) =>
                                                updateTeacher((t) => {
                                                    t.classes[index].hours =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0;
                                                })
                                            }
                                        />
                                    </td>

                                    {/* --- Actions: Remove + Duplicate --- */}
                                    <td style={{ width: "100px" }}>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger me-1"
                                            onClick={() =>
                                                updateTeacher((t) => {
                                                    t.classes.splice(index, 1);
                                                })
                                            }
                                        >
                                            ✕
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
                                            onClick={() => {
                                                // Use functional update to avoid double effect
                                                setTeacher((prev) => {
                                                    const newClasses = [
                                                        ...prev.classes,
                                                    ];
                                                    const duplicate =
                                                        JSON.parse(
                                                            JSON.stringify(
                                                                newClasses[
                                                                    index
                                                                ]
                                                            )
                                                        );
                                                    newClasses.splice(
                                                        index + 1,
                                                        0,
                                                        duplicate
                                                    );

                                                    // Update global data at the same time
                                                    setData((prevData) => {
                                                        const teachers = [
                                                            ...prevData.teachers,
                                                        ];
                                                        teachers[teacherIndex] =
                                                            {
                                                                ...prev,
                                                                classes:
                                                                    newClasses,
                                                            };
                                                        return {
                                                            ...prevData,
                                                            teachers,
                                                        };
                                                    });

                                                    return {
                                                        ...prev,
                                                        classes: newClasses,
                                                    };
                                                });
                                            }}
                                        >
                                            ⬇️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* --- Add new row --- */}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm mt-2"
                        onClick={() =>
                            updateTeacher((t) => {
                                t.classes = [
                                    ...(t.classes || []),
                                    {
                                        class_id: "",
                                        class_name: "",
                                        subject_id: "",
                                        subject_name: "",
                                        hours: 0,
                                    },
                                ];
                            })
                        }
                    >
                        ➕ Add Row
                    </button>

                    <small className="text-muted ms-2">
                        {teacher.classes?.length || 0} assignment(s)
                    </small>
                </div>
            </form>
            <button
                className="btn btn-outline-primary m-4 "
                onClick={() => setDisplayFreeSlots(!displayFreeSlots)}
            >
                {displayFreeSlots ? "Hide Free Slots" : "Show Free Slots"}
            </button>

            {displayFreeSlots && (
                <div>
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
                                                {[...Array(totalSlots)].map(
                                                    (_, i) => {
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
                                                                    userSelect:
                                                                        "none",
                                                                }}
                                                            >
                                                                {slotNum}
                                                            </td>
                                                        );
                                                    }
                                                )}
                                            </tr>

                                            {/* Places row */}
                                            {displayPlaces && (
                                                <tr>
                                                    <td className="text-muted">
                                                        Places
                                                    </td>
                                                    {[...Array(totalSlots)].map(
                                                        (_, i) => {
                                                            const slotNum =
                                                                i + 1;
                                                            const isPlaceEnabled =
                                                                dayData.places?.includes(
                                                                    slotNum
                                                                );

                                                            return (
                                                                <td
                                                                    key={
                                                                        slotNum
                                                                    }
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
            )}
        </div>
    );
}
