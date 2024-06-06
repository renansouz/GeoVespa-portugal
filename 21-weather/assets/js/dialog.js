function isPointInPolygon(point, polygon) {
  var x = point.lat, y = point.lng;
  var inside = false;
  for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][1], yi = polygon[i][0];
      var xj = polygon[j][1], yj = polygon[j][0];
      
      var intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
      if (intersect) inside = !inside;
  }
  return inside;
}

function createDialog() {
  var dialog = document.createElement('div');
  dialog.classList.add('dialog');

  dialog.innerHTML = `
      <div class="dialog-content">
          <p>Calcular Posição</p>
          <a href="#" class="close-dialog"><i class="fa fa-times"></i></a>
          <input type="text" id="longitude" placeholder="Longitude">
          <input type="text" id="latitude" placeholder="Latitude">
          <button id="submitButton">Enviar</button>
      </div>
  `;

  document.body.appendChild(dialog);

  var closeLink = document.querySelector('.close-dialog');
  closeLink.addEventListener('click', function(event) {
      event.preventDefault(); 
      dialog.remove();
  });

  document.getElementById('submitButton').addEventListener('click', function() {
      var longitudeValue = parseFloat(document.getElementById('longitude').value);
      var latitudeValue = parseFloat(document.getElementById('latitude').value);

      map.setView([latitudeValue, longitudeValue], 8);
      var singleMark = L.marker([latitudeValue, longitudeValue])
      
      map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
              map.removeLayer(layer);
          }
      });
      
      singleMark.addTo(map);

      var point = { lat: latitudeValue, lng: longitudeValue };
      for (var district in districtLayers) {
          var districtLayer = districtLayers[district];
          districtLayer.eachLayer(function(layer) {
              if (isPointInPolygon(point, layer.feature.geometry.coordinates[0])) {
                  highlightDistrict(district);
              }
          });
      }

      dialog.remove();
  });
}

document.getElementById('openDialog').addEventListener('click', function() {
  createDialog();
});
