import React, { useState } from "react";

export default function SubjectsTable() {
    const [subjects, setSubjects] = useState([
        { id: 1, name: "Math", stage: "primary" },
        { id: 2, name: "Science", stage: "secondary" },
    ]);

    const [nextId, setNextId] = useState(3);

    const handleChange = (id, field, value) => {
        setSubjects(
            subjects.map((sub) =>
                sub.id === id ? { ...sub, [field]: value } : sub
            )
        );
    };

    const addSubject = () => {
        setSubjects([...subjects, { id: nextId, name: "", stage: "primary" }]);
        setNextId(nextId + 1);
    };

    const deleteSubject = (id) => {
        setSubjects(subjects.filter((sub) => sub.id !== id));
    };

    const saveToFile = () => {
        const json = JSON.stringify(subjects, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "subjects.json";
        link.click();

        URL.revokeObjectURL(url);
    };

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
                {/* <button className="btn btn-success" onClick={saveToFile}>
                    💾 Save as JSON
                </button> */}
            </div>
        </div>
    );
}
