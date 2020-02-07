
//Constant declaration
//L = Link
//B = Base
//K = Key
//S = Sort
const L_B_TICKETMASTER = 'https://app.ticketmaster.com/discovery/v2/events.json?'
const K_TICKETMASTER = 'apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'
const S_DATE_ASC = 'sort=date,asc'
const ID_INPUT_TEXT = 'input_text'

const L_B_ZOMATO = 'https://developers.zomato.com/api/v2.1/search?'
const K_ZOMATO = 'apikey=39e17219549ea152e0fb9205ede5e31f'
const S_RATING = 'sort=rating'

//Let global declarations
let listOfEvents = []
let keywords = ''
let currentPage = 0
let pagesFound
let index = -1

let listOfRest = []
let latt = ''
let long = ''

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

class Restaurant {

    constructor(restaurant) {
        this.name = restaurant.name
        this.user_rating = restaurant.user_rating
        this.address = restaurant.location.address
        this.phone_numbers = restaurant.phone_numbers
        this.latitude = null
        this.longitude = null
        this.cuisines = restaurant.cuisines
        this.highlights = restaurant.highlights
        // this.user_rating = restaurant.user_rating
        this.photos = restaurant.photos
        //console.log(this)
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
                    // console.log(event)
                    let ev = new Event(event)
                    listOfEvents.push(ev)
                    buildEventCard(ev, listOfEvents.length-1)
                    // getLocation(ev, listOfEvents.length-1)
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

function buildEventCard(event, id) {
    index++
    let eventElem = document.createElement('div')
    eventElem.className = 'uk-card uk-card-hover uk-card-body uk-grid setup'
    eventElem.innerHTML = `
    <img src="${event.imageURL}" alt="Image" srcset="" class=" uk-card-media-left card-image">
    <div class="uk-width-xlarge">
    <h3 class="uk-card-title uk-text-break event-id">${event.name}</h3>
    <p><a href="${event.url}">Link</a></p>
    <p>${event.venueName}</p>
    <p>${event.localDate}</p>
    <button value="${index}" id="item-${index}">See top 10 restaurants</button>
    </div>
    `
    document.getElementById('container').innerHTML = ''
    document.getElementById('search-results').append(eventElem)
}

function getRestaurantChoices(latt, long) {
    let link = `${L_B_ZOMATO}lat=${latt}&lon=${long}&${S_RATING}&${K_ZOMATO}`
    fetch(link)
        .then(d => d.json())
        .then(restaurantsLink => {
            // console.log(restaurantsLink)
            let restaurantsFound = parseInt(restaurantsLink.restaurants.length)
            // console.log(restaurantsFound)
            if (restaurantsFound > 0) {
                let restaurantsJSON = restaurantsLink.restaurants
                restaurantsJSON.forEach(({ restaurant }) => {
                    let rest = new Restaurant(restaurant)
                    listOfRest.push(rest)
                    BuildRestCard(rest)
                })
            } else {
                console.log('Nothing found')
            }
        })
        .catch(e => console.error(e))
}

function BuildRestCard(rest) {
    let restaurantResultElem = document.createElement('div')
    restaurantResultElem.className = 'uk-card uk-card-hover uk-card-body uk-grid setup'
    restaurantResultElem.innerHTML = `
            <div>
              <div class="uk-position-relative uk-visible-toggle uk-light food-image " tabindex="-1" uk-slideshow>
               <ul class="uk-slideshow-items food-image">
               <li>
                 <img data-src="${rest.photos[0].photo.url}" class="uk-card-media-left food-image" alt="" uk-cover uk-img="target: !ul > :last-child, !* +*">
              </li>
              <li>
                 <img data-src="${rest.photos[1].photo.url}" class="uk-card-media-left card-image" alt="" uk-cover uk-img="target: !* -*, !* +*">
               </li>
               <li>
                 <img data-src="${rest.photos[2].photo.url}" class="uk-card-media-left card-image" alt="" uk-cover uk-img="target: !* -*, !ul > :first-child">
              </li>
              <li>
                 <img data-src="${rest.photos[3].photo.url}" class="uk-card-media-left card-image" alt="" uk-cover uk-img="target: !* -*, !ul > :first-child">
              </li>
              </ul>
              <a class="uk-position-center-left uk-position-small uk-hidden-hover" href="#" uk-slidenav-previous uk-slideshow-item="previous"></a>
              <a class="uk-position-center-right uk-position-small uk-hidden-hover" href="#" uk-slidenav-next uk-slideshow-item="next"></a>
              </div>
                <h3 class="uk-card-title">${rest.name}</h3>
                <p>Rating: ${rest.user_rating.aggregate_rating}</p>
                <p>Highlights: ${rest.highlights}</p>
                <p>Cuisines: ${rest.cuisines}</p>
                <p>Address: ${rest.address}</p>
                <p>Phone: ${rest.phone_numbers}</p>
                </div>
                 `
    document.getElementById('search-results').append(restaurantResultElem)
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
    document.getElementById('current-page').innerText = currentPage + 1
    if (currentPage === 0) {
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
        let regex = /item-[0-9]/
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
        } else if(regex.test(target.id)) {
            let cardIndex = parseInt(target.value)
            latt = listOfEvents[cardIndex].latitude
            long = listOfEvents[cardIndex].longitude
            document.getElementById('contain-two').innerHTML = ''
            document.getElementById('search-results').innerHTML = getRestaurantChoices(latt, long)
        } 
    })
}
addListenerToDocument()
initPagination()