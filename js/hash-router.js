const pageTitle = 'JS Single Page Application Router'
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
  insertionsort: {
    template: '/templates/insertionsort.html',
    title: 'Insertion Sort | ' + pageTitle,
    description: 'Insertion Sort',
  },
  bubblesort: {
    template: '/templates/bubblesort.html',
    title: 'Bubble Sort | ' + pageTitle,
    description: 'Bubble Sort',
  },
  selectionsort: {
    template: '/templates/selectionsort.html',
    title: 'Selection Sort | ' + pageTitle,
    description: 'Selection Sort',
  },
  mergesort: {
    template: '/templates/mergesort.html',
    title: 'Merge Sort | ' + pageTitle,
    description: 'Merge Sort',
  },
}

const locationHandler = async () => {
  var location = window.location.hash.replace('#', '')
  if (location.length == 0) {
    location = '/'
  }
  const route = routes[location] || routes['404']
  const html = await fetch(route.template).then(response => response.text())
  document.getElementById('content').innerHTML = html

  // remove old script if it exists
  const oldScript = document.getElementById('dynamic-script')
  if (oldScript) {
    oldScript.remove()
  }

  // create new script based on location
  const script = document.createElement('script')
  script.id = 'dynamic-script'
  if (location === 'bubblesort') {
    script.src = '/js/bubble.js'
  } else if (location === 'insertionsort') {
    script.src = '/js/insertion.js'
  } else if (location === 'mergesort') {
    script.src = '/js/merge.js'
  } else if (location === 'selectionsort') {
    script.src = '/js/selection.js'
  }

  // append new script to body
  document.body.appendChild(script)

  script.onload = function () {
    // dispatch DOMContentLoaded event after script has loaded
    document.dispatchEvent(new Event('DOMContentLoaded'))

    document.title = route.title
    document
      .querySelector('meta[name="description"]')
      .setAttribute('content', route.description)
  }
}

window.addEventListener('hashchange', locationHandler)
locationHandler()
