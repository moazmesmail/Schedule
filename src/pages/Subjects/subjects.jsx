import React, { useContext, useEffect } from "react";
import { Context } from "../../contexts/Context/Context";

export default function SubjectsTable() {
    const { data, setData } = useContext(Context);

    // Initialize subjects key if missing
    useEffect(() => {
        if (!data?.subjects) {
            setData({ ...data, subjects: [] });
        }
    }, [data, setData]);

    // If no data yet
    if (!data || !data.subjects) {
        return <p>Loading subjects data...</p>;
    }

    const subjects = data.subjects;

    // Generate next ID dynamically
    const nextId =
        subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;

    // --- Handlers ---
    const handleChange = (id, field, value) => {
        const updatedSubjects = subjects.map((sub) =>
            sub.id === id ? { ...sub, [field]: value } : sub
        );
        setData({ ...data, subjects: updatedSubjects });
    };

    const addSubject = () => {
        const newSubject = { id: nextId, name: "", stage: "primary" };
        setData({ ...data, subjects: [...subjects, newSubject] });
    };

    const deleteSubject = (id) => {
        const updated = subjects.filter((sub) => sub.id !== id);
        setData({ ...data, subjects: updated });
    };


    // --- UI ---
    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Subjects Table</h2>

            <table className="table table-bordered table-striped align-middle">
                <thead className="table-dark">
                    <tr>
                        <th style={{ width: "10%" }}>ID</th>
                        <th style={{ width: "40%" }}>Name</th>
                        <th style={{ width: "30%" }}>Stage</th>
                        <th style={{ width: "20%" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subjects.map((sub) => (
                        <tr key={sub.id}>
                            <td className="text-center">{sub.id}</td>
                            <td>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={sub.name}
                                    onChange={(e) =>
                                        handleChange(
                                            sub.id,
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter subject name"
                                />
                            </td>
                            <td>
                                <select
                                    className="form-select"
                                    value={sub.stage}
                                    onChange={(e) =>
                                        handleChange(
                                            sub.id,
                                            "stage",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="all">All</option>
                                    <option value="primary">Primary</option>
                                    <option value="prep">Prep</option>
                                    <option value="secondary">Secondary</option>
                                </select>
                            </td>
                            <td className="text-center">
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteSubject(sub.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-primary" onClick={addSubject}>
                    + Add Subject
                </button>
            </div>
        </div>
    );
}
