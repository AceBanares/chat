let step = 0;

btnInitialize.addEventListener("click", initChat);
btnSignalGet.addEventListener("click", signalGet);
btnSignalSet.addEventListener("click", signalSet);
btnChat.addEventListener("click", sendMessage);

btnInitialize.textContent = `Step ${++step}: Click to open new window`; // Step 1
boxSignal.style.display = "none";
boxChat.style.display = "none";

function initChat() {
  switch (step) {
    case 1:
      open(location.href + "#1");
      boxInitialize.style.display = "none";
      step = 3;
      btnSignalSet.textContent = `Step ${step}: Click here to paste text`; // Step 4
      boxSignal.style.display = "inline";
      btnSignalGet.style.display = "none";
      break;
    default:
      txtInitialize.select();
      document.execCommand("copy");
      btnInitialize.textContent = `Step ${++step}: Paste the copied content to the other tab`; // Step 3
      txtInitialize.style.display = "none";
      btnInitialize.disabled = true;
      if (step === 3) {
        btnSignalSet.style.display = "inline";
        step = 6;
        btnSignalSet.textContent = `Step ${step}: Complete other steps, then click here to paste text`; // Step 6
        boxSignal.style.display = "inline";
        btnSignalGet.disabled = true;
      }
  }
}

function signalGet() {
  boxSignal.style.display = "none";
  boxInitialize.style.display = "inline";
  btnInitialize.textContent = `Step ${step}: Click this button to copy text`; // Step 5
}

function signalSet() {
  navigator.clipboard
    .readText()
    .then(clipText => (txtSignal.textContent = clipText));
  // txtSignal.focus();
  // document.execCommand("paste");

  btnSignalGet.textContent = `Step ${++step}: Click to submit signal`; // Step 4
  btnSignalSet.style.display = "none";
  btnSignalGet.style.display = "inline";
  btnSignalGet.disabled = false;
}

// var Peer = require('simple-peer')
var p = new SimplePeer({ initiator: location.hash === "#1", trickle: false });

p.on("error", err => console.log("error", err));

p.on("signal", data => {
  console.log("SIGNAL", JSON.stringify(data));
  // document.querySelector('#outgoing').textContent = JSON.stringify(data)
  txtInitialize.textContent = JSON.stringify(data);
  btnInitialize.textContent = `Step ${++step}: Click this button to copy text`; // Step 2 & 6
});

document.querySelector("form").addEventListener("submit", ev => {
  ev.preventDefault();
  // p.signal(JSON.parse(document.querySelector('#incoming').value))
  p.signal(JSON.parse(txtSignal.value));
});

p.on("connect", () => {
  console.log("CONNECT");
  // p.send("whatever" + Math.random());
  btnInitialize.style.display = "none";
  boxChat.style.display = "inline";
});

p.on("data", data => {
  const message = `anonym${location.hash}: ${data}`;
  // console.log(message);
  displayMessage(message);
});

function sendMessage() {
  p.send(txtChat.value);
  displayMessage(`me: ${txtChat.value}`)
  txtChat.value = "";
}

function displayMessage(message) {
  const para = document.createElement("li");
  const node = document.createTextNode(message);
  para.appendChild(node);
  boxMessages.appendChild(para);
}
