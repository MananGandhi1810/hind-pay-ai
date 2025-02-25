import React, {
    useState,
    useEffect,
    forwardRef,
} from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center">
                        <div
                            className={`w-3 h-3 rounded-full mr-2 ${
                                isRecording
                                    ? "bg-red-500 animate-pulse"
                                    : "bg-muted"
                            }`}
                        />
                        <span>Speech Recognition</span>
                        <Badge
                            variant={isRecording ? "default" : "outline"}
                            className="ml-2 text-xs"
                        >
                            {isRecording ? "Active" : "Inactive"}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium mb-1">
                                Final transcript
                            </h3>
                            <div className="p-3 bg-muted rounded min-h-[50px] text-sm">
                                {transcript || "Waiting for speech..."}
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium mb-1">
                                Interim transcript
                            </h3>
                            <div className="p-3 bg-muted rounded min-h-[50px] text-sm text-muted-foreground italic">
                                {interimTranscript || "No interim results..."}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    },
);

SpeechToTextComponent.displayName = "SpeechToTextComponent";

export default SpeechToTextComponent;
