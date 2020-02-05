
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
let currentPage = 0
let pagesFound
let index = 0

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
        //console.log(this.latitude)
    }

    //Returns is Event has both longitude and latitude
    hasLongAndLatt() {
        return this.longitude === null && this.latitude === null
    }

}


//Gets keywords from search bar
function getKeywords() {
    keywords = document.getElementById(ID_INPUT_TEXT).value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}

//Fetches events from Ticketmaster based on keyword search
//Then sets them into listOfEvents array
//in format word+word+word+....
function fetchTMEventList(keywords) {
    let link = `${L_B_TICKETMASTER}locale=*&${S_DATE_ASC}&${K_TICKETMASTER}&keyword=${keywords}&page=${currentPage}&countryCode=US`
    fetch(link)
        .then(r => r.json())
        .then(eventList => {
            let elementsFound = parseInt(eventList.page.totalElements)
            pagesFound = parseInt(eventList.page.totalPages) - 1
            //console.log(pagesFound)
            if (elementsFound > 0) {
                let eventsJSON = eventList._embedded.events
                document.getElementById('results-display').classList.remove('uk-hidden')
                document.getElementById('search-results').innerHTML = ''
                eventsJSON.forEach(event => {
                    //console.log(event)
                    let ev = new Event(event)
                    listOfEvents.push(ev)
                    buildEventCard(ev)
                })
            } else {
                console.log('Nothing found')
                document.getElementById('container').innerHTML = ''
                document.getElementById('search-results').innerHTML = `
                <h3> Nothing found</h3>
                `
            }
        })
        .catch(e => console.error(e))
}
function buildEventCard(event) {
    let eventElem = document.createElement('div')
    eventElem.className = 'uk-card uk-card-hover uk-card-body uk-grid'
    eventElem.innerHTML = `
    <img src="${event.imageURL}" alt="Image" srcset="" class=" uk-card-media-left card-image">
    <a href="./restaurants.index.html">
    <div class="uk-width-xlarge">
    <h3 class="uk-card-title uk-text-break">${event.name}</h3>
    <p><a href="${event.url}">Link</a></p>
    <p>${event.venueName}</p>
    <p>${event.localDate}</p>
    </div>
    </a>
    `
    index++
    document.getElementById('container').innerHTML = ''
    document.getElementById('search-results').append(eventElem)
    eventElem.setAttribute('id', 'item-' + index)
    console.log(eventElem)
}


function getKeywords(id) {
    keywords = document.getElementById('input_text').value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}

//Updates pagination and results on click of previous button
function onClickPrevious() {
    if (currentPage >= 0) {
        currentPage--
    }
    document.getElementById('current-page').value = currentPage + 1
    document.getElementById('current-page').innerText = currentPage +1
    if (currentPage  === 0) {
        document.getElementById('previous-page').classList.add('uk-invisible')
    }
    document.getElementById('next-page').classList.remove('uk-invisible')
    fetchTMEventList(keywords)
}

//Updates pagination and results on click of next button
function onClickNext() {
    if (currentPage < pagesFound) {
        currentPage++
    }
    document.getElementById('current-page').value = currentPage + 1
    document.getElementById('current-page').innerText = currentPage + 1
    if (currentPage === pagesFound) {
        document.getElementById('next-page').classList.add('uk-invisible')
    }
    document.getElementById('previous-page').classList.remove('uk-invisible')
    fetchTMEventList(keywords)
}

//Initilizes the paginaiton
function initPagination() {
    currentPage = 0
    document.getElementById('current-page').value = currentPage + 1
    document.getElementById('current-page').innerText = currentPage + 1
    document.getElementById('previous-page').classList.add('uk-invisible')
}

//Adds event listener to page
function addListenerToDocument() {
    document.addEventListener('click', ({ target }) => {
        if (target.id === "previous-btn") {
            onClickPrevious()
        } else if (target.id === 'next-btn') {
            onClickNext()
        } else if (target.id === 'submit') {
            getKeywords()
            fetchTMEventList(keywords)
            document.getElementById('input_text').value = ''
            document.getElementById('search-results').innerHTML = ``
            initPagination()
        }
    })
}
addListenerToDocument()
initPagination()

// document.getElementById('card-index').textContent = index