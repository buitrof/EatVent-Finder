
//Constant declaration
//L = Link
//B = Base
//K = Key
//S = Sort
const L_B_TICKETMASTER = 'https://app.ticketmaster.com/discovery/v2/events.json?'
const K_TICKETMASTER = 'apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'
const S_DATE_ASC = 'sort=date,asc'
const ID_INPUT_TEXT = 'input_text'

//Let global declarations
let listOfEvents = []
let keywords = ''
let currentPage
let pagesFound = 10

//Definition of Event object to store Ticketmaster events
class Event {

    //Constructor for Event that  takes in the JSON from Ticketmaster
    constructor(event) {
        this.name = event.name  //Name of event
        this.url = event.url    //Ticketmaster link
        this.imageURL = event.images[5].url //Link to image of event
        this.localDate = event.dates.start.localDate //Local start date
        this.localTime = event.dates.start.localTime //Local start time
        this.dateTime = event.dates.start.dateTime   //World standard start time
        this.latitude = null //GPS Latitude coords, set to null, JSON may not contain
        this.longitude = null //GPS Longitude coords, set to null, JSON may not contain

        //JSON can contain a item containing _embedded or place do location 
        let venue = null
        if (typeof event._embedded != 'undefined') {
            venue = event._embedded.venues[0]
        } else if (typeof event.place != 'undefined') {
            venue = event.place
        }
        this.venueName = venue.name
        this.city = venue.city.name
        this.state = venue.state.name
        this.country = venue.country.name
        this.address = venue.address.line1
        typeof venue.location === 'undefined' ? null : this.longitude = venue.location.longitude
        typeof venue.location === 'undefined' ? null : this.latitude = venue.location.latitude
        this.postalCode = venue.postalCode
        //console.log(this)
    }

    //Returns is Event has both longitude and latitude
    hasLongAndLatt() {
        return this.longitude === null && this.latitude === null
    }

}

function getKeywords() {
    keywords = document.getElementById(ID_INPUT_TEXT).value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}

//Fetches events from Ticketmaster based on keyword search
//Then sets them into listOfEvents array
//in format word+word+word+....
function fetchTMEventList(keywords) {
    getKeywords()
    let link = `${L_B_TICKETMASTER}locale=*&${S_DATE_ASC}&${K_TICKETMASTER}&keyword=${getKeywords()}&page=${1}&countryCode=US`
    fetch(link)
        .then(r => r.json())
        .then(eventList => {
            let elementsFound = parseInt(eventList.page.totalElements)
            console.log(eventList.page)
            if (elementsFound > 0) {
                let eventsJSON = eventList._embedded.events
                eventsJSON.forEach(event => {
                    console.log(event)
                    listOfEvents.push(new Event(event))
                    let eventElem = document.createElement('div')
                    eventElem.className = 'uk-card uk-card-hover uk-card-body uk-grid'
                    eventElem.innerHTML = `
                    <img src="${event.images[0].url}" alt="Image" srcset="" class="card-image">
                    <div>
                    <h3 class="uk-card-title">${event.name}</h3>
                    <p><a href="${event.url}">Link</a></p>
                    <p>${event._embedded.venues[0].name}</p>
                    <p>${event.dates.start.localDate}</p>
                    </div>
                    `
                    document.getElementById('search-results').append(eventElem)
                })
            } else {
                console.log('Nothing found')
                document.getElementById('search-results').innerHTML = `
                <h3> Nothing found</h3>
                `
            }

        })
        .catch(e => console.error(e))
}
function getKeywords(id) {
    keywords = document.getElementById('input_text').value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}
function onClickPrevious() {
    if (currentPage > 1) {
        currentPage--
    }
    document.getElementById('current-page').value = currentPage
    document.getElementById('current-page').innerText = currentPage
    if(currentPage === 1) {
        document.getElementById('previous-page').classList.add('uk-invisible')
    }
    document.getElementById('next-page').classList.remove('uk-invisible')
}
function onClickNext() {
    if (currentPage < pagesFound) {
        currentPage++
    }
    document.getElementById('current-page').value = currentPage
    document.getElementById('current-page').innerText = currentPage
    if (currentPage === pagesFound) {
        document.getElementById('next-page').classList.add('uk-invisible')
    }
    document.getElementById('previous-page').classList.remove('uk-invisible')
}
function initPagination() {
    currentPage = 1
    document.getElementById('current-page').value = currentPage
    document.getElementById('current-page').innerText = currentPage
    document.getElementById('previous-page').classList.add('uk-invisible')
}
function addListenerToDocument() {
    document.addEventListener('click', ({ target }) => {
        if (target.id === "previous-btn") {
            onClickPrevious()
        } else if (target.id === 'next-btn') {
            onClickNext()
        }
    })
}
initPagination()
addListenerToDocument()
document.getElementById('submit').addEventListener('click', event => {
    event.preventDefault()
    fetchTMEventList()
    document.getElementById('input_text').value = ''
    document.getElementById('search-results').innerHTML = ``
})
