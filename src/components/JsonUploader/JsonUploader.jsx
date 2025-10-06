import { useContext, useState } from "react";
import JsonViewer from "./jsonviewer";
import { Context } from "../../contexts/Context/Context";

export default function JsonUploader() {
    const {data ,setData } = useContext(Context)

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                setData(jsonData)
            } catch (err) {
                alert("Invalid JSON file!"), err;
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="p-4">
            <h2>{JSON.stringify(data)}</h2>
            <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="mb-4"
            />
            <h2>{JSON.stringify(data)}</h2>

            {data && <JsonViewer  />}
        </div>
    );
}
