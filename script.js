const PASSWORD = "VIPSHAHED";
const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_1M.json";

const pwModal = document.getElementById("pw-modal");
const pwInput = document.getElementById("pw-input");
const pwSubmit = document.getElementById("pw-submit");
const launchBtn = document.getElementById("launch");
const periodEl = document.getElementById("period");
const cdEl = document.getElementById("countdown");
const resultEl = document.getElementById("result");
const logEl = document.getElementById("log");
const voiceToggle = document.getElementById("voice-toggle");
const voiceGender = document.getElementById("voice-gender");

let unlocked = false;
let enableVoice = false;
let currentPeriod = null;

// VOICE
function speak(text, gender){
  if(!enableVoice) return;
  const u = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  let v = voices[0];
  if(gender==="female") v = voices.find(x=>/female|zira|susan/i.test(x.name))||v;
  if(gender==="male") v = voices.find(x=>/male|david|mark/i.test(x.name))||v;
  u.voice = v;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// PASSWORD
pwSubmit.onclick = ()=>{
  if(pwInput.value===PASSWORD){
    unlocked = true;
    pwModal.style.display="none";
    speak("Welcome to Wingo VIP Signal Web. Team S R VIP.", "female");
    log("VIP Unlocked");
    startLoop();
  } else {
    alert("Wrong password. Contact admin.");
  }
};

voiceToggle.onclick=()=>{
  enableVoice=!enableVoice;
  voiceToggle.innerText=enableVoice?"Voice: On":"Voice: Off";
};

// SIGNAL PICK
function pickSignal(issue){
  const n = parseInt(issue.slice(-1));
  const bet = n%2===0?"BIG":"SMALL";
  return {number:n, bet};
}

// FETCH PERIOD
async function fetchIssue(){
  try{
    const r = await fetch(API_URL,{cache:"no-store"});
    const j = await r.json();
    return String(j.current.issueNumber);
  }catch(e){return null;}
}

// MAIN
launchBtn.onclick=()=>{
  if(!unlocked) return alert("Locked!");
  const sig = pickSignal(currentPeriod);
  resultEl.innerHTML = `🔥 SIGNAL: <b>${sig.bet}</b> (${sig.number})`;
  speak(`Signal ${sig.bet} number ${sig.number}`, voiceGender.value);
};

async function startLoop(){
  setInterval(async()=>{
    const i = await fetchIssue();
    if(i && i!==currentPeriod){
      currentPeriod=i;
      periodEl.innerText=i;
      cdEl.innerText="00:40";
    }
  },9000);
}

function log(t){
  logEl.innerHTML=`<div>${new Date().toLocaleTimeString()} - ${t}</div>`+logEl.innerHTML;
}

window.onload=()=>{
  pwModal.style.display="flex";
  speechSynthesis.getVoices();
};
