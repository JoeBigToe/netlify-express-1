var request = new XMLHttpRequest();
var url = 'https://house-bubbler.com';
// var url = 'http://localhost:3000';

var markersMap = [];
// Open a new connection, using the GET request on the URL endpoint
request.open('GET', `${url}/.netlify/functions/server/house/50`, true);


var mymap = L.map('mapid').setView([51.108, 17.038], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoib2xob3RvcnRvIiwiYSI6ImNqdjN4Zm1zNDAwdHczeW8xYTB3NWczcDgifQ.M0FmN7RguHaSB4r_1iPNfQ'
}).addTo(mymap);


function markAsRead(id) {
    var update_request = new XMLHttpRequest();

    update_request.open('POST', `${url}/.netlify/functions/server/house/${id}`, true);
    
    update_request.onload = function () {
        var marker = markersMap[id];
        marker.options.icon = blueIcon;

        mymap.removeLayer(markersMap[id]);
        marker.addTo(mymap);
    }

    update_request.send();

}

function markAsDeleted(id) {
    
    var update_request = new XMLHttpRequest();

    update_request.open('DELETE', `${url}/.netlify/functions/server/delete/${id}`, true);
    
    update_request.onload = function () {
        
        mymap.removeLayer(markersMap[id]);
        
    }
    
    update_request.send();
}

request.onload = function () {
    var data = JSON.parse(this.response);
    data.forEach(ad => {

        if (ad.NewAd === 1) {
            var marker = L.marker(ad.Location.split(','), {icon: greenIcon}).addTo(mymap);
            // var marker = L.marker(ad.Location.split(',')).addTo(mymap);
        } else {
            var marker = L.marker(ad.Location.split(','), {icon: blueIcon}).addTo(mymap);
        }

        markersMap[ad._id] = marker;

        marker.on('click', () => {

            var picture_content = `
            <a href="${ad.Link}">    
                <img src="${ad.Thumbnail}" />
            </a>
            `

            var body_content = `
            <p>Price: ${ad.Price}</p>
            <p>Area: ${ad.Size}</p>
            <p>Seller: ${ad.Seller}</p>
            `

            var footer_content = `
            <button type="button" onClick="markAsDeleted('${ad._id}')" class="btn btn-secondary">Delete</button>
            <button type="button" onClick="markAsRead('${ad._id}')" class="btn btn-secondary">Mark as Read</button>
            <a href="${ad.Link}">    
                <button type="button" class="btn btn-secondary">Open</button>
            </a>
            `

            $('.modal-title').html(ad.Title);
            $('#modal-body-picture').html(picture_content);
            $('#modal-body-content').html(body_content);
            $('.modal-footer').html(footer_content);
            
            $('#exampleModalCenter').modal('show');
        });

    });
}


request.send();
