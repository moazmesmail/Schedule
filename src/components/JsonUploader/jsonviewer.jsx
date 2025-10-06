import { useContext } from "react";
import { Context } from "../../contexts/Context/Context";

export default function JsonViewer() {
    const {data , setData} = useContext(Context)
    if (!data) return <p>No JSON data loaded yet.</p>;

    // normalize to array if it's an object
    const list = Array.isArray(data)
        ? data
        : data.teachers || Object.values(data); // adjust this key to your structure

    const sorted = [...list].sort((a, b) => a.teacher.localeCompare(b.teacher));

    return (
        sorted.length > 0 &&
        sorted[0]?.days && (
            <div className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">
                {sorted
                    .filter((teacher) => teacher.days.length)
                    .map((teacher, i) => (
                        <div key={i} className="mb-4">
                            <h1 className="font-bold">{teacher.teacher}</h1>
                            <div className="ml-4">
                                {teacher.days.map((day, j) => (
                                    <span key={j}>
                                        {day}
                                        {j < teacher.days.length - 1
                                            ? ", "
                                            : ""}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        )
    );
}
