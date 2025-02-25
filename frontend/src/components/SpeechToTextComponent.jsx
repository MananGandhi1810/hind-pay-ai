import React, { useState, useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const SpeechToTextComponent = () => {
    const [transcribedText, setTranscribedText] = useState("");
    const { toast } = useToast();

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
    });

    useEffect(() => {
        if (error) {
            toast({
                variant: "destructive",
                title: "Speech Recognition Error",
                description: error,
            });
        }
    }, [error, toast]);

    const handleStartListening = () => {
        startSpeechToText();
    };

    const handleStopListening = () => {
        stopSpeechToText();
        if (results.length > 0) {
            console.log(results);
            setTranscribedText(
                results.map((result) => result.transcript).join(" "),
            );
        }
    };

    const handleClearText = () => {
        setTranscribedText("");
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Speech to Text</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex gap-2">
                    <Button
                        onClick={
                            isRecording
                                ? handleStopListening
                                : handleStartListening
                        }
                        variant={isRecording ? "destructive" : "default"}
                    >
                        {isRecording ? "Stop Listening" : "Start Listening"}
                    </Button>

                    <Button onClick={handleClearText} variant="outline">
                        Clear Text
                    </Button>
                </div>

                {isRecording && (
                    <div className="mb-4">
                        <p className="font-medium">Interim Result:</p>
                        <p className="italic">{interimResult}</p>
                    </div>
                )}

                <div>
                    <p className="font-medium mb-2">Transcribed Text:</p>
                    <Textarea
                        value={
                            transcribedText ||
                            (results.length > 0
                                ? results
                                      .map((result) => result.transcript)
                                      .join(" ")
                                : "No transcription yet")
                        }
                        readOnly
                        className="min-h-[100px]"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default SpeechToTextComponent;
