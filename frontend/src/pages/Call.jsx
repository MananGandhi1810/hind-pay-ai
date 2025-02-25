import React from "react";
import SpeechToTextComponent from "@/components/SpeechToTextComponent";

function Call() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Speech Recognition</h1>
            <div className="max-w-2xl">
                <SpeechToTextComponent />
            </div>
        </div>
    );
}

export default Call;
