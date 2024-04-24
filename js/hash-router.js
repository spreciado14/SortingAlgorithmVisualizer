const pageTitle = 'JS Single Page Application Router'
// create an object that maps the url to the template, title, and description
const routes = {
  404: {
    template: '/templates/404.js',
    title: '404 | ' + pageTitle,
    description: 'Page not found',
  },
  '/': {
    template: '/templates/index.html',
    title: 'Home | ' + pageTitle,
    description: 'This is the home page',
  },
  about: {
    template: '/templates/about.html',
    title: 'About Us | ' + pageTitle,
    description: 'This is the about page',
  },
  contact: {
    template: '/templates/contact.html',
    title: 'Contact Us | ' + pageTitle,
    description: 'This is the contact page',
  },
  bubblesort: {
    template: '/templates/bubblesort.html',
    title: 'Bubble Sort | ' + pageTitle,
    description: 'Bubble Sort',
    css: '/styles/style.css', // Path to the CSS file
    script: '/js/bubble.js', // Path to the JavaScript file
  },
}

// create a function that watches the url and calls the urlLocationHandler
const locationHandler = async () => {
  // get the url path, replace hash with empty string
  var location = window.location.hash.replace('#', '')
  // if the path length is 0, set it to primary page route
  if (location.length == 0) {
    location = '/'
  }
  // get the route object from the routes object
  const route = routes[location] || routes['404']
  // get the html from the template
  const html = await fetch(route.template).then(response => response.text())
  // set the content of the content div to the html
  document.getElementById('content').innerHTML = html
  // set the title of the document to the title of the route
  document.title = route.title
  // set the description of the document to the description of the route
  document
    .querySelector('meta[name="description"]')
    .setAttribute('content', route.description)
  // Check if the route has a JavaScript file associated with it
  if (route.script) {
    // Load the JavaScript file dynamically
    // Load the JavaScript file dynamically
    const pseudocode = getBubbleSortPseudocode()
    const pseudocodeElement = document.createElement('pre')
    const lines = pseudocode.split('\n')
    const content = document.getElementById('content')
    lines.forEach((line, index) => {
      const lineDiv = document.createElement('div')
      // Replace leading spaces with non-breaking spaces
      const leadingSpaces = line.match(/^ */)[0].length
      line = '&nbsp;'.repeat(leadingSpaces) + line.trim()
      lineDiv.innerHTML = line
      lineDiv.id = `line-${index}` // Add unique id to each line

      content.appendChild(lineDiv)
    })

    let currentLine = 0
    const moveHighlight = () => {
      // Remove the highlight from the current line
      document.getElementById(`line-${currentLine}`).className = ''

      // Move to the next line
      currentLine++

      // If we've reached the end, go back to the start
      if (currentLine >= lines.length) {
        currentLine = 0
      }

      // Add the highlight to the new line
      document.getElementById(`line-${currentLine}`).className = 'highlight'
    }

    setInterval(moveHighlight, 1000) // Change 1000 to the number of milliseconds you want to wait between moves

    const script = document.createElement('script')
    script.src = route.script
    document.getElementById('content').appendChild(pseudocodeElement)
    document.body.appendChild(script)
    script.onload = init // Call init() function after script is loaded
  }
}
// create a function that watches the hash and calls the urlLocationHandler
window.addEventListener('hashchange', locationHandler)

// call the urlLocationHandler to load the page
locationHandler()
