var request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
request.open('GET', 'https://angry-mcclintock-48fbfa.netlify.com/.netlify/functions/server/house?quantity=50', true)

var mymap = L.map('mapid').setView([51.108, 17.038], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoib2xob3RvcnRvIiwiYSI6ImNqdjN4Zm1zNDAwdHczeW8xYTB3NWczcDgifQ.M0FmN7RguHaSB4r_1iPNfQ'
}).addTo(mymap);


request.onload = function () {
    var data = JSON.parse(this.response);
    data.forEach(ad => {
        var location = L.latLng(ad.Location[0], ad.Location[1]);

        var marker = L.marker(ad.Location.split(','))
        .addTo(mymap);

        // marker.on('click', () => { 
        //     document.getElementById("details").innerHTML = `
        //     <div class='card'>
        //     <a href='${ad.Link}'>
        //         <img src='${ad.Thumbnail}' >
        //     </a>
        //     <div class='container'>
        //         <h4><b>${ad.Price}</b></h4> 
        //         <p>Size: ${ad.Size} m/2</p> 
        //     </div>
        //     </div>`;
        // });

        marker.on('click', () => {
            
            var picture_content = `
            <img src="${ad.Thumbnail}" />
            `

            var body_content = `
            <p>Price: ${ad.Price}</p>
            <p>Area: ${ad.Size}</p>
            <p>Seller: ${ad.Seller}</p>
            `

            var footer_content = `
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
