import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
  
const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"]
});

socket.on('tews', function (data) {
    console.log(data)
    const result = data.features[0]
    const maps = `https://google.com/maps/place/${result.geometry.coordinates[1]},${result.geometry.coordinates[0]}/@${result.geometry.coordinates[1]},${result.geometry.coordinates[0]},9.25z`
    const mag = 'M' + Number(result.properties.mag).toFixed(1)
    const depth = Number(Math.round(result.properties.depth)) + 'KM'
    const dateTime = result.properties.time
    const date = dateTime.split(' ')[0]
    const time = dateTime.split(' ')[1].split('.')[0]
    const newDateFormat = new Date(Date.UTC(date.split('-')[0], date.split('-')[1], date.split('-')[2]));
    const newDateTime = newDateFormat.toLocaleDateString('id-ID') + ' ' + time
    const place = result.properties.place
    const unified = newDateTime + ' : [BMKG] ' + mag + ' Kedalaman:' + depth + ' ' + place + '. Maps: ' + maps;
    var history = [];
    if (localStorage.getItem("history") !== null) {
        var get = JSON.parse(localStorage.getItem("history"));
        for(var i = 0;i < get.length;i++){
        history.push(get[i])
        }
    }
    history.push(unified)
    localStorage.setItem("history", JSON.stringify(history));
    $('#history').append(unified + "\n");
    console.log('Data Terakhir')
    console.log(maps)
    console.log(newDateTime)
    console.log(mag)
    console.log(depth)
    console.log(place)
})

setInterval(() => {
    socket.emit('realtime', socket.id)
}, 500);