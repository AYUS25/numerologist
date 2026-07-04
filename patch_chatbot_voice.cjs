const fs = require('fs');
let code = fs.readFileSync('src/components/ChatBot.tsx', 'utf8');

const newVoiceLogic = `  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        let finalTranscript = '';
        
        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setInputText((prev) => (finalTranscript + interimTranscript).trim());
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);`;

code = code.replace(/useEffect\(\(\) => \{\n\s*if \(typeof window !== 'undefined'\) \{\n\s*const SpeechRecognition[\s\S]*?\}, \[\]\);/, newVoiceLogic);

fs.writeFileSync('src/components/ChatBot.tsx', code);
