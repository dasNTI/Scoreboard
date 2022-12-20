const socket = io();

socket.on('update', list => {
    document.querySelector('table tbody').innerHTML = '<tr><td>Platz</td><td>Name</td><td>Klasse</td><td>Zeit</td></tr>'

    list.forEach((p, i) => {
        document.querySelector('table tbody').innerHTML += `
            <tr index="${i}">
                <td>${i + 1}. </td>
                <td>${p.name}</td>
                <td>${p.class.toUpperCase()}</td>
                <td>${p.time}</td>
            </tr>`
    })
})

socket.on('alert', player => {
    console.log('yeet')

    let place = player.place + 1
    let behindOf = player.behindOf
    let otherPlayerTime = player.otherPlayerTime

    document.querySelector('#alert h1').innerText = `${place}. Platz`
    document.querySelector('#alert_name').innerText = behindOf
    document.querySelector('#alert_time').innerText = otherPlayerTime

    let alert = document.querySelector('#alert')
    alert.classList.add('animating')
    alert.onanimationend = () => {
        alert.classList.remove('animating')
    }
})

document.addEventListener('keydown', () => {
    document.body.requestFullscreen()
})