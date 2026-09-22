import * as THREE from "three";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { VRMAnimation } from "../../lib/VRMAnimation/VRMAnimation";
import { VRMLookAtSmootherLoaderPlugin } from "@/lib/VRMLookAtSmootherLoaderPlugin/VRMLookAtSmootherLoaderPlugin";
import { LipSync } from "../lipSync/lipSync";
import { EmoteController } from "../emoteController/emoteController";
import { Screenplay } from "../messages/messages";

/**
 * 3Dキャラクターを管理するクラス
 */
export class Model {
  public vrm?: VRM | null;
  public mixer?: THREE.AnimationMixer;
  public emoteController?: EmoteController;

  private _lookAtTargetParent: THREE.Object3D;
  private _lipSync?: LipSync;

  constructor(lookAtTargetParent: THREE.Object3D) {
    this._lookAtTargetParent = lookAtTargetParent;
    this._lipSync = new LipSync(new AudioContext());
  }

  public async loadVRM(url: string): Promise<void> {
    const loader = new GLTFLoader();
    loader.register(
      (parser) =>
        new VRMLoaderPlugin(parser, {
          lookAtPlugin: new VRMLookAtSmootherLoaderPlugin(parser),
        })
    );

    const gltf = await loader.loadAsync(url);

    const vrm = (this.vrm = gltf.userData.vrm);
    vrm.scene.name = "VRMRoot";

    VRMUtils.rotateVRM0(vrm);
    this.mixer = new THREE.AnimationMixer(vrm.scene);

    this.emoteController = new EmoteController(vrm, this._lookAtTargetParent);
  }

  public unLoadVrm() {
    if (this.vrm) {
      VRMUtils.deepDispose(this.vrm.scene);
      this.vrm = null;
    }
  }

  /**
   * VRMアニメーションを読み込む
   *
   * https://github.com/vrm-c/vrm-specification/blob/master/specification/VRMC_vrm_animation-1.0/README.ja.md
   */
  public async loadAnimation(vrmAnimation: VRMAnimation): Promise<void> {
    const { vrm, mixer } = this;
    if (vrm == null || mixer == null) {
      throw new Error("You have to load VRM first");
    }

    const clip = vrmAnimation.createAnimationClip(vrm);
    const action = mixer.clipAction(clip);
    action.play();
  }

  /**
   * 音声を再生し、リップシンクを行う (ArrayBuffer — real audio from VOICEVOX or other TTS)
   */
  public async speak(buffer: ArrayBuffer, screenplay: Screenplay) {
    this.emoteController?.playEmotion(screenplay.expression);
    await new Promise((resolve) => {
      this._lipSync?.playFromArrayBuffer(buffer, () => {
        resolve(true);
      });
    });
  }

  /**
   * Web Speech API fallback — simulate lip-sync without ArrayBuffer.
   * Oscillates the mouth morph target during speech for visual feedback.
   */
  public async speakWithWebSpeech(
    text: string,
    screenplay: Screenplay
  ): Promise<void> {
    this.emoteController?.playEmotion(screenplay.expression);

    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ja-JP";
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;

      // Try to find a Japanese voice
      const voices = window.speechSynthesis.getVoices();
      const japaneseVoice = voices.find(
        (v) => v.lang === "ja-JP" || v.lang.startsWith("ja")
      );
      if (japaneseVoice) {
        utterance.voice = japaneseVoice;
      }

      // Simulated lip-sync: oscillate mouth while speaking
      let lipSyncInterval: ReturnType<typeof setInterval> | null = null;
      let phase = 0;

      utterance.onstart = () => {
        lipSyncInterval = setInterval(() => {
          phase += 0.3;
          // Create a pseudo-random mouth movement pattern
          const volume = Math.abs(Math.sin(phase)) * 0.6 + Math.random() * 0.3;
          this.emoteController?.lipSync("aa", volume);
        }, 50); // ~20fps lip movement
      };

      utterance.onend = () => {
        if (lipSyncInterval) {
          clearInterval(lipSyncInterval);
          lipSyncInterval = null;
        }
        // Close mouth
        this.emoteController?.lipSync("aa", 0);
        resolve();
      };

      utterance.onerror = () => {
        if (lipSyncInterval) {
          clearInterval(lipSyncInterval);
          lipSyncInterval = null;
        }
        this.emoteController?.lipSync("aa", 0);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public update(delta: number): void {
    if (this._lipSync) {
      const { volume } = this._lipSync.update();
      this.emoteController?.lipSync("aa", volume);
    }

    this.emoteController?.update(delta);
    this.mixer?.update(delta);
    this.vrm?.update(delta);
  }
}
