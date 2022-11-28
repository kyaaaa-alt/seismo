let currentTimeStamp = null
fetch(`https://bmkg-content-inatews.storage.googleapis.com/lastQL.json?t=${Date.now()}`, {
    Method: 'GET',
}).then((response) => response.json()).then((result) => {
    currentTimeStamp = result.features[0].properties.time
});
setInterval(()=> {
    fetch(`https://bmkg-content-inatews.storage.googleapis.com/lastQL.json?t=${Date.now()}`, {
        Method: 'GET',
    }).then((response) => response.json()).then((data) => {
        const timeStamp = data.features[0].properties.time
        if (currentTimeStamp != timeStamp) {
            currentTimeStamp = timeStamp
            const result = data.features[0]
            const maps = `https://google.com/maps/place/${result.geometry.coordinates[1]},${result.geometry.coordinates[0]}/@${result.geometry.coordinates[1]},${result.geometry.coordinates[0]},9.25z`
            const mag = 'M' + Number(result.properties.mag).toFixed(1)
            const depth = Number(Math.round(result.properties.depth)) + 'KM'
            const dateTime = result.properties.time
            const date = dateTime.split(' ')[0]
            const time = dateTime.split(' ')[1].split('.')[0]
            const newDateFormat = new Date(Date.UTC(date.split('-')[0], date.split('-')[1], date.split('-')[2], time.split(':')[0], time.split(':')[1], time.split(':')[2]));
            const newDateTime = newDateFormat.toLocaleString('id-ID') + ' ' + time
            const place = result.properties.place
            const unified = newDateTime + ' : ' + mag + ' Kedalaman:' + depth + ' ' + place + '. ' + maps;
            const withoutMaps = newDateTime + ' : ' + mag + ' Kedalaman:' + depth + ' ' + place 
            var history = [];
            if (localStorage.getItem("history") !== null) {
                var get = JSON.parse(localStorage.getItem("history"));
                for(var i = 0;i < get.length;i++){
                history.push(get[i])
                }
            }
            history.push(' ')
            history.push('[BMKG Real-Time Warning]')
            history.push(unified)
            localStorage.setItem("history", JSON.stringify(history));
            $('#history').append(' ' + "\n");
            $('#history').append('[BMKG Real-Time Warning]' + "\n");
            $('#history').append(unified + "\n");
            ping.volume = 1;
            ping.play();
            $('#error-message').attr('placeholder', 'Loading...');
            $('#error-message').html('');
            logger(new Date().toLocaleString('id-ID') + ' : [BMKG Real-Time Warning]')
            logger(withoutMaps)
            logger(maps)
        }
        // console.log(currentTimeStamp)
        // console.log(timeStamp)
        // console.log('')
    });
}, 500)