import io
import os
import pyaudio
from google.cloud import speech

# Environment variable setup (if not already set)
# os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "path/to/your/service-account-key.json" # Uncomment and replace

def transcribe_streaming():
    """Streams audio from microphone to Speech-to-Text API and prints results."""

    client = speech.SpeechClient()  # Initialize Speech-to-Text client

    # Audio configuration (adjust as needed)
    RATE = 16000  # Sample rate in Hertz
    CHUNK = int(RATE / 10)  # 100ms chunks (adjust chunk size for latency vs. accuracy)
    FORMAT = pyaudio.paInt16  # Audio format (16-bit signed integer)
    CHANNELS = 1  # Mono audio

    audio = pyaudio.PyAudio()

    stream = audio.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=RATE,
        input=True,
        frames_per_buffer=CHUNK,
    )

    requests = (
        speech.StreamingRecognizeRequest(audio_content=chunk)
        for chunk in generate_audio_chunks(stream)
    )

    config = speech.StreamingRecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,  # Encoding of audio
        sample_rate_hertz=RATE,
        language_code="en-US",  # Language code (adjust as needed)
        model="latest_long", # Use 'latest_long' for better streaming accuracy (more latency) or 'latest_short' for lower latency but potentially less accurate
        interim_results=True,  # Get interim (partial) results
    )

    streaming_config = speech.StreamingRecognizeRequest(
        streaming_config=config,
    )

    # streaming_recognize returns a generator that yields streaming responses.
    responses = client.streaming_recognize(
        config=streaming_config,
        requests=requests,
    )

    # Listen to responses and print transcripts
    for response in responses:
        for result in response.results:
            if not result.alternatives:
                continue
            transcript = result.alternatives[0].transcript
            if result.is_final:
                print(f"Final Transcript: {transcript}")
            else:
                print(f"Interim Transcript: {transcript}")

    stream.stop_stream()
    stream.close()
    audio.terminate()

def generate_audio_chunks(stream):
    """Generator function to continuously yield audio chunks from the microphone."""
    while True:
        chunk = stream.read(CHUNK)
        yield chunk

if __name__ == "__main__":
    transcribe_streaming()