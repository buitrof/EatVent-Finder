
//Constant declaration
//L = Link
//B = Base
//K = Key
//S = Sort
const L_B_TICKETMASTER = 'https://app.ticketmaster.com/discovery/v2/events?'
const K_TICKETMASTER = 'apikey=7elxdku9GGG5k8j0Xm8KWdANDgecHMV0'
const S_DATE_ASC = 'sort=date,asc'
const ID_INPUT_TEXT = 'input_text'

//Let global declarations
let listOfEvents = []
let keywords = ''


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
        //Sets location data for  evenet if it exists
        if (typeof event._embedded != 'undefined') {
            let venue = event._embedded.venues[0]
            this.venueName = venue.name
            this.city = venue.city.name
            this.state = null
            typeof venue.state === 'undefined' ? null : this.state = venue.state.name
            this.country = venue.country.name
            this.address = venue.address.line1
            typeof venue.location === 'undefined' ? null : this.longitude = venue.location.longitude
            typeof venue.location === 'undefined' ? null : this.latitude = venue.location.latitude
            this.postalCode = venue.postalCode
        }
        else if (typeof event.place != 'undefined') {
            let place = event.place
            this.venueName = null
            this.cty = place.city.name
            this.country = place.country.name
            this.address = place.address.line1
            typeof place.location === 'undefined' ? null : this.longitude = place.location.longitude
            typeof place.location === 'undefined' ? null : this.latitude = place.location.latitude
            this.postalCode = place.postalCode
        }
    }

    //Returns is Event has both longitude and latitude
    hasLongAndLatt() {
        return this.longitude === null && this.latitude === null
    }

}

//Fetches events from Ticketmaster based on keyword search
//Then sets them into listOfEvents array
//in format word+word+word+....
function fetchTMEventList(keywords) {
    let link = `${L_B_TICKETMASTER}locale=*&${S_DATE_ASC}&${K_TICKETMASTER}&keyword=${keywords}`
    fetch(link)
        .then(r => r.json())
        .then(eventList => {
            let elementsFound = parseInt(eventList.page.totalElements)
            if (elementsFound > 0) {
                let eventsJSON = eventList._embedded.events
                eventsJSON.forEach(event => {
                    //console.log(event)
                    listOfEvents.push(new Event(event))
                });
            } else {
                console.log('Nothing found')
            }

        })
        .catch(e => console.error(e))
}

function getKeywords(id) {
    keywords = document.getElementById('input_text').value
    keywords = keywords.replace(/\s+/g, '+')
    return keywords
}

