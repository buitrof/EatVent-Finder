
const L_B_ZOMATO = 'https://developers.zomato.com/api/v2.1/search?'
const K_ZOMATO = 'apikey=39e17219549ea152e0fb9205ede5e31f'
const S_RATING = 'sort=rating'


let listOfRest = []
let latt = ''
let long = ''

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
          BuildEventCard(rest)
        })
      } else {
        console.log('Nothing found')
      }
    })
    .catch(e => console.error(e))
}

function BuildEventCard(rest) {
  console.log(rest)
  let restaurantResultElem = document.createElement('div')
  restaurantResultElem.className = 'uk-card uk-card-hover uk-card-body uk-grid'
  restaurantResultElem.innerHTML = `
            <div>
                <img src="${rest.photos[0].photo.url}" alt="Image" srcset="" class="card-image">
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



getRestaurantChoices('47.60577', '-122.329437')