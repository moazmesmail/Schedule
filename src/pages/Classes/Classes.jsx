import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../contexts/Context/Context";

export default function ClassesTable() {
    const { data, setData } = useContext(Context);

    const [stage, setStage] = useState("primary");
    const [level, setLevel] = useState(1);
    const [count, setCount] = useState(1);

    useEffect(() => {
        if (!data?.classes) setData({ ...data, classes: [] });
        if (!data?.floors) {
            setData({
                ...data,
                floors: [
                    { id: 1, name: "الثاني", building: "ابتدائي" },
                    { id: 2, name: "الثالث", building: "ابتدائي" },
                    { id: 3, name: "الرابع", building: "ابتدائي" },
                    { id: 4, name: "الارضي", building: "اعدادي" },
                    { id: 5, name: "الاول", building: "اعدادي" },
                    { id: 6, name: "الثاني", building: "اعدادي" },
                    { id: 7, name: "الثالث", building: "اعدادي" },
                ],
            });
        }
    }, [data, setData]);

    if (!data || !data.classes) return <p>Loading classes data...</p>;

    const classesList = data.classes;
    const floors = data.floors || [];

    const nextId =
        classesList.length > 0
            ? Math.max(...classesList.map((c) => c.id)) + 1
            : 1;

    const getLevels = (stage) => {
        if (stage === "primary") return [1, 2, 3, 4, 5, 6];
        if (stage === "prep") return [1, 2, 3];
        if (stage === "secondary") return [1, 2, 3];
        return [];
    };

    const suffixOptions = ["A", "B", "C", "D", "E", "F", "G", "H" , "I" , "J" , "K" , "L" , "M" , "N"];


    const isDuplicate = (stage, level, suffix, excludeId = null) =>
        classesList.some(
            (cls) =>
                cls.stage === stage &&
                cls.level === level &&
                cls.suffix.toLowerCase() === suffix.toLowerCase() &&
                cls.id !== excludeId
        );

    const handleChange = (id, field, value) => {
        const targetClass = classesList.find((cls) => cls.id === id);
        if (!targetClass) return;

        const updatedClass = { ...targetClass, [field]: value };

        if (field === "stage") {
            const validLevels = getLevels(value);
            if (!validLevels.includes(updatedClass.level)) {
                updatedClass.level = validLevels[0];
            }
            // reset floor if stage changes
            updatedClass.floor_id = null;
        }

        if (
            field !== "notes" &&
            isDuplicate(
                updatedClass.stage,
                updatedClass.level,
                updatedClass.suffix,
                id
            )
        ) {
            alert("Duplicate stage, level, and suffix!");
            return;
        }

        const updated = classesList.map((cls) =>
            cls.id === id ? updatedClass : cls
        );
        setData({ ...data, classes: updated });
    };

    const addClass = () => {
        const stage = "primary";
        const level = 1;

        // find existing suffixes for this stage/level
        const usedSuffixes = classesList
            .filter((cls) => cls.stage === stage && cls.level === level)
            .map((cls) => cls.suffix.toUpperCase());

        // pick first unused suffix
        const availableSuffix =
            suffixOptions.find((s) => !usedSuffixes.includes(s)) || "A";

        const newClass = {
            id: nextId,
            stage,
            level,
            suffix: availableSuffix,
            floor_id: null,
            notes: "",
        };

        setData({ ...data, classes: [...classesList, newClass] });
    };


    const deleteClass = (id) => {
        const updated = classesList.filter((cls) => cls.id !== id);
        setData({ ...data, classes: updated });
    };

    const duplicateClass = (cls) => {
        const newClass = { ...cls, id: nextId };
        setData({ ...data, classes: [...classesList, newClass] });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4 text-center">Classes Table</h2>

            <table className="table table-bordered table-striped align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Stage</th>
                        <th>Level</th>
                        <th>Suffix</th>
                        <th>Floor</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {classesList.map((cls) => {
                        
                        const levels = getLevels(cls.stage);
                        return (
                            <tr key={cls.id}>
                                <td className="text-center">{cls.id}</td>

                                <td>
                                    <select
                                        className="form-select"
                                        value={cls.stage}
                                        onChange={(e) =>
                                            handleChange(
                                                cls.id,
                                                "stage",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="primary">Primary</option>
                                        <option value="prep">Prep</option>
                                        <option value="secondary">
                                            Secondary
                                        </option>
                                    </select>
                                </td>

                                <td>
                                    <select
                                        className="form-select"
                                        value={cls.level}
                                        onChange={(e) =>
                                            handleChange(
                                                cls.id,
                                                "level",
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {levels.map((lvl) => (
                                            <option key={lvl} value={lvl}>
                                                {lvl}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td>
                                    <select
                                        className="form-select"
                                        value={cls.suffix}
                                        onChange={(e) =>
                                            handleChange(
                                                cls.id,
                                                "suffix",
                                                e.target.value
                                            )
                                        }
                                    >
                                        {suffixOptions.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                {/* 🧱 Floor selection */}
                                <td>
                                    <select
                                        className="form-select"
                                        value={cls.floor_id || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                cls.id,
                                                "floor_id",
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option value="">
                                            -- Select Floor --
                                        </option>
                                        {floors.map((f) => (
                                            <option key={f.id} value={f.id}>
                                                {f.name} ({f.building})
                                            </option>
                                        ))}
                                    </select>
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cls.notes || ""}
                                        onChange={(e) =>
                                            handleChange(
                                                cls.id,
                                                "notes",
                                                e.target.value
                                            )
                                        }
                                    />
                                </td>

                                <td className="text-center">
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => deleteClass(cls.id)}
                                    >
                                        Delete
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => duplicateClass(cls)}
                                    >
                                        Duplicate
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-primary" onClick={addClass}>
                    + Add Class
                </button>
            </div>
        </div>
    );
}
