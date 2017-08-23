var words = {}

if(localStorage.getItem('words') == null) {
    console.log('Saving init words in localstorage')
    localStorage.setItem('words', JSON.stringify(words))
} else {
    console.log('Loading init words from localstorage')
    words = JSON.parse(localStorage.getItem('words'))
}

var hacking_in_progress = false

function hackFirstUserInList() {
    $('#player-list .list-table-name')[0].click()
    setTimeout(clickHack, 500)
}

function clickHack() {
    $('#window-other-button').click()
    setTimeout(clickPort, 500)
}

function clickPort() {
    $('#window-other-port3').click()
    setTimeout(closeUserDetails, 500)
}

function closeUserDetails() {
    $('#window-other .window-close').click()
}

setInterval(function() {
    if($("#topwindow-success").css('display') == 'block') {
        $('#topwindow-success .targetmessage-button-cancel').click()
        console.log('Found success window. Closed.')
        hacking_in_progress = false
        printWordsStat()
        setTimeout(hackFirstUserInList, 500)
    }
}, 100)

function printWordsStat() {
    var tmp_map = {}
    for (var key in words) { 
      var parts = key.split('/'); 
      if(parts[parts.length-2] in tmp_map && tmp_map[parts[parts.length-2]] > parts[parts.length-1]) { 
        tmp_map[parts[parts.length-2]] = parts[parts.length-1] 
      } else { 
        tmp_map[parts[parts.length-2]] = parts[parts.length-1] 
      } 
    }
    var max_value = 0
    for(var key in tmp_map) {
      if(tmp_map[key] > max_value) {
        max_value = tmp_map[key]
      }
    }

    var progress = 0
    for(var key in tmp_map) {
      progress += tmp_map[key]/max_value
    }
    progress /= Object.keys(tmp_map).length
    progress *= 100
    progress = progress.toFixed(2)
    $('#trainer .stat').html('Known '+progress+'% of words')
}

setInterval(function() {
    if($('#cdm-text-container span:last()').text() == "This port has been closed. Try another") {
        hackFirstUserInList()
    }
}, 1000)

document.querySelector('#tool-type-form input').addEventListener('change', function() {
    console.log('Saving value for word "'+document.querySelector('#tool-type img').src+'" = '+document.querySelector('#tool-type-form input').value)
    words[document.querySelector('#tool-type img').src] = document.querySelector('#tool-type-form input').value;
    localStorage.setItem('words', JSON.stringify(words))
    printWordsStat()
})

document.querySelector('#tool-type img').addEventListener('load', function() {
    printWordsStat()
    hacking_in_progress = true
    // $('#tool-type-form input').prop('disabled', true);
    if(document.querySelector('#tool-type img').src == "http://s0urce.io/client/img/words/template.png") {
        return false;
    }

    if(document.querySelector('#tool-type img').src in words) {
        document.querySelector('#tool-type-form input').value = words[document.querySelector('#tool-type img').src]
        console.log('"'+document.querySelector('#tool-type img').src+'" found as '+words[document.querySelector('#tool-type img').src])
        if(submit_timer != null) {
            clearTimeout(submit_timer)
        }
        submit_timer = setTimeout(function() { $('#tool-type-form input').submit() }, submit_sleep)
    } else {
        // $('#tool-type-form input').prop('disabled', false);
        $('#tool-type-form input').focus()
        console.log('Not found: Word "'+document.querySelector('#tool-type img').src+'" not found')
    }
} )

var submit_timer = null
$('body').append('<div id="trainer"><div class="stat"></div></div>')
hackFirstUserInList()
var submit_sleep = 500