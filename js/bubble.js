window.addEventListener('load', function () {
  const bubblesortDiv = document.getElementById('bubblesort')
  if (bubblesortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 15
    const array = []

    window.bubble = {
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

        const swaps = bubbleSort([...array])
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

    function bubbleSort(array) {
      const swaps = []
      do {
        var swapped = false
        for (let i = 1; i < array.length; i++) {
          if (array[i - 1] > array[i]) {
            swaps.push([i - 1, i])
            swapped = true
            ;[array[i - 1], array[i]] = [array[i], array[i - 1]]
          }
        }
      } while (swapped)
      return swaps
    }

    function showBars(indices) {
      const bubblesortDiv = document.getElementById('bubblesort')
      bubblesortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        bubblesortDiv.appendChild(bar)
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
      if (window.location.hash === '#bubblesort') {
        bubble.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#bubblesort') {
      bubble.init() // Initialize the visualization
    }
  }
})
