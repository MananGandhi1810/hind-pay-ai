import React from "react";
import SpeechToTextComponent from "@/components/SpeechToTextComponent";
import { useToast } from "../context/ToastContext";

function Call() {
    const { showToast } = useToast();

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Speech Recognition</h1>
            <div className="max-w-2xl mb-8">
                <SpeechToTextComponent />
            </div>
            <div className="mt-6">
                <h2 className="text-xl font-bold mb-3">
                    Test Toast Notifications
                </h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() =>
                            showToast("This is an info message", "info")
                        }
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Show Info Toast
                    </button>
                    <button
                        onClick={() =>
                            showToast("Success! Operation completed", "success")
                        }
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Show Success Toast
                    </button>
                    <button
                        onClick={() =>
                            showToast("Warning: Please be cautious", "warning")
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        Show Warning Toast
                    </button>
                    <button
                        onClick={() => showToast("Error occurred", "error")}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Show Error Toast
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Call;
