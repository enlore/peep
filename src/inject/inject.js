const peep = init({}, false)

chrome.runtime.onMessage.addListener(msg => {
  if (msg.type === 'toggle-peep')
    peep.toggle()
})

function init (peeps, peepin) {
  // what r ya peepin
  peeps = peeps || {}
  peepin = peepin == null ? false : peepin

  const peep = {
    peepin,
    peeps,

    toggle () {
      if (this.peepin) this.stop()
      else this.start()
    },

    stop () {
      document.removeEventListener('mouseover', highlight)
      document.removeEventListener('mouseout', unhighlight)
      document.removeEventListener('click', maybeLock)
      this.peepin = false
    },

    start () {
      document.addEventListener('mouseover', highlight)
      document.addEventListener('mouseout', unhighlight)
      document.addEventListener('click', maybeLock)
      this.peepin = true
    },

    classSelector (classList) {
      return classList && classList.length && `.${ Array.prototype.join.call(classList, '.') }`
    },

    id () { // https://stackoverflow.com/a/2117523 hollaaaaaa
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },

  }

  function maybeLock (ev) {
    if (ev.target.dataset.peep === "highlighted") {
      ev.target.dataset.peep = "locked"
      ev.target.dataset.peepId = peep.id()

      let _peep = {
        id: ev.target.dataset.peepId,
        path: ev.path,
      }

      _peep.path = _peep.path
        .map(p => `${p.localName}${p.id ? '#' + p.id : ''}${peep.classSelector(p.classList) || '' }`)
        .filter(p => p !== "undefined")

      peep.peeps[_peep.id] = _peep

    } else if (ev.target.dataset.peep === "locked") {
      ev.target.dataset.peep = "highlighted"
      delete peep.peeps[ev.target.dataset.peepId]
      delete ev.target.dataset.peepId
    }

    chrome.runtime.sendMessage({
      type: 'peeps',
      payload: peep.peeps
    }, function (resp) {
      console.info('on peeps', resp)
    })
  }

  function unhighlight (ev) {
    // doesn't delete undefined
    // doesn't delete locked
    if (ev.target.dataset
      && ev.target.dataset.peep === "highlighted") {
      delete ev.target.dataset.peep
    }
  }

  function highlight (ev) {
    if (ev.target.dataset && ev.target.dataset.peep === void 0) {
      ev.target.dataset.peep = "highlighted"
    }
  }

  return peep
}
