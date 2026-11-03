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
var MOVE_MS = 900;
var SORT_MS = 600;
var MODAL_MS = 300;
var sortOn = {};
var openId = null;
var EFFECT_CASES = [18, 19];

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
function roomById(id) {
    return party.find(function (r) { return r.id === id; });
}

function findGuest(name) {
    var found = null;
    party.forEach(function (room) {
        room.guests.forEach(function (g, index) {
            if (g.name === name) {
                found = { guest: g, room: room, index: index };
            }
        });
    });
    return found;
}

function roomOrder(room) {
    if (!sortOn[room.id]) return room.guests;
    return room.guests.slice().sort(function (a, b) {
        return a.time.localeCompare(b.time);
    });
}

function buildParty() {
    var $floors = $('#floors').empty();
    [2, 1].forEach(function (floor) {
        var $floor = $('<div class="floor"></div>')
            .attr('data-floor', floor)
            .append($('<div class="floor-label"></div>').text('Floor ' + floor));

        party.forEach(function (room) {
            if (room.floor !== floor) return;
            var $room = $('<section class="room"></section>')
                .attr({ id: room.id, 'data-name': room.name, 'data-floor': room.floor })
                .append($('<h3></h3>').text(room.name))
                .append($('<button class="sort-btn"></button>')
                    .text(sortOn[room.id] ? 'Picture order' : 'Sort by time'));

            var $list = $('<div class="guests"></div>').appendTo($room);
            roomOrder(room).forEach(function (g) {
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

function modalHtml(g, roomId) {
    var things = g.things.length
        ? g.things.map(function (t) { return iconNames[t]; }).join(', ')
        : 'Nothing at all';

    var moves = party
        .filter(function (r) { return r.id !== roomId; })
        .map(function (r) {
            return '<button class="move-btn" data-guest="' + g.name + '" data-to="' + r.id + '">To ' + r.name + '</button>';
        })
        .join('');

    return '<img class="modal-avatar" src="' + avatarUrl(g) + '" alt="' + g.name + '">' +
        '<h3>' + g.name + '</h3>' +
        '<p>Came at ' + g.time + '</p>' +
        '<p>' + (g.aitu ? 'AITU student' : 'Not an AITU student') + '</p>' +
        '<p>Things: ' + things + '</p>' +
        '<div class="modal-moves"><p>Move to:</p>' + moves + '</div>';
}

function openGuestModal(name, $card) {
    var found = findGuest(name);
    if (!found) return;

    closeGuestModal(true);
    openId = found.guest.name.toLowerCase();

    var $modal = $('#guest-modal');
    $modal.html(modalHtml(found.guest, found.room.id))
        .css({ display: 'block', left: 0, top: 0, width: 280, height: 'auto', opacity: 1, overflow: '' });
    $modal.find('.modal-avatar').css({ width: 60, height: 60, borderRadius: '50%' });

    var finalH = $modal.outerHeight();
    var finalL = (window.innerWidth - 280) / 2;
    var finalT = (window.innerHeight - finalH) / 2;

    var r = $card.find('.avatar')[0].getBoundingClientRect();
    $modal.css({
        left: r.left + r.width / 2 - 25,
        top: r.top + r.height / 2 - 25,
        width: 50,
        height: 50,
        opacity: 0,
        overflow: 'hidden'
    });

    $('#modal-backdrop').fadeIn(200);

    $modal.animate({
        left: finalL,
        top: finalT,
        width: 280,
        height: finalH,
        opacity: 1
    }, MODAL_MS, function () {
        $(this).css({ height: '', overflow: '' });
    });
}

function closeGuestModal(instant) {
    if (!openId) return;

    var $modal = $('#guest-modal');
    var $backdrop = $('#modal-backdrop');
    var $avatar = $('#' + openId + ' .avatar');
    openId = null;

    if (instant) {
        $modal.stop(true, false).hide();
        $backdrop.stop(true, false).hide();
        return;
    }

    $backdrop.stop(true, false).fadeOut(200);
    $modal.stop(true, false).css('overflow', 'hidden');

    if ($avatar.length) {
        var r = $avatar[0].getBoundingClientRect();
        $modal.animate({
            left: r.left + r.width / 2 - 25,
            top: r.top + r.height / 2 - 25,
            width: 50,
            height: 50,
            opacity: 0
        }, MODAL_MS, function () {
            $(this).hide().css({ overflow: '', height: '' });
        });
    } else {
        $modal.fadeOut(200);
    }
}
function moveGuest(name, targetId) {
    var found = findGuest(name);
    var target = roomById(targetId);
    if (!found || !target || found.room.id === target.id) return;

    var id = found.guest.name.toLowerCase();
    var $old = $('#' + id);
    var start = $old.offset();

    var followers = $old.nextAll('.guest').map(function () { return this.id; }).get();

    closeGuestModal(true);

    found.room.guests.splice(found.index, 1);
    target.guests.push(found.guest);
    sortOn[target.id] = false;

    buildParty();
    var $new = $('#' + id);
    var end = $new.offset();

    followers.forEach(function (fid) {
        $('#' + fid).css('margin-left', 76).animate({ marginLeft: 0 }, MOVE_MS);
    });

    $new.css({ width: 0, opacity: 0, overflow: 'hidden' })
        .animate({ width: 72, opacity: 1 }, MOVE_MS, function () {
            $(this).css({ width: '', opacity: '', overflow: '' });
        });

    if (start && end) {
        var $fly = guestCard(found.guest)
            .removeAttr('id')
            .css({
                position: 'absolute',
                left: start.left,
                top: start.top,
                width: 72,
                margin: 0,
                zIndex: 2000,
                pointerEvents: 'none'
            })
            .appendTo('body');

        $fly.animate({ left: end.left, top: end.top }, MOVE_MS, function () {
            $(this).remove();
        });
    }
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

    $('#modal-backdrop').css('pointer-events', 'none');

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
        var c = cases[n - 1];
        var $found = c.find();
        var isRooms = $found.is('.room');
        $found.addClass('found');

        if (EFFECT_CASES.indexOf(n) === -1) {
            applySpotlight($found);
            var $jumpers = isRooms ? $found.find('.guest') : $found;
            $jumpers.stop(true, true).animate({ top: -14 }, 150).animate({ top: 0 }, 150);
        }

        var names = $found.map(function () {
            return $(this).attr('data-name');
        }).get();
        var word = (isRooms ? 'room' : 'guest') + (names.length === 1 ? '' : 's');

        $('#result .result-title').text('Case ' + n + ': ' + c.q);
        $('#result .result-names').text('Found (' + names.length + ' ' + word + '): ' + (names.join(', ') || '-'));
    });

    $('#clearBtn').on('click', clearSpotlight);

    $(document).on('click', '.guest', function () {
        openGuestModal($(this).attr('data-name'), $(this));
    });

    $(document).on('click', '.move-btn', function () {
        moveGuest($(this).attr('data-guest'), $(this).attr('data-to'));
    });

    $(document).on('click', '.sort-btn', function () {
        toggleSortRoom($(this).closest('.room').attr('id'));
    });

    $(document).on('click', function (e) {
        if (!$(e.target).closest('#guest-modal, .guest').length) {
            closeGuestModal();
        }
    });

    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            closeGuestModal();
        }
    });
});