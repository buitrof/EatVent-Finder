
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

//Fetches events from Ticketmaster based on keyword search
//Then sets them into listOfEvents array
//in format word+word+word+....
function fetchTMEventList(keywords) {
    let link = `${L_B_TICKETMASTER}locale=en-us&${S_DATE_ASC}&${K_TICKETMASTER}&keyword=${keywords}&page=${1}&countryCode=US`
    fetch(link)
        .then(r => r.json())
        .then(eventList => {
            let elementsFound = parseInt(eventList.page.totalElements)
            //console.log(eventList.page)
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

