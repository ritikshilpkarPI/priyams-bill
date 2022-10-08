import { Button } from "@mantine/core";

const BillNarrator = ({ billTotal }) => {
  function getVoices() {
    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      // some time the voice will not be initialized so we can call spaek with empty string
      // this will initialize the voices
      let utterance = new SpeechSynthesisUtterance("");
      speechSynthesis.speak(utterance);
      voices = speechSynthesis.getVoices();
    }
    return voices;
  }

  function speak(text, voice, rate, pitch, volume) {
    // create a SpeechSynthesisUtterance to configure the how text to be spoken
    let speakData = new SpeechSynthesisUtterance();
    speakData.volume = volume; // From 0 to 1
    speakData.rate = rate; // From 0.1 to 10
    speakData.pitch = pitch; // From 0 to 2
    speakData.text = text;
    speakData.lang = "hi";
    speakData.voice = voice;

    // pass the SpeechSynthesisUtterance to speechSynthesis.speak to start speaking
    speechSynthesis.speak(speakData);
  }

  function narrateOnClick() {
    if ("speechSynthesis" in window) {
      const voices = getVoices();
      const pitch = 0;
      const volume = 1;
      speak("Preyamm stores me aapka bill,", voices[21], 5, pitch, volume);
      speak(`${billTotal} ,`, voices[21], 0.1, pitch, volume);
      speak(`or, ${billTotal},`, voices[0], 0.1, pitch, volume);
      speak("rupaye hai", voices[21], 5, pitch, volume);
    }
  }

  return <Button onClick={narrateOnClick}>Voice Bill</Button>;
};

export default BillNarrator;
