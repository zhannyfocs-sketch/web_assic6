var party = [
    {
        id: 'balcony', name: 'Balcony', floor: 2,
        guests: [
            { name: 'Aigerim', color: 'green', time: '20:45', aitu: true, things: ['cup', 'crumbs'] },
            { name: 'Aliya', color: 'black', time: '21:15', aitu: false, things: ['phone', 'cup'] },
            { name: 'Madina', color: 'green', time: '22:10', aitu: false, things: ['phone', 'bag', 'crumbs'] },
            { name: 'Ivan', color: 'black', time: '20:10', aitu: true, things: ['cup'] }
        ]
    },
    {
        id: 'hall', name: 'Hall', floor: 2,
        guests: [
            { name: 'Arman', color: 'yellow', time: '20:35', aitu: true, things: ['bag', 'glasses'] },
            { name: 'Sophia', color: 'purple', time: '21:20', aitu: true, things: ['phone'] },
            { name: 'Dias', color: 'green', time: '19:45', aitu: true, things: [] },
            { name: 'Bekzat', color: 'purple', time: '20:55', aitu: false, things: ['bag', 'cup', 'crumbs'] },
            { name: 'Aruzhan', color: 'black', time: '21:50', aitu: true, things: ['phone'] },
            { name: 'Saule', color: 'green', time: '21:25', aitu: false, things: ['glasses'] }
        ]
    },
    {
        id: 'kitchen', name: 'Kitchen', floor: 1,
        guests: [
            { name: 'Nurlan', color: 'red', time: '19:40', aitu: true, things: ['phone', 'cup'] },
            { name: 'Emma', color: 'black', time: '20:15', aitu: false, things: ['bag'] },
            { name: 'Timur', color: 'green', time: '21:05', aitu: true, things: ['phone', 'bag', 'crumbs'] },
            { name: 'Sergey', color: 'yellow', time: '20:50', aitu: false, things: [] },
            { name: 'Yerlan', color: 'red', time: '21:40', aitu: true, things: ['glasses', 'phone'] },
            { name: 'Kamila', color: 'black', time: '20:05', aitu: false, things: ['cup'] }
        ]
    },
    {
        id: 'living', name: 'Living room', floor: 1,
        guests: [
            { name: 'Daniel', color: 'blue', time: '19:55', aitu: false, things: ['glasses'] },
            { name: 'Zarina', color: 'green', time: '21:10', aitu: false, things: ['bag', 'phone', 'crumbs'] },
            { name: 'Natasha', color: 'yellow', time: '20:30', aitu: true, things: [] },
            { name: 'Askar', color: 'black', time: '21:00', aitu: true, things: ['phone'] },
            { name: 'Inkar', color: 'purple', time: '20:20', aitu: false, things: ['bag'] }
        ]
    }
];

var icons = { phone: '📱', glasses: '👓', bag: '👜', cup: '🥤', crumbs: '🍪' };
var iconNames = { phone: 'phone', glasses: 'glasses', bag: 'bag', cup: 'cup', crumbs: 'cake crumbs' };

function avatarUrl(g) {
    return 'https://api.dicebear.com/9.x/open-peeps/svg?seed=' + g.name;
}

function guestCard(g) {
    var $card = $('<div class="guest"></div>')
        .attr({
            id: g.name.toLowerCase(),
            'data-name': g.name,
            'data-color': g.color,
            'data-time': g.time,
            'data-aitu': g.aitu,
            'data-things': g.things.join('')
        })
        .addClass(g.color)
        .addClass(g.things.join(' '))
        .toggleClass('aitu', g.aitu);

    $('<img class="avatar">').attr({ src: avatarUrl(g), alt: g.name }).appendTo($card);

    if (g.aitu) {
        $('<span class="badge" title="AITU student">🎓</span>').appendTo($card);
    }

    $('<div class="name"></div>').text(g.name).appendTo($card);
    $('<div class="time"></div>').text(g.time).appendTo($card);

    var $things = $('<div class="things"></div>').appendTo($card);
    $.each(g.things, function (i, thing) {
        $('<span class="thing"></span>').text(icons[thing]).attr('title', thing).appendTo($things);
    });

    return $card;
}
var sortOn = {};

function toggleSortRoom(roomId) {
    var room = party.find(r => r.id === roomId);
    sortOn[roomId] = !sortOn[roomId];
    var list = sortOn[roomId]
        ? room.guests.slice().sort((a, b) => a.time.localeCompare(b.time))
        : room.guests;
    var $list = $('#' + roomId + ' .guests').empty();
    list.forEach(g => $list.append(guestCard(g)));
}

function buildParty() {
    var $floors = $('#floors').empty();
    $.each([2, 1], function (i, floor) {
        var $floor = $('<div class="floor"></div>')
            .attr('data-floor', floor)
            .append($('<div class="floor-label"></div>').text('Floor ' + floor));

        $.each(party, function (j, room) {
            if (room.floor !== floor) return;
            var $room = $('<section class="room"></section>')
                .attr({ id: room.id, 'data-name': room.name, 'data-floor': room.floor })
                .append($('<h3></h3>').text(room.name))
                .append($('<button class="sort-btn">Sort by time</button>').click(function () {
                    toggleSortRoom(room.id);
                }));

            var $list = $('<div class="guests"></div>').appendTo($room);
            $.each(room.guests, function (k, g) {
                $list.append(guestCard(g));
            });
            $floor.append($room);
        });
        $floors.append($floor);
    });
}

var cases = [
    { q: 'Who is in the hall?', find: function () { return $('#hall .guest'); } },
    { q: 'Who is dressed in yellow or purple?', find: function () { return $('.guest.yellow, .guest.purple'); } },
    { q: 'Which AITU students are upstairs?', find: function () { return $('.floor[data-floor="2"] .guest.aitu'); } },
    { q: 'Who has glasses or a bag?', find: function () { return $('.guest').filter('.glasses, .bag'); } },
    { q: 'Who came with nothing at all?', find: function () { return $('.guest').filter(function() { return $(this).find('.thing').length === 0; }); } },
    { q: 'Who has a phone but no bag?', find: function () { return $('.guest.phone:not(.bag)'); } },
    { q: 'Who arrived between 20:30 and 21:00?', find: function () { return $('.guest').filter(function () { var t = $(this).data('time'); return t >= '20:30' && t <= '21:00'; }); } },
    { q: 'Who arrived after 21:00 and is not AITU?', find: function () { return $('.guest:not(.aitu)').filter(function () { return $(this).data('time') > '21:00'; }); } },
    { q: 'Who stands right next to Askar?', find: function () { return $('#askar').prev().add('#askar + .guest'); } },
    { q: 'Who stands last in each room?', find: function () { return $('.guest:last-child'); } },
    { q: 'Who stands third in each room?', find: function () { return $('.guest:nth-child(3)'); } },
    { q: 'Who stands after Timur in his room?', find: function () { return $('#timur').nextAll(); } },
    { q: 'Who stands right before someone in black?', find: function () { return $('.guest.black').prev(); } },
    { q: 'In which room is Aruzhan?', find: function () { return $('#aruzhan').closest('.room'); } },
    { q: 'Which rooms have fewer than 6 guests?', find: function () { return $('.room').filter(function () { return $(this).find('.guest').length < 6; }); } },
    { q: 'Rooms with cup, but no glasses?', find: function () { return $('.room:has(.guest.cup):not(:has(.guest.glasses))'); } },
    { q: 'Who came first to each room?', find: function () { return $('.guest').filter(function () { var t = $(this).data('time'); return $(this).siblings().filter(function() { return $(this).data('time') < t; }).length === 0; }); } },
    { q: 'Miras joins Askar and Inkar', find: function () { return guestCard({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] }).hide().insertAfter('#askar').fadeIn(800); } },
    { q: 'Natasha says goodbye and leaves', find: function () { return $('#natasha').fadeOut(800, function () { $(this).remove(); }); } },
    { q: 'Who took the cake?', find: function () { return $('.floor[data-floor="1"] .guest').filter(function () { var t = $(this).data('time'); return t > '21:00' && t < '21:30'; }).filter('.crumbs:not(.cup)').filter(function () { return $(this).prev().add($(this).next()).is('.aitu'); }); } }
];

function applySpotlight($found) {
    var $keep = $found.is('.room') ? $found.find('.guest') : $found;
    $('.guest').stop(true, true).fadeTo(300, 0.2);
    $keep.stop(true, true).fadeTo(300, 1);
}

function clearSpotlight() {
    $('.guest').stop(true, true).fadeTo(300, 1);
    $('.case').removeClass('active');
    $('#result').find('.result-title').text('Result');
    $('#result').find('.result-names').text('Click a case below to start.');
}

function openGuestModal(guestName, $cardElem) {
    var foundGuest = null;
    var foundRoomId = null;
    
    $.each(party, function(i, room) {
        $.each(room.guests, function(j, g) {
            if (g.name.toLowerCase() === guestName.toLowerCase()) {
                foundGuest = g;
                foundRoomId = room.id;
            }
        });
    });

    if (!foundGuest) return;

    var offset = $cardElem.find('.avatar').offset();
    var $modal = $('#guest-modal');
    
    $modal.html(`
        <img src="${avatarUrl(foundGuest)}" style="width: 60px; height: 60px; border-radius: 50%; border: 3px solid var(--wall);">
        <h3>${foundGuest.name}</h3>
        <p>Came at ${foundGuest.time}</p>
        <p>${foundGuest.aitu ? 'AITU student' : 'Not an AITU student'}</p>
        <p>Things: ${foundGuest.things.length > 0 ? foundGuest.things.map(t => iconNames[t]).join(', ') : 'Nothing at all'}</p>
        <div class="modal-actions" style="margin-top: 15px;">
            <p style="font-size: 11px; font-weight: bold; margin: 4px 0;">Move to room:</p>
            <div style="display: flex; gap: 4px; justify-content: center; flex-wrap: wrap;">
                ${party.map(r => r.id !== foundRoomId ? `<button class="move-btn" data-guest="${foundGuest.name}" data-to="${r.id}" style="padding: 4px 8px; background: var(--blue); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">To ${r.name}</button>` : '').join('')}
            </div>
        </div>
    `).css({
        top: offset ? offset.top + 'px' : '50%',
        left: offset ? offset.left + 'px' : '50%',
        width: '50px',
        height: '50px',
        opacity: 0
    }).show();

    $('#modal-backdrop').fadeIn(200);
    $modal.stop(true, true).animate({
        top: '50%',
        left: '50%',
        marginLeft: '-140px',
        marginTop: '-120px',
        width: '280px',
        height: 'auto',
        opacity: 1
    }, 300);
}

function closeGuestModal() {
    $('#guest-modal').stop(true, true).fadeOut(200, function() {
        $('#modal-backdrop').fadeOut(200);
    });
}
function moveGuest(guestName, targetRoomId) {
    var sourceRoom = null, guestObj = null, guestIndex = -1;
    
    $.each(party, function(i, room) {
        $.each(room.guests, function(j, g) {
            if (g.name.toLowerCase() === guestName.toLowerCase()) {
                sourceRoom = room;
                guestObj = g;
                guestIndex = j;
            }
        });
    });

    var targetRoom = party.find(r => r.id === targetRoomId);
    if (!sourceRoom || !targetRoom || sourceRoom.id === targetRoom.id) return;

    sourceRoom.guests.splice(guestIndex, 1);
    targetRoom.guests.push(guestObj);

    closeGuestModal();
    buildParty();
}
var sortedRooms = {};
function toggleSortRoom(roomId) {
    var roomData = party.find(r => r.id === roomId);
    if (!roomData) return;

    if (!sortedRooms[roomId]) {
        roomData.guests.sort((a, b) => a.time.localeCompare(b.time));
        sortedRooms[roomId] = true;
    } else {
        sortedRooms[roomId] = false;
        buildParty();
        return;
    }
    
    var $roomEl = $('#' + roomId);
    var $list = $roomEl.find('.guests').empty();
    $.each(roomData.guests, function (k, g) {
        $list.append(guestCard(g));
    });
}

$(function () {
    buildParty();

    $.each(cases, function (i, c) {
        $('<button class="case"></button>')
            .attr('data-case', i + 1)
            .append($('<b></b>').text(i + 1))
            .append($('<span></span>').text(c.q))
            .appendTo('#cases');
    });

    $('#cases').on('click', '.case', function () {
        var n = $(this).data('case');
        $('.case').removeClass('active');
        $(this).addClass('active');
        buildParty();
        var $found = cases[n - 1].find();
        
        applySpotlight($found);
        
        var isRooms = $found.is('.room');
        var names = $found.map(function () { return $(this).data('name') || $(this).data('room'); }).get();
        var $jumpers = isRooms ? $found.find('.guest') : $found;
        
        $jumpers.stop(true, true).animate({ top: -14 }, 150).animate({ top: 0 }, 150);

        var word = isRooms ? 'room' : 'guest';
        if (names.length !== 1) word += 's';

        $('#result').find('.result-title').text('Case ' + n + ': ' + c.q);
        $('#result').find('.result-names').text('Found (' + names.length + ' ' + word + '): ' + (names.join(', ') || '-'));
    });

    $('#clearBtn').click(function() {
        clearSpotlight();
    });
    $(document).on('click', '.guest', function(e) {
        e.stopPropagation();
        openGuestModal($(this).data('name'), $(this));
    });

    $('#modal-backdrop').click(function() {
        closeGuestModal();
    });

    $(document).keydown(function(e) {
        if (e.key === "Escape") {
            closeGuestModal();
        }
    });
    $(document).on('click', '.move-btn', function() {
        moveGuest($(this).data('guest'), $(this).data('to'));
    });
    $(document).on('click', '.sort-btn', function() {
        var roomId = $(this).closest('.room').attr('id');
        toggleSortRoom(roomId);
    });
});