import { useContext, useState } from "react";
import JsonUploader from "../../components/JsonUploader/JsonUploader";
import { Context } from "../../contexts/Context/Context";


export default function Home() {
    const [success, setSuccess] = useState(false);
    const { data, setData } = useContext(Context);

    // clear uploaded data
    const handleClear = () => {
        setData(null);
        setSuccess(false);
    };

    // download JSON data
    const handleSave = () => {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json",
        });
        const now = new Date();
        const localTime = now
            .toLocaleString("sv-SE") 
            .replace(/[: ]/g, "-");

        const filename = `data_${localTime}.json`;

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    };

    return data ? (
        <>
            <div className="alert alert-success mt-4 text-center" role="alert">
                ✅ Application has data.
            </div>
            <div className="d-flex justify-content-center gap-3 mt-3">
                <button className="btn btn-danger" onClick={handleClear}>
                    Clear
                </button>
                <button className="btn btn-success" onClick={handleSave}>
                    Save as JSON
                </button>
            </div>
        </>
    ) : (
        <div className="container text-center mt-4">
            <h1 className="mb-4">Upload Data</h1>
            {<JsonUploader onSuccess={() => setSuccess(true)} />}
            {success && (
                <div className="alert alert-success mt-4" role="alert">
                    ✅ Data uploaded successfully!
                </div>
            )}
        </div>
    );
}

