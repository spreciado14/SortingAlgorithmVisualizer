window.addEventListener('load', function () {
  const selectionsortDiv = document.getElementById('selectionsort')
  if (selectionsortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 10
    const array = []

    window.selection = {
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

        const swaps = selectionSort([...array])
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

    function selectionSort(array) {
      const swaps = []
      for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i
        for (let j = i + 1; j < array.length; j++) {
          if (array[j] < array[minIndex]) {
            minIndex = j
          }
        }
        if (minIndex !== i) {
          swaps.push([i, minIndex])
          ;[array[i], array[minIndex]] = [array[minIndex], array[i]]
        }
      }
      return swaps
    }

    function showBars(indices) {
      const selectionsortDiv = document.getElementById('selectionsort')
      selectionsortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        selectionsortDiv.appendChild(bar)
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
      if (window.location.hash === '#selectionsort') {
        selection.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#selectionsort') {
      selection.init() // Initialize the visualization
    }
  }
})
