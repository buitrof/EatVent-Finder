const base = 'https://app.ticketmaster.com/discovery/v1/events.json?'
const api = '&apikey=TqPIy9GVqFGripe0WWubsOyxCKeuGtZf'
let keywords = ''
let id = 'input_text'

function getKeywords(id) {
    keywords = document.getElementById('input_text').value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}

function buildURL() {
    getKeywords('input_text')
    let url = base + getKeywords() + api
    console.log(getKeywords())
    console.log(url)
}

document.getElementById('submit').addEventListener('click', event => {
    event.preventDefault()
    buildURL()
    document.getElementById('input_text').value = ''
})