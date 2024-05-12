window.onload = function () {
  const mergesortDiv = document.getElementById('mergesort')
  if (mergesortDiv) {
    let audioCtx = null
    let isAnimating = false
    const n = 10
    const array = []

    window.merge = {
      init: function () {
        if (isAnimating) return
        for (let i = 0; i < n; i++) {
          array[i] = Math.random()
        }
        showBars()
      },
      play: function () {
        if (isAnimating) return // Exit early if animation is already in progress

        const swaps = mergeSort([...array])
        isAnimating = true // Set animation state to true
        animate(swaps)

        // Check if animation is complete before triggering the next one
        const checkAnimation = setInterval(function () {
          if (!isAnimating) {
            clearInterval(checkAnimation) // Stop checking when animation is complete
            if (!isSorted(array)) {
              // Check if array is fully sorted
              window.merge.play() // Trigger the next animation
            }
          }
        }, 100)
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

      let swap = swaps.shift()
      if (!Array.isArray(swap) || swap.length !== 2) {
        console.error('Invalid swap:', swap)
        return
      }

      const [i, j] = swap
      ;[array[i], array[j]] = [array[j], array[i]]
      showBars([i, j])
      playNote(200 + array[i] * 500)
      playNote(200 + array[j] * 500)

      // Call animate recursively with a delay
      setTimeout(function () {
        animate(swaps)
      }, 100)
    }

    function isSorted(array) {
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
          return false
        }
      }
      return true
    }

    function mergeSort(array) {
      return mergeSortHelper(array, 0, array.length - 1)
    }

    function mergeSortHelper(array, start, end) {
      if (start >= end) {
        return []
      }

      const mid = Math.floor((start + end) / 2)
      let swaps = []
      swaps = swaps.concat(mergeSortHelper(array, start, mid))
      swaps = swaps.concat(mergeSortHelper(array, mid + 1, end))

      let i = start
      let j = mid + 1
      let k = 0
      let temp = []

      while (i <= mid && j <= end) {
        if (array[i] <= array[j]) {
          temp[k] = array[i]
          i++
        } else {
          swaps.push([i, j])
          temp[k] = array[j]
          j++
        }
        k++
      }

      while (i <= mid) {
        temp[k] = array[i]
        i++
        k++
      }

      while (j <= end) {
        temp[k] = array[j]
        j++
        k++
      }

      for (let i = start; i <= end; i++) {
        array[i] = temp[i - start]
      }

      return swaps
    }

    function showBars(indices) {
      const mergesortDiv = document.getElementById('mergesort')
      mergesortDiv.innerHTML = ''
      for (let i = 0; i < array.length; i++) {
        const bar = document.createElement('div')
        bar.style.height = array[i] * 100 + '%'
        bar.classList.add('bar')
        if (indices && indices.includes(i)) {
          bar.style.backgroundColor = 'red'
        }
        mergesortDiv.appendChild(bar)
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
      if (window.location.hash === '#mergesort') {
        merge.init() // Initialize the visualization
      }
    })

    // Check the current hash on page load
    if (window.location.hash === '#mergesort') {
      merge.init() // Initialize the visualization
    }
  }
}
