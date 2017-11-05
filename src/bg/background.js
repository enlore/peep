// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


let peeps = {}
let peepin = false

//example of using a message handler from the inject scripts
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  console.info('onMessage chrome', chrome)
  console.info('onMessage msg', msg)
  console.info('onMessage sender', sender)

  switch (msg.type) {
    case 'peeps':
      peeps = msg.payload
      sendResponse({
        type: 'peeps',
        payload: { ok: true }
      });
      break;

    case 'gen-config':
      //let opts = {
        //outputProp1: '.a .selector',
        //outputProp: {
          //listItem: 'selector', // for an array of vals
          //data: { // to define how the data should be scrapped out for this
            //prop: '.selector',
            //otherProp: {
              //selector: '.another-selector',
              //attr: 'src',
              //convert: () => {}
            //}
          //}
        //}
      //}

      // every config needs
      //    url
      //
      // every peep needs
      //   name
      //   selector
      //
      // optionally
      //   attr
      //
      //
      let body = {
        website: msg.href,
        scrapeConfig: {}
      }

      for (let k in peeps) {
        let peep = peeps[k]

        body.scrapeConfig[peep.id] =  peep.path.reverse().join(' ')
      }

      fetch('https://vine-psychiatrist.glitch.me/subject', {
        credentials: 'include',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(resp => {
          console.info(resp)
        })

      break;

    case 'clear':
      break;

    default:
      console.info('should not')
  }
});
