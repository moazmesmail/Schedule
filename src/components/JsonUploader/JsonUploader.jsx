import { useContext } from "react";
import JsonViewer from "./jsonviewer";
import { Context } from "../../contexts/Context/Context";

export default function JsonUploader({ onSuccess }) {
    const { setData } = useContext(Context);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                setData(jsonData);
                localStorage.setItem("appData", JSON.stringify(jsonData));
                onSuccess && onSuccess();
            } catch (err) {
                alert("Invalid JSON file!"), err;
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4">
            <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="mb-4"
            />
        </div>
    );
}
