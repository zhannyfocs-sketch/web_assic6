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

var icons = {
    phone: '📱', glasses: '👓', bag: '👜', cup: '🥤', crumbs: '🍪'
};

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
                .append($('<h3></h3>').text(room.name));

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
    { 
        q: 'Who arrived between 20:30 and 21:00?', 
        find: function () { 
            return $('.guest').filter(function () { 
                var t = $(this).data('time'); 
                return t >= '20:30' && t <= '21:00'; 
            }); 
        } 
    },
    { 
        q: 'Who arrived after 21:00 and is not AITU?', 
        find: function () { 
            return $('.guest:not(.aitu)').filter(function () { 
                return $(this).data('time') > '21:00'; 
            }); 
        } 
    },
    { q: 'Who stands right next to Askar?', find: function () { return $('#askar').prev().add('#askar + .guest'); } },
    { q: 'Who stands last in each room?', find: function () { return $('.guest:last-child'); } },
    { q: 'Who stands third in each room?', find: function () { return $('.guest:nth-child(3)'); } },
    { q: 'Who stands after Timur in his room?', find: function () { return $('#timur').nextAll(); } },
    { q: 'Who stands right before someone in black?', find: function () { return $('.guest.black').prev(); } },
    { q: 'In which room is Aruzhan?', find: function () { return $('#aruzhan').closest('.room'); } },
    { 
        q: 'Which rooms have fewer than 6 guests?', 
        find: function () { 
            return $('.room').filter(function () { 
                return $(this).find('.guest').length < 6; 
            }); 
        } 
    },
    { q: 'Rooms with cup, but no glasses?', find: function () { return $('.room:has(.guest.cup):not(:has(.guest.glasses))'); } },
    { 
        q: 'Who came first to each room?', 
        find: function () { 
            return $('.guest').filter(function () { 
                var t = $(this).data('time'); 
                return $(this).siblings().filter(function() { return $(this).data('time') < t; }).length === 0; 
            }); 
        } 
    },
    { 
        q: 'Miras joins Askar and Inkar', 
        find: function () { 
            return guestCard({ name: 'Miras', color: 'blue', time: '21:20', aitu: true, things: ['phone'] })
                .hide().insertAfter('#askar').fadeIn(800); 
        } 
    },
    { 
        q: 'Natasha says goodbye and leaves', 
        find: function () { 
            return $('#natasha').fadeOut(800, function () { $(this).remove(); }); 
        } 
    },
    { 
        q: 'Who took the cake?', 
        find: function () { 
            return $('.floor[data-floor="1"] .guest')
                .filter(function () { var t = $(this).data('time'); return t > '21:00' && t < '21:30'; })
                .filter('.crumbs:not(.cup)')
                .filter(function () { return $(this).prev().add($(this).next()).is('.aitu'); }); 
        } 
    }
];

function showResult(n, $found) {
    var c = cases[n - 1];
    var isRooms = $found.is('.room');
    var names = $found.map(function () {
        return $(this).data('name') || $(this).data('room');
    }).get();

    $found.addClass('found');
    var $jumpers = isRooms ? $found.find('.guest') : $found;
    $jumpers.animate({ top: -14 }, 150).animate({ top: 0 }, 150);

    var word = isRooms ? 'room' : 'guest';
    if (names.length !== 1) word += 's';

    var $result = $('#result').empty();
    $('<div class="result-title"></div>').text('Case ' + n + ': ' + c.q).appendTo($result);
    $('<div class="result-names"></div>').text('Found (' + names.length + ' ' + word + '): ' + (names.join(', ') || '-')).appendTo($result);
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
        showResult(n, $found);
    });
});