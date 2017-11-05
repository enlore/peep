document.getElementById('peep-toggle').addEventListener('click', togglePeep)
document.getElementById('peep-gen').addEventListener('click', gen)
//document.getElementById('peep-clear').addEventListener('click', clearPeeps)

function gen () {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.runtime.sendMessage({ type: 'gen-config', href: tabs[0].url })
  })
}

function clearPeeps () {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'clear-peeps' })
  })
}

function togglePeep () {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'toggle-peep' })
  })
}

