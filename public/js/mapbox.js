const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1IjoibW9oc2VuNzltb3IiLCJhIjoiY2tsZXM1M2RqMTNmdzJ2bWo0dHlkZzY4OSJ9.ffRzrde09rVVoeD6urcglQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  scroll: false,
});

const bound = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  const div = document.createElement("div");
  div.className = "marker";
  new mapboxgl.Marker({
    element: div,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  bound.extend(loc.coordinates);
});

map.fitBounds(bound, {
  padding: {
    top: 200,
    bottom: 200,
    left: 100,
    right: 100,
  },
});
