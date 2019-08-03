chatStart.addEventListener('click', initChat);
chatSend.disabled = true;

function initChat() {
  if(location.href.substr(location.href.length - 2) != "#1")
    location.href += "#1";
  location.reload();
  chatStart.disabled = true;
  chatSend.disabled = false;
}

// var Peer = require('simple-peer')
var p = new SimplePeer({ initiator: location.hash === '#1', trickle: false })
 
p.on('error', err => console.log('error', err))
 
p.on('signal', data => {
  console.log('SIGNAL', JSON.stringify(data))
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})
 
document.querySelector('form').addEventListener('submit', ev => {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})
 
p.on('connect', () => {
  console.log('CONNECT')
  p.send('whatever' + Math.random())
})
 
p.on('data', data => {
  console.log('data: ' + data)
})