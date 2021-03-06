import React from 'react';
import StarRatingComponent from 'react-star-rating-component';

class Map extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      image: {
        url: 'https://res.cloudinary.com/cloudlicious/image/upload/v1476768624/marker-dot-3_t5or3e.png',
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      },
      restaurants: []
    };
  }

  componentDidUpdate(){
    var restaurants = this.props.restaurants;
    if(restaurants && restaurants.length !== this.state.restaurants.length){
      const mapDOMNode = this.refs.map;
      const mapOptions = {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      };
      var map = new google.maps.Map(mapDOMNode, mapOptions);
      var markers = [], infoWindowContent = [];
      restaurants.forEach(res=>{
        if(res.location.indexOf('San Francisco') !== -1){
          markers.push([res.name, res.get_lng_lat[0], res.get_lng_lat[1]]);
          infoWindowContent.push([
            `<div class="map-marker-info">` +
            `<h3>${res.name}</h3>` +
            `<span>${this.starRating(res.rating)}</span>` +
            `<p>${res.price_range}</p>` +
            `<h2>${res.phone_number}</h2>` +
            `</div>`]);
          }
        });
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        const bounds = new google.maps.LatLngBounds();
        const infoWindow = new google.maps.InfoWindow({pixelOffset: new google.maps.Size(-19, 0)});

        for(var i = 0; i < markers.length; i++ ) {
          var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
          bounds.extend(position);
          marker = new google.maps.Marker({
            position: position,
            map: map,
            icon: this.state.image,
            title: markers[i][0]
          });
          google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
              infoWindow.setContent(infoWindowContent[i][0]);
              infoWindow.open(map, marker);
            };
          })(marker, i));
          map.fitBounds(bounds);
        }
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
          this.setZoom(11);
          google.maps.event.removeListener(boundsListener);
        });
      this.setState({restaurants: restaurants});
    }
  }

  starRating(rating){
    let stars = {
      1: '✪',
      2: '✪✪',
      3: '✪✪✪',
      4: '✪✪✪✪',
      5: '✪✪✪✪✪'
    };
    return stars[rating];
  }

  loader(){
    if(this.state.restaurants){
      return (
        <div className="map-restaurants-empty">
          <div className='map-loader'></div>
        </div>
      );
    }
  }

  render(){
    return (
      <div>
        {this.loader()}
        <div className="map-restaurants" ref="map"></div>
      </div>
    );
  }
}

export default Map;
