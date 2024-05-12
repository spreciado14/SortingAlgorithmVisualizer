window.addEventListener('load', function () {
  const shakersortDiv = document.getElementById('shakersort')
  if (shakersortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 15
    const array = []

    window.shaker = {
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

        const swaps = shakerSort([...array])
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

    function shakerSort(array) {
      const swaps = []
      let swapped = true
      let start = 0
      let end = array.length - 1

      while (swapped) {
        swapped = false

        // Pass from left to right
        for (let i = start; i < end; i++) {
          if (array[i] > array[i + 1]) {
            swaps.push([i, i + 1])
            ;[array[i], array[i + 1]] = [array[i + 1], array[i]]
            swapped = true
          }
        }
        if (!swapped) break

        // Reduce the end pointer since the largest element is now at the end
        end--

        // Pass from right to left
        for (let i = end; i > start; i--) {
          if (array[i] < array[i - 1]) {
            swaps.push([i, i - 1])
            ;[array[i], array[i - 1]] = [array[i - 1], array[i]]
            swapped = true
          }
        }

        // Increase the start pointer since the smallest element is now at the start
        start++
      }

      return swaps
    }

    function showBars(indices) {
      const shakersortDiv = document.getElementById('shakersort')
      shakersortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        shakersortDiv.appendChild(bar)
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
      if (window.location.hash === '#shakersort') {
        shaker.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#shakersort') {
      shaker.init() // Initialize the visualization
    }
  }
})
