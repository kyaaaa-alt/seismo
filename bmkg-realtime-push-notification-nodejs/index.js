const express = require('express')
const app = express()
const port = 82
const fetch = require('node-fetch');
const moment = require('moment');
const convert  = require('xml-js');

let currentTimeStamp = null

fetch(`https://bmkg-content-inatews.storage.googleapis.com/live30event.xml?t=${Date.now()}`, {
    Method: 'GET',
  }).then((response) => response.text()).then((data) => {
    const result = convert.xml2js(data, {compact: true, spaces: 4}).Infogempa.gempa[0]
    currentTimeStamp = result.waktu._text
    // console.log(result.waktu._text)
})

setInterval(()=> {
    
    fetch(`https://bmkg-content-inatews.storage.googleapis.com/live30event.xml?t=${Date.now()}`, {
        Method: 'GET',
    }).then((response) => response.text()).then(async(result) => {
        const data = convert.xml2js(result, {compact: true, spaces: 4}).Infogempa.gempa[0]
        const timeStamp = data.waktu._text
        if (currentTimeStamp != timeStamp) {
            currentTimeStamp = timeStamp
            const id = data.eventid._text
            const mag = 'M' + data.mag._text
            const depth = data.dalam._text + 'KM'
            var localDate = null
            await fetch(`https://bmkg-content-inatews.storage.googleapis.com/history.${id}.txt?t=${Date.now()}`, {
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
            const place = data.area._text
            console.log(' ')
            console.log('==Broadcast Push Notification Berhasil Dikirim==')
            // console.log('localdate : ', localDate)

            if (place == 'Java, Indonesia') {
                fetch(`http://api.geonames.org/findNearbyWikipediaJSON?lat=${data.lintang._text}&lng=${data.bujur._text}&username=naufspace`, {
                    Method: 'GET',
                }).then((response) => response.json()).then((data) => {
                    // console.log(data)
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
                            || loc == 'Mount Gede Pangrango National Park'
                            ) { 
    
                                const notificationData = localDate + ' (Waktu Lokal) | ' + 'Sekitar Cianjur dan Sukabumi' + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                
                                fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                                    Method: 'GET',
                                }).then((response) => response.json()).then((data) => {
                                    console.log(localDate, '| Sekitar Cianjur dan Sukabumi')
                                    console.log(mag + ' | Kedalaman: ' + depth)
                                    console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                                })
                                
                            } else {
    
                                const notificationData = localDate + ' (Waktu Lokal) | ' + 'Jawa Barat, Indonesia' + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                
                                fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                                    Method: 'GET',
                                }).then((response) => response.json()).then((data) => {
                                    console.log(localDate, '| ' + 'Jawa Barat, Indonesia')
                                    console.log(mag + ' | Kedalaman: ' + depth)
                                    console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                                })
                                
                            }
                        } else {
                            const notificationData = localDate + ' (Waktu Lokal) | ' + 'Jawa Barat, Indonesia' + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                                
                            fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                                Method: 'GET',
                            }).then((response) => response.json()).then((data) => {
                                console.log(localDate, '| ' + 'Jawa Barat, Indonesia')
                                console.log(mag + ' | Kedalaman: ' + depth)
                                console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                            })
                        }
                        // console.log('Data geoname : ')
                        // console.log(data)
                    } else {
                        const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                            
                        fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                            Method: 'GET',
                        }).then((response) => response.json()).then((data) => {
                            console.log(localDate, '| ' + place)
                            console.log(mag + ' | Kedalaman: ' + depth)
                            console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                        })
                    }
                }).catch((error) => {
                    console.error('Error:', error);
                    const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                            
                    fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                        Method: 'GET',
                    }).then((response) => response.json()).then((data) => {
                        console.log(localDate, '| ' + place)
                        console.log(mag + ' | Kedalaman: ' + depth)
                        console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                    })
                });
            } else {
                const notificationData = localDate + ' (Waktu Lokal) | ' + place + ' | ' + mag.replace('.', ',') + ' | Kedalaman: ' + depth;
                            
                fetch(`https://eew.nauf.space/pusher_notif/${notificationData}/${id}/broadcast/bmkg`, {
                    Method: 'GET',
                }).then((response) => response.json()).then((data) => {
                    console.log(localDate, '| ' + place)
                    console.log(mag + ' | Kedalaman: ' + depth)
                    console.log('https://inatews.bmkg.go.id/web/detail2?name='+id)
                })
            }
            
        }
        // console.log(currentTimeStamp)
        // console.log(timeStamp)
    });
}, 1000)

app.get('/', (req, res) => {
  res.send('Running...')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
console.log('Running...')