"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageSettings from "@/components/language-settings";

interface Transcript {
  id: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export default function LiveTranscription() {
  const [isListening, setIsListening] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "en-US",
    "hi-IN",
  ]);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const transcriptContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setError(
          "Speech recognition is not supported in this browser. Please use Chrome or Edge."
        );
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      // Set primary language (we'll use English as base, but it can detect Hindi words)
      recognition.lang = selectedLanguages[0] || "en-US";

      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const newTranscript: Transcript = {
            id: Date.now().toString(),
            text: finalTranscript.trim(),
            timestamp: Date.now(),
            isFinal: true,
          };
          setTranscripts((prev) => [...prev, newTranscript]);
          setCurrentTranscript("");
        } else {
          setCurrentTranscript(interimTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "no-speech") {
          // Don't show error for no-speech, just continue listening
          return;
        }
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          // Restart recognition if it stops but we're still supposed to be listening
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, selectedLanguages]);

  useEffect(() => {
    // Auto-scroll to bottom when new transcripts arrive
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop =
        transcriptContainerRef.current.scrollHeight;
    }
  }, [transcripts, currentTranscript]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setError(null);
      setTranscripts([]);
      setCurrentTranscript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearTranscripts = () => {
    setTranscripts([]);
    setCurrentTranscript("");
  };

  return (
    <div className='flex min-h-screen flex-col bg-background'>
      {/* Header */}
      <header className='border-b border-border bg-card'>
        <div className='container mx-auto flex items-center justify-between p-4'>
          <h1 className='text-xl font-semibold text-foreground'>
            pwatranscribe
          </h1>
          <Button
            variant='ghost'
            size='icon'
            onClick={() => setShowSettings(!showSettings)}
            className='text-muted-foreground'
          >
            <Settings className='size-5' />
          </Button>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <LanguageSettings
          selectedLanguages={selectedLanguages}
          onLanguagesChange={setSelectedLanguages}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Main Content */}
      <main className='flex flex-1 flex-col overflow-hidden'>
        {/* Transcription Display */}
        <div
          ref={transcriptContainerRef}
          className='flex-1 space-y-4 overflow-y-auto px-4 py-6'
        >
          {transcripts.length === 0 && !currentTranscript && !isListening && (
            <div className='flex h-full items-center justify-center'>
              <div className='space-y-2 text-center'>
                <div className='text-lg text-muted-foreground'>
                  Tap the microphone to start
                </div>
                <div className='text-sm text-muted-foreground'>
                  Speak in English, Hindi, or mix both languages
                </div>
              </div>
            </div>
          )}

          {transcripts.map((transcript) => (
            <Card key={transcript.id} className='border-border bg-card p-4'>
              <p className='text-lg leading-relaxed text-balance text-card-foreground'>
                {transcript.text}
              </p>
            </Card>
          ))}

          {currentTranscript && (
            <Card className='border-2 border-accent/30 bg-muted/50 p-4'>
              <p className='text-lg leading-relaxed text-balance text-muted-foreground'>
                {currentTranscript}
              </p>
            </Card>
          )}

          {isListening && !currentTranscript && transcripts.length === 0 && (
            <div className='flex items-center justify-center py-8'>
              <div className='space-y-2 text-center'>
                <div className='flex justify-center'>
                  <div className='animate-pulse'>
                    <Mic className='size-8 text-accent' />
                  </div>
                </div>
                <p className='text-muted-foreground'>Listening...</p>
              </div>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className='border-t border-destructive/20 bg-destructive/10 px-4 py-3'>
            <p className='text-center text-sm text-destructive'>{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className='safe-area-bottom border-t border-border bg-card p-4'>
          <div className='container mx-auto max-w-md space-y-3'>
            <Button
              onClick={toggleListening}
              size='lg'
              className={cn(
                "h-16 w-full text-lg font-medium transition-all",
                isListening
                  ? "text-destructive-foreground bg-destructive hover:bg-destructive/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
            >
              {isListening ? (
                <>
                  <MicOff className='mr-2 size-6' />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className='mr-2 size-6' />
                  Start Recording
                </>
              )}
            </Button>

            {transcripts.length > 0 && (
              <Button
                onClick={clearTranscripts}
                variant='outline'
                size='sm'
                className='w-full bg-transparent'
              >
                Clear Transcripts
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Mic, MicOff, Settings } from "lucide-react";
// import { cn } from "@/lib/utils";
// import LanguageSettings from "@/components/language-settings";

// interface Transcript {
//   id: string;
//   text: string;
//   timestamp: number;
//   isFinal: boolean;
// }

// export default function LiveTranscription() {
//   const [isListening, setIsListening] = useState(false);
//   const [transcripts, setTranscripts] = useState<Transcript[]>([]);
//   const [currentTranscript, setCurrentTranscript] = useState("");
//   const [showSettings, setShowSettings] = useState(false);
//   const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
//     "en-US",
//     "hi-IN",
//   ]);

//   const [browserSupportError, setBrowserSupportError] = useState<string | null>(
//     null
//   );
//   const [runtimeError, setRuntimeError] = useState<string | null>(null);
//   const [isMounted, setIsMounted] = useState(false);

//   const recognitionRef = useRef<any>(null);
//   const transcriptContainerRef = useRef<HTMLDivElement>(null);
//   const isListeningRef = useRef(isListening);

//   // This effect runs *only on the client* after hydration
//   useEffect(() => {
//     // Disable the ESLint rule. This is the correct pattern for hydration.
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setIsMounted(true); // Component is now hydrated

//     // Now it's safe to check browser-specific APIs
//     if (typeof window === "undefined") {
//       setBrowserSupportError(
//         "Speech recognition requires a browser environment."
//       );
//       return;
//     }

//     const SpeechRecognition =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       setBrowserSupportError(
//         "Speech recognition is not supported in this browser. Please use Chrome or Edge."
//       );
//     }
//   }, []); // Empty dependency array ensures this runs once on mount

//   useEffect(() => {
//     // Don't setup recognition if the browser isn't supported
//     if (browserSupportError) {
//       return;
//     }

//     // Or if we're not mounted yet
//     if (!isMounted) {
//       return;
//     }

//     // We can safely assume window and SpeechRecognition exist here
//     const SpeechRecognition =
//       (window as any).SpeechRecognition ||
//       (window as any).webkitSpeechRecognition;

//     if (!SpeechRecognition) return; // Redundant safety check

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = selectedLanguages[0] || "en-US";

//     recognition.onresult = (event: any) => {
//       let interimTranscript = "";
//       let finalTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript + " ";
//         } else {
//           interimTranscript += transcript;
//         }
//       }

//       if (finalTranscript) {
//         const newTranscript: Transcript = {
//           id: Date.now().toString(),
//           text: finalTranscript.trim(),
//           timestamp: Date.now(),
//           isFinal: true,
//         };
//         setTranscripts((prev) => [...prev, newTranscript]);
//         setCurrentTranscript("");
//       } else {
//         setCurrentTranscript(interimTranscript);
//       }
//     };

//     recognition.onerror = (event: any) => {
//       console.error("Speech recognition error:", event.error);
//       if (event.error === "no-speech") {
//         return;
//       }
//       setRuntimeError(`Error: ${event.error}`);
//       setIsListening(false);
//       isListeningRef.current = false;
//     };

//     recognition.onend = () => {
//       if (isListeningRef.current) {
//         recognition.start();
//       }
//     };

//     recognitionRef.current = recognition;

//     return () => {
//       if (recognitionRef.current) {
//         recognitionRef.current.stop();
//       }
//     };
//   }, [selectedLanguages, browserSupportError, isMounted]);

//   useEffect(() => {
//     if (transcriptContainerRef.current) {
//       transcriptContainerRef.current.scrollTop =
//         transcriptContainerRef.current.scrollHeight;
//     }
//   }, [transcripts, currentTranscript]);

//   const toggleListening = () => {
//     // Check for browser support error first
//     if (browserSupportError || !recognitionRef.current) {
//       setRuntimeError("Speech recognition not initialized or not supported.");
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//       isListeningRef.current = false;
//     } else {
//       setRuntimeError(null);
//       setTranscripts([]);
//       setCurrentTranscript("");
//       recognitionRef.current.start();
//       setIsListening(true);
//       isListeningRef.current = true;
//     }
//   };

//   const clearTranscripts = () => {
//     setTranscripts([]);
//     setCurrentTranscript("");
//   };

//   // This check now only runs *after* mounting
//   if (isMounted && browserSupportError) {
//     return (
//       <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4'>
//         <Card className='border-destructive/50 bg-destructive/10 p-6 text-center'>
//           <h2 className='text-lg font-semibold text-destructive'>
//             Unsupported Browser
//           </h2>
//           <p className='mt-2 text-destructive/90'>{browserSupportError}</p>
//         </Card>
//       </div>
//     );
//   }

//   // This UI is now rendered on the server AND the initial client render
//   return (
//     <div className='flex min-h-screen flex-col bg-background'>
//       {/* Header */}
//       <header className='border-b border-border bg-card'>
//         <div className='container mx-auto flex items-center justify-between p-4'>
//           <h1 className='text-xl font-semibold text-foreground'>
//             Live Transcription
//           </h1>
//           <Button
//             variant='ghost'
//             size='icon'
//             onClick={() => setShowSettings(!showSettings)}
//             className='text-muted-foreground'
//           >
//             <Settings className='size-5' />
//           </Button>
//         </div>
//       </header>

//       {/* Settings Panel */}
//       {showSettings && (
//         <LanguageSettings
//           selectedLanguages={selectedLanguages}
//           onLanguagesChange={setSelectedLanguages}
//           onClose={() => setShowSettings(false)}
//         />
//       )}

//       {/* Main Content */}
//       <main className='flex flex-1 flex-col overflow-hidden'>
//         {/* Transcription Display */}
//         <div
//           ref={transcriptContainerRef}
//           className='flex-1 space-y-4 overflow-y-auto px-4 py-6'
//         >
//           {transcripts.length === 0 && !currentTranscript && !isListening && (
//             <div className='flex h-full items-center justify-center'>
//               <div className='space-y-2 text-center'>
//                 <div className='text-lg text-muted-foreground'>
//                   {/* Show a loading message before hydration */}
//                   {!isMounted ? "Loading..." : "Tap the microphone to start"}
//                 </div>
//                 {isMounted && (
//                   <div className='text-sm text-muted-foreground'>
//                     Speak in English, Hindi, or mix both languages
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {transcripts.map((transcript) => (
//             <Card key={transcript.id} className='border-border bg-card p-4'>
//               <p className='text-lg leading-relaxed text-balance text-card-foreground'>
//                 {transcript.text}
//               </p>
//             </Card>
//           ))}

//           {currentTranscript && (
//             <Card className='border-2 border-accent/30 bg-muted/50 p-4'>
//               <p className='text-lg leading-relaxed text-balance text-muted-foreground'>
//                 {currentTranscript}
//               </p>
//             </Card>
//           )}

//           {isListening && !currentTranscript && transcripts.length === 0 && (
//             <div className='flex items-center justify-center py-8'>
//               <div className='space-y-2 text-center'>
//                 <div className='flex justify-center'>
//                   <div className='animate-pulse'>
//                     <Mic className='size-8 text-accent' />
//                   </div>
//                 </div>
//                 <p className='text-muted-foreground'>Listening...</p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Error Display */}
//         {runtimeError && (
//           <div className='border-t border-destructive/20 bg-destructive/10 px-4 py-3'>
//             <p className='text-center text-sm text-destructive'>
//               {runtimeError}
//             </p>
//           </div>
//         )}

//         {/* Controls */}
//         <div className='safe-area-bottom border-t border-border bg-card p-4'>
//           <div className='container mx-auto max-w-md space-y-3'>
//             <Button
//               onClick={toggleListening}
//               size='lg'
//               // Disable button until mounted and support is confirmed
//               disabled={!isMounted || !!browserSupportError}
//               className={cn(
//                 "h-16 w-full text-lg font-medium transition-all",
//                 isListening
//                   ? "text-destructive-foreground bg-destructive hover:bg-destructive/90"
//                   : "bg-accent text-accent-foreground hover:bg-accent/90",
//                 "disabled:cursor-not-allowed disabled:opacity-50"
//               )}
//             >
//               {isListening ? (
//                 <>
//                   <MicOff className='mr-2 size-6' />
//                   Stop Recording
//                 </>
//               ) : (
//                 <>
//                   <Mic className='mr-2 size-6' />
//                   Start Recording
//                 </>
//               )}
//             </Button>

//             {transcripts.length > 0 && (
//               <Button
//                 onClick={clearTranscripts}
//                 variant='outline'
//                 size='sm'
//                 className='w-full bg-transparent'
//                 disabled={!isMounted}
//               >
//                 Clear Transcripts
//               </Button>
//             )}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
