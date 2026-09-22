import { wait } from "@/utils/wait";
import { synthesizeSpeech } from "../tts/ttsService";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await synthesizeSpeech(screenplay.talk.message).catch(
        () => null
      );
      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      async ([audioBuffer]) => {
        onStart?.();

        if (audioBuffer) {
          // VOICEVOX returned audio — use real lip-sync
          return viewer.model?.speak(audioBuffer, screenplay);
        } else {
          // Fallback — Web Speech API with simulated lip-sync
          return viewer.model?.speakWithWebSpeech(
            screenplay.talk.message,
            screenplay
          );
        }
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();
