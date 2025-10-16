import React from "react";

/**
 * Renders a single row for the teacher's class assignment table.
 *
 * @param {object} props
 * @param {object} props.assignment - The data for this specific class assignment row.
 * @param {Array} props.availableClasses - The full list of classes from the context.
 * @param {Array} props.availableSubjects - The list of subjects this teacher can teach.
 * @param {Function} props.onUpdate - Callback function to update the assignment data in the parent state.
 * @param {Function} props.onRemove - Callback function to remove this assignment row from the parent state.
 */
export default function ClassAssignmentRow({
    assignment,
    availableClasses,
    availableSubjects,
    onUpdate,
    onRemove,
}) {
    // Handles changes to any input in the row
    const handleChange = (field, value) => {
        const updatedAssignment = { ...assignment, [field]: value };

        // If the class_id changes, we also need to update the class_name
        if (field === "class_id") {
            const selectedClass = availableClasses.find(
                (cls) => cls.id === value
            );
            updatedAssignment.class_name = selectedClass
                ? `${selectedClass.stage} - ${selectedClass.level} - ${selectedClass.suffix}`
                : "";
        }

        // If the subject_id changes, we also need to update the subject_name
        if (field === "subject_id") {
            const selectedSubject = availableSubjects.find(
                (subj) => subj.id === value
            );
            updatedAssignment.subject_name = selectedSubject?.name || "";
        }

        // Pass the entire updated object back to the parent
        onUpdate(updatedAssignment);
    };

    return (
        <tr>
            {/* --- Class select --- */}
            <td>
                <select
                    required
                    className="form-select"
                    value={assignment.class_id || ""}
                    onChange={(e) =>
                        handleChange("class_id", parseInt(e.target.value))
                    }
                >
                    <option value="">Select Class</option>
                    {availableClasses?.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                            {cls.stage} - {cls.level} - {cls.suffix}
                        </option>
                    ))}
                </select>
            </td>

            {/* --- Subject select --- */}
            <td>
                <select
                    required
                    className="form-select"
                    value={assignment.subject_id || ""}
                    onChange={(e) =>
                        handleChange("subject_id", parseInt(e.target.value))
                    }
                >
                    <option value="">Select Subject</option>
                    {availableSubjects?.map((s) => (
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
                    value={assignment.hours || 8}
                    onChange={(e) =>
                        handleChange("hours", parseInt(e.target.value) || 0)
                    }
                />
            </td>

            {/* --- Remove button --- */}
            <td style={{ width: "50px" }}>
                <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={onRemove} // Parent handles removal
                >
                    ✕
                </button>
            </td>
        </tr>
    );
}
