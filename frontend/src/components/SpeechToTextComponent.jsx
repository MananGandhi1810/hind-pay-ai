import React, { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";
import { motion } from "framer-motion";

const SpeechToTextComponent = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [confidence, setConfidence] = useState(0);
    const recognitionRef = useRef(null);
    const { showToast } = useToast();

    useEffect(() => {
        if (
            "SpeechRecognition" in window ||
            "webkitSpeechRecognition" in window
        ) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                showToast("Listening started...", "info");
            };

            recognitionRef.current.onresult = (event) => {
                const current = event.resultIndex;
                if (event.results[current].isFinal) {
                    const result = event.results[current][0];
                    setTranscript(prev => prev + " " + result.transcript);
                    setConfidence(result.confidence * 100);
                    
                    if (result.confidence > 0.8) {
                        showToast("High confidence detection!", "success", 1500);
                    }
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                showToast(`Error: ${event.error}`, "error", 5000);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        } else {

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [showToast]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
            showToast("Listening stopped", "info");
        } else {
            try {
                recognitionRef.current.start();
            } catch (error) {
                console.error("Error starting recognition:", error);
                showToast("Failed to start listening", "error");
            }
        }
    };

    const clearTranscript = () => {
        setTranscript("");
        showToast("Transcript cleared", "success");
    };

    return (
        <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
            <div className="mb-4 flex justify-between">
                <button
                    onClick={toggleListening}
                    className={`px-4 py-2 rounded-md ${
                        isListening
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                    } text-white transition-colors`}
                >
                    {isListening ? "Stop Listening" : "Start Listening"}
                </button>
                <button
                    onClick={clearTranscript}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition-colors"
                    disabled={!transcript}
                >
                    Clear
                </button>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Transcript:</h3>
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md min-h-[150px] max-h-[300px] overflow-y-auto">
                    {transcript || (
                        <span className="text-gray-500">
                            Your speech will appear here...
                        </span>
                    )}
                </div>
            </div>

            {isListening && (
                <div className="mt-4 flex justify-center">
                    <div className="flex space-x-1">
                        <div className="w-2 h-8 bg-green-500 animate-pulse rounded"></div>
                        <div className="w-2 h-8 bg-green-500 animate-pulse delay-75 rounded"></div>
                        <div className="w-2 h-8 bg-green-500 animate-pulse delay-150 rounded"></div>
                        <div className="w-2 h-8 bg-green-500 animate-pulse delay-300 rounded"></div>
                        <div className="w-2 h-8 bg-green-500 animate-pulse delay-150 rounded"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SpeechToTextComponent;
