import React, {
    useState,
    useEffect,
    useImperativeHandle,
    forwardRef,
} from "react";

const SpeechToTextComponent = forwardRef(
    (
        {
            isListening = false,
            onTranscriptUpdate = () => {},
            onInterimUpdate = () => {},
        },
        ref,
    ) => {
        const [transcript, setTranscript] = useState("");
        const [interimTranscript, setInterimTranscript] = useState("");
        const [isRecording, setIsRecording] = useState(false);

        useEffect(() => {
            if (
                !("webkitSpeechRecognition" in window) &&
                !("SpeechRecognition" in window)
            ) {
                console.error(
                    "Speech recognition not supported in this browser",
                );
                return;
            }

            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onresult = (event) => {
                let finalTranscript = "";
                let currentInterim = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptText = event.results[i][0].transcript;

                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptText;
                        onTranscriptUpdate(transcriptText);
                    } else {
                        currentInterim += transcriptText;
                    }
                }

                if (finalTranscript) {
                    setTranscript(finalTranscript);
                }

                if (currentInterim) {
                    setInterimTranscript(currentInterim);
                    onInterimUpdate(currentInterim);
                }
            };

            recognition.onend = () => {
                if (isRecording) {
                    recognition.start();
                } else {
                    setInterimTranscript("");
                    onInterimUpdate("");
                }
            };

            if (isListening && !isRecording) {
                setIsRecording(true);
                recognition.start();
            } else if (!isListening && isRecording) {
                setIsRecording(false);
                recognition.stop();
            }

            return () => {
                recognition.stop();
            };
        }, [
            isListening,
            isRecording,
            onTranscriptUpdate,
            onInterimUpdate,
            ref,
        ]);

        return (
            <div className="bg-white rounded-lg shadow p-4">
                <div className="mb-4 flex items-center">
                    <div
                        className={`w-3 h-3 rounded-full mr-2 ${
                            isRecording
                                ? "bg-red-500 animate-pulse"
                                : "bg-gray-300"
                        }`}
                    ></div>
                    <span>
                        {isRecording ? "Listening..." : "Not listening"}
                    </span>
                </div>

                <div className="p-3 bg-gray-50 rounded min-h-[100px] max-h-[300px] overflow-auto">
                    <p className="font-medium">Final transcript:</p>
                    <p>{transcript || "Waiting for speech..."}</p>

                    {interimTranscript && (
                        <>
                            <p className="font-medium mt-2">
                                Interim transcript:
                            </p>
                            <p className="text-gray-600 italic">
                                {interimTranscript}
                            </p>
                        </>
                    )}
                </div>
            </div>
        );
    },
);

SpeechToTextComponent.displayName = "SpeechToTextComponent";

export default SpeechToTextComponent;
