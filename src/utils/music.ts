import * as Tone from 'tone';
import { SPAN } from './visualization';

const piano = new Tone.PolySynth(Tone.Synth).toDestination();
const pianoChord = new Tone.PolySynth(Tone.Synth).toDestination();
const kick = new Tone.MembraneSynth().toDestination();

/**
 * 这个函数使用 Tone.js 来创建和播放一个音乐序列。
 * 它首先停止和清除任何现有的音频事件，
 * 然后创建一个新的合成器和一个音乐序列，最后播放这个序列。
 */
export function playSequence(
  pianoIds: string[],
  kickIds: string[],
  callBackPiano: (noteId: number) => void,
  callBackKick: (noteId: number) => void,
) {
  Tone.Transport.stop(); // 停止 Tone.js 的运输控制
  Tone.Transport.cancel(); // 取消运输中的所有事件
  // Play new sequence

  let currentPianoIndex = 0;
  const pianoSequence = new Tone.Sequence((time, note) => {
    piano.triggerAttackRelease(note, '8n', time);
    callBackPiano(currentPianoIndex);
    currentPianoIndex++;
  }, generateNotes(pianoIds, 3), '4n');
  pianoSequence.start(0);


  const pianoChordSequence = new Tone.Sequence((time, note) => {
    pianoChord.triggerAttackRelease(note, '8n', time);
  }, generateChords(pianoIds), '4n');
  pianoChordSequence.start(0.2);

  let currentKickIndex = 0;
  const kickPart = new Tone.Sequence((time, note) => {
    kick.triggerAttackRelease(note, "8n", time);
    callBackKick(currentKickIndex)
    currentKickIndex++;
  }, generateNotes(kickIds, 1), '4n');
  kickPart.start(0);

  Tone.Transport.start(); // 启动 Tone.js 的运输控制，开始播放
}

/**
 * 通过解析字符串 ID 数组来生成一个音符序列。
 * 每个 ID 都被分割成 x 和 y 坐标，
 * 然后根据这些坐标生成对应的音符和音高。
 */
export function generateNotes(ids: string[], baseClef: number) {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  // 将 ID 转换为音符序列
  const noteSq = ids.map((id) => {
    // 分割 ID 并转换为数字，如果无法转换则默认为 0
    const [x, y] = id.split(',').map((value) => Number(value) || 0);
    const noteName = notes[Math.floor(x / SPAN) % notes.length];
    // 根据 y 坐标决定音符的音高（clef），并保证其在 3 到 5 之间
    const clef = Math.round(Math.floor(y / SPAN) % 3) + baseClef;
    return `${noteName}${clef}`
  })
  return noteSq; // 返回生成的音符序列
}

export function generateChords(ids: string[]) {
  // 定义 C、D 和 G 和弦的音符数组
  const cChord = ["C3,E3,G3,B3"];
  const dChord = ["D3,F3,A3,C4"];
  const gChord = ["B2,D3,E3,A3"];
  // 将这些和弦组合成一个数组
  const chords = [cChord, dChord, gChord];
  // 将每个 id 映射到一个和弦
  const result = ids.map(id => {
    const [x, y] = id.split(',').map((value) => Number(value) || 0);
    const chord = chords[Math.floor((x + y) / SPAN) % chords.length];
    return chord;
  })
  return result;
}