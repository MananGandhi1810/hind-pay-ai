import React, { useState, useRef } from "react";
import SpeechToTextComponent from "@/components/SpeechToTextComponent";
import CallAnimation from "@/components/CallAnimation";
import { useToast } from "../context/ToastContext";

function Call() {
    const { showToast } = useToast();
    const [isCallActive, setIsCallActive] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [interimText, setInterimText] = useState("");
    const [inputText, setInputText] = useState("");
    const speechComponentRef = useRef();

    const toggleCall = () => {
        const newStatus = !isCallActive;
        setIsCallActive(newStatus);
        if (newStatus) {
            showToast("Call started", "info");
            setInterimText(""); // Clear interim text when starting a new call
        } else {
            showToast("Call ended", "info");
            setInterimText(""); // Clear interim text when ending call
        }
    };

    const handleTranscriptUpdate = (text) => {
        if (text && text.trim() !== "") {
            setTranscript((prev) => [
                ...prev,
                { text, timestamp: new Date().toLocaleTimeString() },
            ]);
        }
    };

    const handleInterimUpdate = (text) => {
        setInterimText(text);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (inputText.trim() !== "") {
            setTranscript((prev) => [
                ...prev,
                {
                    text: inputText,
                    timestamp: new Date().toLocaleTimeString(),
                    isUser: true,
                },
            ]);
            setInputText("");
        }
    };

    return (
        <div className="container mx-auto py-4 h-full-w-nav max-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Voice Assistant Call</h1>

            <div className="flex flex-1 gap-4 overflow-hidden">
                <div className="w-1/3 bg-gray-50 rounded-lg p-4 overflow-y-auto flex flex-col">
                    <h2 className="text-lg font-semibold mb-3">
                        Conversation Transcript
                    </h2>
                    <div className="flex-1 overflow-y-auto">
                        {transcript.length === 0 && !interimText ? (
                            <p className="text-gray-500 italic">
                                No conversation yet. Start the call to begin.
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {transcript.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-lg ${
                                            item.isUser
                                                ? "bg-blue-100 ml-8"
                                                : "bg-gray-100 mr-8"
                                        }`}
                                    >
                                        <p className="text-sm">{item.text}</p>
                                        <p className="text-xs text-gray-500">
                                            {item.timestamp}
                                        </p>
                                    </div>
                                ))}

                                {/* Show interim transcript with typing animation */}
                                {interimText && (
                                    <div className="p-2 rounded-lg bg-gray-100 mr-8 border-l-2 border-blue-400">
                                        <p className="text-sm text-gray-600">
                                            {interimText}
                                        </p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <span>Listening</span>
                                            <span className="ml-1 inline-block animate-pulse">
                                                ...
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                    <CallAnimation isActive={isCallActive} />

                    <div className="mt-6 flex gap-2">
                        <button
                            onClick={toggleCall}
                            className={`px-6 py-3 rounded-full font-medium ${
                                isCallActive
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                            }`}
                        >
                            {isCallActive ? "End Call" : "Start Call"}
                        </button>
                    </div>

                    <div className="hidden">
                        <SpeechToTextComponent
                            ref={speechComponentRef}
                            isListening={isCallActive}
                            onTranscriptUpdate={handleTranscriptUpdate}
                            onInterimUpdate={handleInterimUpdate}
                        />
                    </div>
                </div>

                <div className="w-1/3"></div>
            </div>

            <div className="mt-4 bg-white p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
                        disabled={!inputText.trim()}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Call;
