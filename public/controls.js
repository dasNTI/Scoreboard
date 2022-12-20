const socket = io();

document.querySelector('#add_player_btn').addEventListener('click', () => {
    let name = document.querySelector('#new_name').value || null
    let klasse = document.querySelector('#new_class').value || null

    if (!(name && klasse)) return;

    let minutes = document.querySelector('#new_time_minutes').value || null
    let seconds = document.querySelector('#new_time_seconds').value || null
    let milliseconds = document.querySelector('#new_time_milliseconds').value || null
    console.log(minutes, seconds, milliseconds)

    if (!(minutes && seconds && milliseconds)) return;

    minutes = String(minutes).length == 1 ? `0${minutes}` : minutes
    seconds = String(seconds).length == 1 ? `0${seconds}` : seconds
    milliseconds = String(milliseconds).length == 1 ? `0${milliseconds}` : milliseconds


    socket.emit('add', {
        name: name,
        class: klasse,
        time: `${minutes}:${seconds}:${milliseconds}`
    })
})

document.querySelector('#edit_player_btn').addEventListener('click', () => {
    let name = document.querySelector('#edit_name').value || null
    let klasse = document.querySelector('#edit_class').value || null

    if (!(name && klasse)) return;

    let minutes = document.querySelector('#edit_time_minutes').value || null
    let seconds = document.querySelector('#edit_time_seconds').value || null
    let milliseconds = document.querySelector('#edit_time_milliseconds').value || null
    console.log(minutes, seconds, milliseconds)

    if (!(minutes && seconds && milliseconds)) return;

    minutes = String(minutes).length == 1 ? `0${minutes}` : minutes
    seconds = String(seconds).length == 1 ? `0${seconds}` : seconds
    milliseconds = String(milliseconds).length == 1 ? `0${milliseconds}` : milliseconds


    socket.emit('edit', {
        name: name,
        class: klasse,
        time: `${minutes}:${seconds}:${milliseconds}`
    })
})



socket.on('update', list => {
    document.querySelector('#edit-container').classList.add('hidden')
    document.querySelector('table').innerHTML = ''

    list.forEach((p, i) => {
        document.querySelector('table').innerHTML += `
            <tr index="${i}">
                <td>${i + 1}. </td>
                <td>${p.name}</td>
                <td>${p.class}</td>
                <td>${p.time}</td>
                <td>
                    <div class="btns">
                        <button class="edit">Edit</button>
                        <button class="delete">Delete</button>
                    </div>
                </td>
            </tr>`
    })

    document.querySelectorAll(".btns .edit").forEach(e => {
        e.addEventListener('click', () => {
            document.querySelector('#edit-container').classList.remove('hidden')

            let tds = e.parentElement.parentElement.parentElement.querySelectorAll('td')

            document.querySelector('#edit_name').value = tds[1].innerText
            document.querySelector('#edit_class').value = tds[2].innerText
            
            let time = tds[3].innerText.split(':')

            document.querySelector('#edit_time_minutes').value = Number(time[0])
            document.querySelector('#edit_time_seconds').value = Number(time[1])
            document.querySelector('#edit_time_milliseconds').value = Number(time[2])

            document.querySelector('#edit_player_btn').style.pointerEvents = 'all'
        })
    })
    document.querySelectorAll(".btns .delete").forEach(e => {
        e.addEventListener('click', () => {
            if (!confirm('wirklich?')) return;

            let tr = e.parentElement.parentElement.parentElement

            socket.emit('delete', {name: tr.querySelectorAll('td')[1].innerText})
        })
    })
})

document.addEventListener('click', () => {
    document.body.requestFullscreen()
})