window.addEventListener('load', function () {
  const oddevensortDiv = document.getElementById('oddevensort')
  if (oddevensortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 15
    const array = []

    window.oddeven = {
      init: function () {
        if (isAnimating) return
        for (let i = 0; i < n; i++) {
          array[i] = Math.random()
        }
        showBars()
      },
      play: function () {
        if (isAnimating) return // Exit early if animation is already in progress

        isAnimating = true // Set animation state to true

        const swaps = oddEvenSort([...array])
        animate(swaps)
      },
    }

    window.init = function () {
      if (isAnimating) return
      for (let i = 0; i < n; i++) {
        array[i] = Math.random()
      }
      showBars()
    }

    function animate(swaps) {
      if (swaps.length === 0) {
        showBars()
        isAnimating = false // Set animation state to false when animation is complete
        return
      }
      const [i, j] = swaps.shift()
      ;[array[i], array[j]] = [array[j], array[i]]
      showBars([i, j])
      playNote(200 + array[i] * 500)
      playNote(200 + array[j] * 500)

      setTimeout(function () {
        animate(swaps)
      }, 100)
    }

    function oddEvenSort(array) {
      const swaps = []
      let sorted = false

      while (!sorted) {
        sorted = true

        // Odd phase
        for (let i = 1; i < array.length - 1; i += 2) {
          if (array[i] > array[i + 1]) {
            swaps.push([i, i + 1])
            ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
            sorted = false
          }
        }

        // Even phase
        for (let i = 0; i < array.length - 1; i += 2) {
          if (array[i] > array[i + 1]) {
            swaps.push([i, i + 1])
            ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
            sorted = false
          }
        }
      }

      return swaps
    }

    function showBars(indices) {
      const oddevensortDiv = document.getElementById('oddevensort')
      oddevensortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        oddevensortDiv.appendChild(bar)
      }
    }

    function playNote(freq) {
      if (audioCtx === null) {
        audioCtx = new (AudioContext ||
          webkitAudioContext ||
          window.webkitAudioContext)()
      }
      const dur = 0.1
      const osc = audioCtx.createOscillator()
      osc.frequency.value = freq
      osc.start()
      osc.stop(audioCtx.currentTime + dur)
      const node = audioCtx.createGain()
      node.gain.value = 0.1
      node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur)
      osc.connect(node)
      node.connect(audioCtx.destination)
    }
    // Add an event listener for hash changes
    window.addEventListener('hashchange', function () {
      if (window.location.hash === '#oddevensort') {
        oddeven.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#oddevensort') {
      oddeven.init() // Initialize the visualization
    }
  }
})
