window.addEventListener('load', function () {
  const bogosortDiv = document.getElementById('bogosort')
  if (bogosortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 10
    const array = []

    window.bogo = {
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

        const swaps = bogoSort([...array])
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
        console.log('calling animate again with swaps:', swaps)
        animate(swaps)
      }, 100)
    }

    function isSorted(array) {
      for (let i = 1; i < array.length; i++) {
        if (array[i - 1] > array[i]) {
          return false
        }
      }
      return true
    }

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array // Return the shuffled array
    }
    function bogoSort(array) {
      const swaps = []
      let sorted = false

      while (!sorted) {
        sorted = isSorted(array)
        if (!sorted) {
          // Shuffle the array
          const shuffledArray = shuffle([...array])

          // Compare the shuffled array with the original array
          // and record the indices that need to be swapped
          for (let i = 0; i < array.length; i++) {
            if (array[i] !== shuffledArray[i]) {
              const j = shuffledArray.indexOf(array[i])
              swaps.push([i, j])
              ;[array[i], array[j]] = [array[j], array[i]]
            }
          }
        }
      }

      return swaps
    }

    function showBars(indices) {
      const bogosortDiv = document.getElementById('bogosort')
      bogosortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        bogosortDiv.appendChild(bar)
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

      // Check if freq is a finite number
      if (isFinite(freq)) {
        osc.frequency.value = freq
      } else {
        // If freq is not a finite number, assign a default frequency value
        osc.frequency.value = 440 // Default to A4 note
      }

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
      if (window.location.hash === '#bogosort') {
        bogo.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#bogosort') {
      bogo.init() // Initialize the visualization
    }
  }
})
