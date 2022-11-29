let currentTimeStamp = null
var x2js = new X2JS();
fetch(`https://bmkg-content-inatews.storage.googleapis.com/live30event.xml?t=${Date.now()}`, {
    Method: 'GET',
  }).then((response) => response.text()).then((data) => {
    const result = x2js.xml_str2json(data).Infogempa.gempa[0]
    currentTimeStamp = result.waktu
})

setInterval(()=> {
    fetch(`https://bmkg-content-inatews.storage.googleapis.com/live30event.xml?t=${Date.now()}`, {
        Method: 'GET',
    }).then((response) => response.text()).then((result) => {
        const data = x2js.xml_str2json(result).Infogempa.gempa[0]
        const timeStamp = data.waktu
        if (currentTimeStamp != timeStamp) {
            currentTimeStamp = timeStamp
            const maps = `https://google.com/maps/place/${data.lintang},${data.bujur}/@${data.lintang},${data.bujur},9.25z`
            const bmkgLink = `https://inatews.bmkg.go.id/web/detail2?name=${data.eventid}`
            const mag = 'M' + data.mag
            const depth = data.dalam + 'KM'
            const dateTime = data.waktu
            const date = dateTime.split(' ')[0]
            const time = dateTime.split('  ')[1].split('.')[0]
            const newDateFormat = new Date(Date.UTC(date.split('/')[0], date.split('/')[1], date.split('/')[2], time.split(':')[0], time.split(':')[1], time.split(':')[2]));
            const newDateTime = newDateFormat.toLocaleString('id-ID') + ' (Waktu Lokal)'
            const place = data.area
            
            if (place == 'Java, Indonesia' && Number(data.mag) > 2) {
                fetch(`http://api.geonames.org/findNearbyWikipediaJSON?lat=${data.lintang}&lng=${data.bujur}&username=naufspace`, {
                    Method: 'GET',
                }).then((response) => response.json()).then((data) => {
                    if (data.geonames[0] !== undefined) {
                        const loc = data.geonames[0].title
                        if (loc == 'Cianjur'
                        || loc == 'Cianjur, Cianjur Regency' 
                        || loc == 'Mount Gede' 
                        || loc == 'Sindanglaya' 
                        || loc == 'Cipanas' 
                        || loc == 'Cianjur Regency' 
                        || loc == 'Mount Pangrango' 
                        || loc == 'Cibodas Botanical Garden' 
                        || loc == 'Cipanas Palace' 
                        || loc == 'Mayak (disambiguation)' 
                        || loc == 'Mande' 
                        || loc == 'Mount Parang' 
                        || loc == 'Cipetir, Sukabumi' 
                        || loc == 'Upper Cisokan Pumped Storage Power Plant' 
                        || loc == 'Cirata Dam' 
                        || loc == 'Cibodas' 
                        || loc == 'Sukabumi' 
                        || loc == 'Baros' 
                        ) {
                            const unified = newDateTime + '\n' + 'Cianjur/Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                            const withoutMaps = newDateTime + '\n' + 'Cianjur/Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth;
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
                            warning.volume = 1;
                            warning.play();
                            $('#warnBtn').show();
                            $('#error-message').attr('placeholder', 'Loading...');
                            $('#error-message').html('');
                            logger('[BMKG Real-Time Warning]')
                            logger(withoutMaps)
                            logger(bmkgLink)
                        } else {
                            const unified = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                            const withoutMaps = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                            ping.volume = 0.5;
                            ping.play();
                            $('#error-message').attr('placeholder', 'Loading...');
                            $('#error-message').html('');
                            logger('[BMKG Real-Time Warning]')
                            logger(withoutMaps)
                            logger(bmkgLink)
                        }
                    } else {
                        const unified = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                        const withoutMaps = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                        ping.volume = 0.5;
                        ping.play();
                        $('#error-message').attr('placeholder', 'Loading...');
                        $('#error-message').html('');
                        logger('[BMKG Real-Time Warning]')
                        logger(withoutMaps)
                        logger(bmkgLink)
                    }
                    console.log('Data geoname : ' + data)
                })
            } else {
                const unified = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                const withoutMaps = newDateTime + '\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                ping.volume = 0.5;
                ping.play();
                $('#error-message').attr('placeholder', 'Loading...');
                $('#error-message').html('');
                logger('[BMKG Real-Time Warning]')
                logger(withoutMaps)
                logger(bmkgLink)
            }
            
            console.log('==UPDATE==')
        }
        console.log(currentTimeStamp)
        console.log(timeStamp)
        console.log('====')
    });
}, 500)



// let currentTimeStamp = null
// fetch(`https://bmkg-content-inatews.storage.googleapis.com/lastQL.json?t=${Date.now()}`, {
//     Method: 'GET',
// }).then((response) => response.json()).then((result) => {
//     currentTimeStamp = result.features[0].properties.time
// });
// setInterval(()=> {
//     fetch(`https://bmkg-content-inatews.storage.googleapis.com/lastQL.json?t=${Date.now()}`, {
//         Method: 'GET',
//     }).then((response) => response.json()).then((data) => {
//         const timeStamp = data.features[0].properties.time
//         if (currentTimeStamp != timeStamp) {
//             currentTimeStamp = timeStamp
//             const result = data.features[0]
//             const maps = `https://google.com/maps/place/${result.geometry.coordinates[1]},${result.geometry.coordinates[0]}/@${result.geometry.coordinates[1]},${result.geometry.coordinates[0]},9.25z`
//             const mag = 'M' + Number(result.properties.mag).toFixed(1)
//             const depth = Number(Math.round(result.properties.depth)) + 'KM'
//             const dateTime = result.properties.time
//             const date = dateTime.split(' ')[0]
//             const time = dateTime.split(' ')[1].split('.')[0]
//             const newDateFormat = new Date(Date.UTC(date.split('-')[0], date.split('-')[1], date.split('-')[2], time.split(':')[0], time.split(':')[1], time.split(':')[2]));
//             const newDateTime = newDateFormat.toLocaleString('id-ID')
//             const place = result.properties.place
//             const unified = newDateTime + ' : ' + mag + ' Kedalaman: ' + depth + ' Lokasi: ' + place + '. ' + maps;
//             const withoutMaps = newDateTime + ' : ' + mag + ' Kedalaman: ' + depth + ' Lokasi: ' + place 
//             var history = [];
//             if (localStorage.getItem("history") !== null) {
//                 var get = JSON.parse(localStorage.getItem("history"));
//                 for(var i = 0;i < get.length;i++){
//                 history.push(get[i])
//                 }
//             }
//             history.push(' ')
//             history.push('[BMKG Real-Time Warning]')
//             history.push(unified)
//             localStorage.setItem("history", JSON.stringify(history));
//             $('#history').append(' ' + "\n");
//             $('#history').append('[BMKG Real-Time Warning]' + "\n");
//             $('#history').append(unified + "\n");
//             ping.volume = 1;
//             ping.play();
//             $('#error-message').attr('placeholder', 'Loading...');
//             $('#error-message').html('');
//             logger('[BMKG Real-Time Warning]')
//             logger(withoutMaps)
//             logger(maps)
//             // fetch(`http://api.geonames.org/findNearbyWikipediaJSON?lat=-6.84&lng=107.08&username=naufspace`, {
//             //     Method: 'GET',
//             // }).then((response) => response.json()).then((data) => {
                
//             // })
//         }
//         // console.log(currentTimeStamp)
//         // console.log(timeStamp)
//         // console.log('')
//     });
// }, 600)