const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYmVuenkzMTYiLCJhIjoiY200YmIxeHdmMDFuejJqc2Y2ZjV4OGhweSJ9.neE6xg7Kpxx0MxYJPf1nxA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/benzy316/cm4bfcbss000o01s8gm9i9hs4',
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  //create marker
  const el = document.createElement('div');
  el.className = 'marker';

  //add marker
  new mapboxgl.Marker({
    Element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //add popup
  new mapboxgl.Popup({
    offset: 50,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //extends map to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 250,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
