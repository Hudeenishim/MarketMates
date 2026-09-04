import { useState, useCallback } from 'react';

export const useSpeechToPrice = (onPriceDetected: (price: number) => void) => {
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      // Extract numbers from the transcript
      const numbers = transcript.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        // Use the first number found or join them? Usually one number is spoken.
        // E.g., "I offer 500" -> 500
        // "fifty" might not be captured as \d+ if it's text, but modern Speech API often converts numbers to digits. E.g., "fifty" -> "50"
        const price = parseInt(numbers.join(''), 10);
        if (!isNaN(price)) {
          onPriceDetected(price);
        }
      } else {
        // Try parsing words to numbers if possible, but basic regex works for native digit conversion.
        const wordToNum: {[key: string]: number} = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'twenty': 20, 'thirty': 30, 'forty': 40, 'fifty': 50,
            'sixty': 60, 'seventy': 70, 'eighty': 80, 'ninety': 90,
            'hundred': 100, 'thousand': 1000
        };
        // A very simple fallback
        let detected = false;
        for (const word of transcript.split(' ')) {
           if (wordToNum[word]) {
              onPriceDetected(wordToNum[word]);
              detected = true;
              break;
           }
        }
        if (!detected) {
            setSpeechError("Could not detect a number in: " + transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      setSpeechError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onPriceDetected]);

  return { isListening, startListening, speechError };
};
