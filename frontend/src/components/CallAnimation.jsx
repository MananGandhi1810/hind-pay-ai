import React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const CallAnimation = ({ isActive }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                {/* Pulsing circles animation */}
                {isActive && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-primary opacity-20 animate-ping"></div>
                        <div className="absolute inset-0 rounded-full bg-primary opacity-30 animate-ping animation-delay-300"></div>
                        <div className="absolute inset-0 rounded-full bg-primary opacity-40 animate-ping animation-delay-600"></div>
                    </>
                )}

                {/* Microphone icon in a circular container */}
                <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center z-10 relative ${
                        isActive ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                    </svg>
                </div>
            </div>

            {/* Recording status message */}
            <div className="mt-6 text-center">
                <h3 className="font-medium text-lg">
                    {isActive ? "Recording in progress" : "Ready to record"}
                </h3>

                {isActive ? (
                    <Card className="mt-3 p-3 max-w-xs mx-auto bg-secondary/20 border-secondary">
                        <p className="text-sm">
                            Speak clearly to capture your speech. Your words
                            will be transcribed automatically.
                        </p>
                    </Card>
                ) : (
                    <p className="text-muted-foreground mt-1">
                        Press Start to begin recording
                    </p>
                )}
            </div>
        </div>
    );
};

export default CallAnimation;
