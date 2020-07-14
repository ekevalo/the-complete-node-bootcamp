/* eslint-disable*/
export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZWtuaXZvYSIsImEiOiJja2NlZDJ1czgwNzU3MnNwYms4amZqZXd0In0.kXjIojq85vsnibTwyOn5Ow';
  const map = new mapboxgl.Map({
    container: 'map',
    //style: 'mapbox://styles/eknivoa/ckcedmihn0kva1ipk21ly70nq',
    style: 'mapbox://styles/eknivoa/ckceogthy14mt1irkr8yd2lvk',
    scrollZoom: false,
    //   center: [-118.911434, 34.405886],
    //   zoom: 10,
    //   interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add a popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
