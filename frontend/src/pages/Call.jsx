import React, { useState, useRef, useEffect } from "react";
import useSpeechToText from "react-hook-speech-to-text";
import CallAnimation from "@/components/CallAnimation";
import { useToast } from "../context/ToastContext";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { AlertCircle, Mic, MicOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

function Call() {
    const { showToast } = useToast();
    const [isCallActive, setIsCallActive] = useState(false);
    const [commandText, setCommandText] = useState("");
    const [callDuration, setCallDuration] = useState(0);
    const [messages, setMessages] = useState([]);
    const transcriptEndRef = useRef(null);
    const timerRef = useRef(null);

    // Set up the speech-to-text hook
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
        crossBrowser: true,
        timeout: 10000,
        speechRecognitionProperties: {
            interimResults: true,
            lang: "en-US",
        },
        // Process final results as they come in
        onResult: (result) => {
            if (result && result.transcript && !result.isInterim) {
                addMessage(result.transcript);
            }
        },
    });

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (transcriptEndRef.current) {
            transcriptEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, interimResult]);

    // Handle call timer
    useEffect(() => {
        if (isCallActive) {
            timerRef.current = setInterval(() => {
                setCallDuration((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(timerRef.current);
            if (callDuration > 0 && messages.length > 0) {
                showToast(
                    `Call ended. Duration: ${formatTime(callDuration)}`,
                    "info",
                );
            }
        }

        return () => {
            clearInterval(timerRef.current);
        };
    }, [isCallActive, callDuration, messages.length, showToast]);

    // Toggle call state
    const toggleCall = () => {
        const newStatus = !isCallActive;
        setIsCallActive(newStatus);

        if (newStatus) {
            showToast("Call started", "info");
            setCallDuration(0);
            startSpeechToText();
        } else {
            stopSpeechToText();
        }
    };

    // Add a message to the conversation
    const addMessage = (text) => {
        if (text && text.trim() !== "") {
            setMessages((prev) => [
                ...prev,
                {
                    text,
                    timestamp: new Date().toLocaleTimeString(),
                },
            ]);
        }
    };

    // Handle command execution
    const handleSendCommand = (e) => {
        e.preventDefault();
        if (commandText.trim() !== "") {
            // Execute the command
            executeCommand(commandText);
            setCommandText("");
        }
    };

    // Execute different commands based on input
    const executeCommand = (command) => {
        const lowerCommand = command.toLowerCase().trim();

        // Command handling logic
        if (lowerCommand === "clear transcript" || lowerCommand === "clear") {
            setMessages([]);
            showToast("Transcript cleared", "success");
        } else if (
            lowerCommand === "add bookmark" ||
            lowerCommand === "bookmark"
        ) {
            showToast(
                "Bookmark added at " + formatTime(callDuration),
                "success",
            );
        } else if (
            lowerCommand === "save" ||
            lowerCommand === "save transcript"
        ) {
            showToast("Transcript saved", "success");
            // In a real app, this would trigger a save/download function
        } else if (lowerCommand === "mute" || lowerCommand === "unmute") {
            showToast(
                `Microphone ${lowerCommand === "mute" ? "muted" : "unmuted"}`,
                "info",
            );
            // In a real app, this would control mic state
        } else {
            // For any other command, just acknowledge it
            showToast(`Command executed: ${command}`, "success");
        }
    };

    // Format seconds into MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="container mx-auto py-4 h-full-w-nav max-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Voice Recording</h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Speech recognition error: {error}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex flex-1 gap-4 overflow-hidden">
                <Card className="w-1/3 flex flex-col">
                    <CardHeader className="pb-2 flex flex-row justify-between items-center">
                        <CardTitle className="text-lg">Conversation</CardTitle>
                        {isCallActive && (
                            <div className="flex items-center gap-2">
                                {isRecording ? (
                                    <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                                ) : (
                                    <MicOff className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {isRecording ? "Listening" : "Paused"}
                                </span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="flex-1 p-3 overflow-hidden">
                        <ScrollArea className="h-full pr-4">
                            {messages.length === 0 && !interimResult ? (
                                <p className="text-muted-foreground italic text-sm">
                                    No conversation yet. Start recording to
                                    capture speech.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((message, index) => (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg bg-card border border-border"
                                        >
                                            <p className="text-sm">
                                                {message.text}
                                            </p>
                                            <div className="flex justify-end items-center mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {message.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Show interim transcript with typing animation */}
                                    {interimResult && (
                                        <div className="p-3 rounded-lg bg-muted border border-primary/30 animate-pulse">
                                            <p className="text-sm text-muted-foreground">
                                                {interimResult}
                                            </p>
                                            <div className="flex justify-end items-center mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs animate-pulse"
                                                >
                                                    Speaking...
                                                </Badge>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={transcriptEndRef} />
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col">
                    <CardContent className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <CallAnimation isActive={isCallActive} />

                            <div className="mt-6">
                                <Button
                                    onClick={toggleCall}
                                    size="lg"
                                    variant={
                                        isCallActive ? "destructive" : "default"
                                    }
                                    className="rounded-full px-8"
                                    disabled={error}
                                >
                                    {isCallActive
                                        ? "Stop Recording"
                                        : "Start Recording"}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="w-1/3">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Recording Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium mb-1">Status</h3>
                                <Badge
                                    variant={
                                        isCallActive ? "default" : "outline"
                                    }
                                >
                                    {isCallActive ? "Recording" : "Inactive"}
                                </Badge>
                            </div>

                            <div>
                                <h3 className="font-medium mb-1">Duration</h3>
                                <p className="text-xl font-mono">
                                    {isCallActive
                                        ? formatTime(callDuration)
                                        : "00:00"}
                                </p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="font-medium mb-1">
                                    Speech Recognition
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {isRecording
                                        ? "Actively listening to your voice"
                                        : "Start recording to enable speech recognition"}
                                </p>
                            </div>

                            <div>
                                <h3 className="font-medium mb-1">Statistics</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Messages
                                        </p>
                                        <p className="text-sm">
                                            {messages.length}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Transcripts
                                        </p>
                                        <p className="text-sm">
                                            {results.length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-4">
                <CardContent className="p-4">
                    <form onSubmit={handleSendCommand} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="command" className="font-medium">
                                Transcription Controls
                            </Label>
                            <Badge variant="outline">Controls</Badge>
                        </div>
                        <div className="flex gap-2">
                            <Input
                                id="command"
                                type="text"
                                value={commandText}
                                onChange={(e) => setCommandText(e.target.value)}
                                placeholder="Enter commands like 'clear', 'bookmark', 'save transcript'"
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                variant="secondary"
                                disabled={!commandText.trim() || !isCallActive}
                            >
                                Execute
                            </Button>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="border-t pt-2 pb-2 px-4 bg-muted/50">
                    <p className="text-xs text-muted-foreground">
                        Available commands: clear, bookmark, save transcript,
                        mute, unmute
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Call;
