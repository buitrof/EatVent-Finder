
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
      console.log(restaurantsLink)
      let restaurantsFound = parseInt(restaurantsLink.restaurants.length)
      //console.log(restaurantsFound)
      if (restaurantsFound > 0) {
        let restaurantsJSON = restaurantsLink.restaurants
        restaurantsJSON.forEach(restaurant => {
          console.log(new Restaurant(restaurant.restaurant))
        })
      } else {
        console.log('Nothing found')
      }
    })
    .catch(e => console.error(e))

restaurants.forEach(arr =>) {
  var restaurant = 
}
}
getRestaurantChoices('47.60577', '-122.329437')

