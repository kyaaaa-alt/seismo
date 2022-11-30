const privateTrigger = document.getElementById('privateTrigger');
var privateTriggerClicked = false;
privateTrigger.addEventListener('click', function handleClick() {
  privateTriggerClicked = true;
  $('#riwayatlabel').html('Riwayat Alarm');
});

let currentTimeStamp = null
let localDate = null
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
    }).then((response) => response.text()).then(async(result) => {
        const data = x2js.xml_str2json(result).Infogempa.gempa[0]
        const timeStamp = data.waktu
        if (currentTimeStamp != timeStamp) {
            currentTimeStamp = timeStamp
            const id = data.eventid
            const maps = `https://google.com/maps/place/${data.lintang},${data.bujur}/@${data.lintang},${data.bujur},9.25z`
            const bmkgLink = `https://inatews.bmkg.go.id/web/detail2?name=${data.eventid}`
            const magnitude = data.mag
            const mag = 'M' + data.mag
            const depth = data.dalam + 'KM'
            await fetch(`https://bmkg-content-inatews.storage.googleapis.com/history.${id}.txt`, {
                Method: 'GET',
            }).then((response) => response.text()).then((data) => {
                const regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/gi;
                const match = data.match(regex)
                const dateTimeTmp = match[match.length - 1]
                const utcFmt = "YYYY-MM-DD HH:mm:ss";
                const localFmt = 'DD MMM YYYY HH:mm:ss';
                const m = moment.utc(dateTimeTmp, utcFmt);
                localDate = m.local().locale('id').format(localFmt)
            })
            const place = data.area

            console.log('==UPDATE==')
            console.log('localdate : ', localDate)

            if (place == 'Java, Indonesia') {
                fetch(`https://secure.geonames.org/findNearbyWikipediaJSON?lat=${data.lintang}&lng=${data.bujur}&username=naufspace`, {
                    Method: 'GET',
                }).then((response) => response.json()).then((data) => {
                    if (Object.prototype.hasOwnProperty.call(data, "geonames")) {
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
                                if (Number(magnitude) > 2) {
                                    const unified = localDate + ' (Waktu Lokal)\n' + 'Sekitar Cianjur & Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                                    const withoutMaps = localDate + ' (Waktu Lokal)\n' + 'Sekitar Cianjur & Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth;
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
                                    if (privateTriggerClicked) {
                                        warning.volume = 1;
                                        warning.play();
                                    } else {
                                        ping.volume = 0.2;
                                        ping.play();
                                    }
                                    $('#warnBtn').show();
                                    $('#error-message').attr('placeholder', 'Loading...');
                                    $('#error-message').html('');
                                    logger('[BMKG Real-Time Warning]')
                                    logger(withoutMaps)
                                    logger(bmkgLink)
    
                                    // const notificationData = localDate + ' (Waktu Lokal) | ' + 'Cianjur Sukabumi' + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                    // if (md.os() != 'iOS') {
                                    //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                                    //         Method: 'GET',
                                    //     }).then((response) => response.json()).then((data) => {
                                    //         console.log(data, notificationData)
                                    //     })
                                    // }
                                } else {
                                    const unified = localDate + ' (Waktu Lokal)\n' + 'Sekitar Cianjur & Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                                    const withoutMaps = localDate + ' (Waktu Lokal)\n' + 'Sekitar Cianjur & Sukabumi' + ', ' + mag + ', Kedalaman: ' + depth;
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
                                    ping.volume = 0.2;
                                    ping.play();
                                    $('#error-message').attr('placeholder', 'Loading...');
                                    $('#error-message').html('');
                                    logger('[BMKG Real-Time Warning]')
                                    logger(withoutMaps)
                                    logger(bmkgLink)
    
                                    // const notificationData = localDate + ' (Waktu Lokal) | ' + 'Cianjur Sukabumi' + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                    // if (md.os() != 'iOS') {
                                    //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                                    //         Method: 'GET',
                                    //     }).then((response) => response.json()).then((data) => {
                                    //         console.log(data, notificationData)
                                    //     })
                                    // }
                                }
                                
                            } else {
                                const unified = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                                const withoutMaps = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                                ping.volume = 0.2;
                                ping.play();
                                $('#error-message').attr('placeholder', 'Loading...');
                                $('#error-message').html('');
                                logger('[BMKG Real-Time Warning]')
                                logger(withoutMaps)
                                logger(bmkgLink)
    
                                // const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                // if (md.os() != 'iOS') {
                                //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                                //         Method: 'GET',
                                //     }).then((response) => response.json()).then((data) => {
                                //         console.log(data, notificationData)
                                //     })
                                // }
                            }
                        } else {
                            const unified = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                            const withoutMaps = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                            ping.volume = 0.2;
                            ping.play();
                            $('#error-message').attr('placeholder', 'Loading...');
                            $('#error-message').html('');
                            logger('[BMKG Real-Time Warning]')
                            logger(withoutMaps)
                            logger(bmkgLink)
    
                            // const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                            // if (md.os() != 'iOS') {
                            //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                            //         Method: 'GET',
                            //     }).then((response) => response.json()).then((data) => {
                            //         console.log(data, notificationData)
                            //     })
                            // }
                        }
                        console.log('Data geoname : ')
                        console.log(data)
                    } else {
                        const unified = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                        const withoutMaps = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                        ping.volume = 0.2;
                        ping.play();
                        $('#error-message').attr('placeholder', 'Loading...');
                        $('#error-message').html('');
                        logger('[BMKG Real-Time Warning]')
                        logger(withoutMaps)
                        logger(bmkgLink)
                    }
                    
                }).catch((error) => {
                    console.error('Error:', error);
                    const unified = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                    const withoutMaps = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                    ping.volume = 0.2;
                    ping.play();
                    $('#error-message').attr('placeholder', 'Loading...');
                    $('#error-message').html('');
                    logger('[BMKG Real-Time Warning]')
                    logger(withoutMaps)
                    logger(bmkgLink)

                    // const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                    // if (md.os() != 'iOS') {
                    //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                    //         Method: 'GET',
                    //     }).then((response) => response.json()).then((data) => {
                    //         console.log(data, notificationData)
                    //     })
                    // }
                });
            } else {
                const unified = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth + ' ' + bmkgLink;
                const withoutMaps = localDate + ' (Waktu Lokal)\n' + place + ', ' + mag + ', Kedalaman: ' + depth;
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
                ping.volume = 0.2;
                ping.play();
                $('#error-message').attr('placeholder', 'Loading...');
                $('#error-message').html('');
                logger('[BMKG Real-Time Warning]')
                logger(withoutMaps)
                logger(bmkgLink)

                // const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                // if (md.os() != 'iOS') {
                //     fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/${localStorage.getItem('deviceId')}/bmkg`, {
                //         Method: 'GET',
                //     }).then((response) => response.json()).then((data) => {
                //         console.log(data, notificationData)
                //     })
                // }
            }
        }
        // console.log(currentTimeStamp)
        // console.log(timeStamp)
    });
}, 1000)

