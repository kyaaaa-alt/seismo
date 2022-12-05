var warning = document.getElementById("warning");
var ping = document.getElementById("ping");
var noSleep = new NoSleep();

function iOS() {
  warning.play();
  warning.pause();
  warning.currentTime = 0;
  ping.play();
  ping.pause();
  ping.currentTime = 0;
  if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().then( response => {
      if (response == "denied") {
        const deniedModal = new bootstrap.Modal('#deniedModal', {
          keyboard: false,
          backdrop: 'static'
        })
        deniedModal.show();
      } 
    })
  }
  noSleep.enable();
}


function android() {
  warning.play();
  warning.pause();
  warning.currentTime = 0;
  ping.volume = 0.03;
  ping.play();
  ping.pause();
  ping.currentTime = 0;
  noSleep.enable();
}

function panduan() {
  warning.play();
  warning.pause();
  warning.currentTime = 0;
  ping.play();
  ping.pause();
  ping.currentTime = 0;
  noSleep.enable();
  const panduanModal = new bootstrap.Modal('#panduanModal', {
    keyboard: false,
    backdrop: 'static'
  })
  panduanModal.show();
}

$('#stopBtn').attr('disabled', true);
$('#startBtn').attr('disabled', false);

function displayClock() {
  var display = new Date().toLocaleString('en-GB');
  $('#jam').html(display)
  setTimeout(displayClock, 1000);
}
displayClock()
$('#tidakaktif').show();
$('#aktif').hide();

var md = new MobileDetect(window.navigator.userAgent);


function logger(data) {
  $('#error-message').append(data + "\n");
}

if (md.os() == 'iOS') {
  if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
    DeviceMotionEvent.requestPermission().then( response => {
      if (response == "denied") {
        const deniedModal = new bootstrap.Modal('#deniedModal', {
          keyboard: false,
          backdrop: 'static'
        })
        deniedModal.show();
      } 
    }).catch((err) => {
      const requestModal = new bootstrap.Modal('#requestModal', {
        keyboard: false,
        backdrop: 'static'
      })
      requestModal.show();
    });
  } 
} else if (md.os() == null) {
  const initModal = new bootstrap.Modal('#initModal', {
    keyboard: false,
    backdrop: 'static'
  })
  initModal.hide();
} else {
  const initModal = new bootstrap.Modal('#initModal', {
    keyboard: false,
    backdrop: 'static'
  })
  initModal.show();
}

var canvas = document.getElementById('canvas');
var W = canvas.width;
var H = canvas.height;
var ctx = canvas.getContext('2d');

var samples = {};

var SAMPLES_COUNT = 64;
var COLORS = {
    x: '#FFB2B2',
    y: '#FFFF00',
    z: '#00FFC8'
};

var scaleX = W/SAMPLES_COUNT;
var scaleY = 50;

var isRefresh = true;

samples.x = getInitArr(SAMPLES_COUNT);
samples.y = getInitArr(SAMPLES_COUNT);
samples.z = getInitArr(SAMPLES_COUNT);

if (md.mobile() != null || md.phone() != null || md.tablet() != null || md.os() != null) {
  if (!window.DeviceMotionEvent){
    logger('Gagal mendeteksi Sensor Gyro Acceleration pada perangkat anda!');
    logger('Silahkan Reload/Muat Ulang Halaman Situs Ini!');
    logger('Atau Klik Tombol Reload Di Atas');
    $('#settings').hide();
    $('#reload').show();
  } else {
    logger('Siap digunakan!' );
    logger('Klik "START" Untuk Aktifkan Alarm!');
    if (md.os() != 'iOS') {
      if ('wakeLock' in navigator) {
        isSupported = true;
        // logger('Perangkat anda mendukung WakeLock!');
      } else {
          wakeButton.disabled = true;
          // logger('Perangkat anda tidak mendukung WakeLock, harap menggunakan google chrome terbaru!');
      }
  
      let wakeLock = null;
        async function wL() {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            // logger('WakeLock Ok!');
        } catch (err) {
            console.log(`${err.name}, ${err.message}`);
        }
      }
      wL()
    }
    
    let startBtn = document.getElementById("startBtn");
    let stopBtn = document.getElementById("stopBtn");
    
    startBtn.onclick = function(e) {
        e.preventDefault();
        warning.play();
        warning.pause();
        warning.currentTime = 0;
        $('#error-message').attr('placeholder', 'Loading...');
        $('#error-message').html('');
        $('#stopBtn').attr('disabled', false);
        $('#startBtn').attr('disabled', true);
        const startEvent = setTimeout(() => {
          window.addEventListener("devicemotion", gyroAcceleration, false);
          logger('[START] Alarm Aktif!')
          logger(document.getElementsByTagName('select')[0].selectedOptions[0].text)
          $('#tidakaktif').hide();
          $('#aktif').show();
          $('#error-message').scrollTop($('#error-message')[0].scrollHeight);
          $('.canvas-container').show();
          tick(); 
          if (startEvent) clearTimeout(startEvent);
        }, 500)
        $('#sens').hide();
    };
    stopBtn.onclick = function(e) {
        e.preventDefault();
        warning.pause();
        warning.currentTime = 0;
        $('#error-message').html('');
        logger('[STOP] Alarm Non Aktif!')
        
        $('.canvas-container').hide();
        $('#error-message').scrollTop($('#error-message')[0].scrollHeight);
        $('#sens').show();
        $('#tidakaktif').show();
        $('#aktif').hide();
        $('#stopBtn').attr('disabled', true);
        $('#startBtn').attr('disabled', false);
        window.removeEventListener("devicemotion", gyroAcceleration, false);
    };
  }
} else {
  logger('Silahkan untuk menggunakan HP Android / iOS (iPhone/iPad)!');
  $('.canvas-container').hide();
  $('#settings').hide();
  $('#desktop').show();
  $('#maincontent').hide();
  $('.btn').hide();
  $('.alert').hide();
}

$('#sele').on('change', function() {
  if ($('#sele').val() == 'custom') {
    const customModal = new bootstrap.Modal('#customModal', {
      keyboard: false,
      backdrop: 'static'
    })
    customModal.show();
  }
})

if (localStorage.getItem("customx") === null) {
  localStorage.setItem('customx', '0.3');
}
$("#customx").val(Number(localStorage.getItem('customx')))
$("[name=customx]").val($('#customx').val())
$("#customx").on("change input", function() {
  $("[name=customx]").val($(this).val())
  localStorage.setItem('customx', $(this).val())
})

if (localStorage.getItem("customy") === null) {
  localStorage.setItem('customy', '0.3');
}
$("#customy").val(Number(localStorage.getItem('customy')))
$("[name=customy]").val($('#customy').val())
$("#customy").on("change input", function() {
  $("[name=customy]").val($(this).val())
  localStorage.setItem('customy', $(this).val())
})

if (localStorage.getItem("customz") === null) {
  localStorage.setItem('customz', '0.3');
}
$("#customz").val(Number(localStorage.getItem('customz')))
$("[name=customz]").val($('#customz').val())
$("#customz").on("change input", function() {
  $("[name=customz]").val($(this).val())
  localStorage.setItem('customz', $(this).val())
})

function gyroAcceleration(event) {
    shift(samples.x, event.acceleration.x);
    shift(samples.y, event.acceleration.y);
    shift(samples.z, event.acceleration.z);
    if ($('#sele').val() == '1') {
      var x = -0.3;
      var y = -0.3;
      var z = -0.4;
      var px = 0.3;
      var py = 0.3;
      var pz = 0.4;
    } else if ($('#sele').val() == '2') {
      var x = -0.6;
      var y = -0.6;
      var z = -0.7;
      var px = 0.6;
      var py = 0.6;
      var pz = 0.7;
    } else if ($('#sele').val() == '3') {
      var x = -0.9;
      var y = -0.9;
      var z = -1.0;
      var px = 0.9;
      var py = 0.9;
      var pz = 1.0;
    } else if ($('#sele').val() == '4') {
      var x = -1.2;
      var y = -1.2;
      var z = -1.3;
      var px = 1.2;
      var py = 1.2;
      var pz = 1.0;
    } else if ($('#sele').val() == '5') {
      var x = -1.5;
      var y = -1.5;
      var z = -1.6;
      var px = 1.5;
      var py = 1.5;
      var pz = 1.6;
    } else if ($('#sele').val() == 'custom') {
      var x = Number('-' + localStorage.getItem('customx'));
      var y = Number('-' + localStorage.getItem('customy'));
      var z = Number('-' + localStorage.getItem('customz'));
      var px = Number(localStorage.getItem('customx'));
      var py = Number(localStorage.getItem('customx'));
      var pz = Number(localStorage.getItem('customx'));
    }
    if (parseFloat(x) >= parseFloat(event.acceleration.x) || parseFloat(y) >= parseFloat(event.acceleration.y) || parseFloat(z) >= parseFloat(event.acceleration.z) || parseFloat(px) <= parseFloat(event.acceleration.x) || parseFloat(py) <= parseFloat(event.acceleration.y) || parseFloat(pz) <= parseFloat(event.acceleration.z)) {
      if (warning.paused) {
        warning.volume = 1;
        warning.play();
        const alert = new Date().toLocaleString('en-GB') + ' : HP Mendeteksi Getaran!'
        logger(alert);
        $('#error-message').scrollTop($('#error-message')[0].scrollHeight);
        // localStorage.clear();
        var history = [];
        if (localStorage.getItem("history") !== null) {
          var get = JSON.parse(localStorage.getItem("history"));
          for(var i = 0;i < get.length;i++){
            history.push(get[i])
          }
        }
        history.push(alert)
        localStorage.setItem("history", JSON.stringify(history));
        
        $('#history').append(alert + "\n");
        // const getHistory = JSON.parse(localStorage.getItem("history"))
        // logger(JSON.stringify(getHistory));
      }
    }
    // document.getElementById('x').innerHTML = event.acceleration.x;
    // document.getElementById('y').innerHTML = event.acceleration.y;
    // document.getElementById('z').innerHTML = event.acceleration.z;
}

function tick() {
    window.requestAnimationFrame(tick);
    
    if (!isRefresh){
        return;
    }
    ctx.fillStyle = '#49574a';
    ctx.fillRect(0, 0, W, H);
    
    drawAxis(5);
    drawGraph(samples.x, COLORS.x, scaleX, scaleY);
    drawGraph(samples.y, COLORS.y, scaleX, scaleY);
    drawGraph(samples.z, COLORS.z, scaleX, scaleY);
    drawLegend();
}

function drawAxis(grid) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#bbb';
    ctx.beginPath();
    ctx.moveTo(0, H/2);
    ctx.lineTo(W, H/2);
    ctx.stroke();
    
    var count = H/2 / (grid*scaleY);
    
    ctx.strokeStyle = '#bbb';
    for (var i=1; i<count; i++){
        ctx.beginPath();
        ctx.moveTo(0, H/2-i*grid*scaleY);
        ctx.lineTo(W, H/2-i*grid*scaleY);
        ctx.stroke();  
        
        ctx.beginPath();
        ctx.moveTo(0, H/2+i*grid*scaleY);
        ctx.lineTo(W, H/2+i*grid*scaleY);
        ctx.stroke();
    }
}

function drawGraph(samples, color, scaleX, scaleY) {  
    ctx.save();
    ctx.translate(0, H/2); 
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    var len = samples.length;
    ctx.moveTo(0, samples[0] * scaleY);
    for(var i = 0; i < len; i++){
        ctx.lineTo(i*scaleX, samples[i]*scaleY);
    }
    ctx.stroke();
    
    ctx.restore();
}

function getInitArr(length) {
    var arr = new Float32Array(length);
    for (var i = 0; i < length; i++) {
        arr[i] = 0;
        arr[i] = Math.random() * 4 - 2;
    }
    arr[length - 2] = 0.5;
    arr[length - 1] = -0.5;

    return arr;
}

function shift(arr, datum) {
    var ret = arr[0];
    for (var i = 1; i < arr.length; i++) {
        arr[i - 1] = arr[i];
    }
    arr[arr.length - 1] = datum;
    return ret;
}

function myFunction(e) {
  var copyText = e.target.previousElementSibling;
  copyText.select();
  copyText.setSelectionRange(0, 99999)
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

if (localStorage.getItem("history") !== null) {
  const getHistory = JSON.parse(localStorage.getItem("history"))
  for(var i = 0;i < getHistory.length;i++){
    $('#history').append(getHistory[i] + "\n");
  }
}

const logModal = document.getElementById('logModal')
logModal.addEventListener('shown.bs.modal', function (event) {
  $('#history').scrollTop($('#history')[0].scrollHeight);
})

const bmkgModal = document.getElementById('bmkgModal')
bmkgModal.addEventListener('shown.bs.modal', function (event) {
  fetch(`https://bmkg-content-inatews.storage.googleapis.com/datagempa.json?t=${Date.now()}`, {
    Method: 'GET',
  }).then((response) => response.json()).then((result) => {
      $('#shakemap').attr('src', 'https://bmkg-content-inatews.storage.googleapis.com/' + result.info.shakemap)
      $('#mag').html('M' + result.info.magnitude)
      $('#datetime').html(result.info.date + '<br>' + result.info.time)
      $('#depth').html(result.info.depth + '<br> Kedalaman')
      $('#area').html(result.info.area)
      $('#felt').html('')
      let felt = result.info.felt.split(',')
      for(var i = 0; i < felt.length; i++) {
        $('#felt').append(`<span class="mt-2 px-2 me-1 badge bg-warning bmkg-font">${felt[i]}</span>`)
      }$('#timesent').html(result.info.timesent)

  });
})

if (localStorage.getItem("expDate") === null) {
  localStorage.setItem('expDate', new Date(Date.now() + 2 * 86400000).setDate(new Date(Date.now() + 2 * 86400000).getDate()));
} else {
  const currDate = new Date(Date.now()).setDate(new Date(Date.now()).getDate());
  if (Number(currDate) > Number(localStorage.getItem("expDate"))) {
    localStorage.removeItem('history');
    $('#history').val('')
    localStorage.setItem('expDate', new Date(Date.now() + 2 * 86400000).setDate(new Date(Date.now() + 2 * 86400000).getDate()));
  } 
}

const expDate = new Date(Number(localStorage.getItem("expDate")))
$('#expdate').html(expDate.toLocaleString('en-GB'))

if (localStorage.getItem("cianjuralarm") === null) {
  localStorage.setItem('cianjuralarm', 0);
}

if (localStorage.getItem("cianjuralarm") == 1) {
  $('#cianjuralarmcheck').attr('checked', true)
} else {
  $('#cianjuralarmcheck').attr('checked', false)
}

$('#cianjuralarm').on('click', function() {
  if ($('#cianjuralarmcheck').is(":checked")) {
    $('#cianjuralarmcheck').attr('checked', false)
    localStorage.setItem('cianjuralarm', 0);
  } else {
    $('#cianjuralarmcheck').attr('checked', true)
    localStorage.setItem('cianjuralarm', 1);
  }
  $('#cianjuralarmcheck').is(":checked") ? console.log('checked') : console.log('not checked');
})

function stopWarn() {
  warning.pause();
  warning.currentTime = 0;
  $('#warnBtn').hide();
}

if (md.os() != 'iOS') {
  const beamsClient = new PusherPushNotifications.Client({
    instanceId: "075f9bae-fc37-448c-a63d-aac8338831ea",
  });
  
  beamsClient.start().then((beamsClient) => beamsClient.getDeviceId())
    .then((deviceId) => {
      beamsClient.addDeviceInterest(deviceId)
      beamsClient.addDeviceInterest("broadcast")
      localStorage.setItem('deviceId', deviceId);
    }).then(() => beamsClient.getDeviceInterests())
    .then((interests) => console.log("Current interests:", interests))
    .catch(console.error);
}

// Geocode Alarm Sedang Perbaikan
localStorage.setItem('cianjuralarm', 0);