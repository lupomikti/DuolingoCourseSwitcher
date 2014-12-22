// ==UserScript==
// @name        DuoLingo Course Switcher
// @namespace   http://moviemap.me/duoinc
// @include     https://www.duolingo.com/*
// @downloadURL https://github.com/mofman/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @updateURL   https://github.com/mofman/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @version     0.5.2
// @grant       none
// ==/UserScript==

// CSS.
document.head.appendChild($('<style type="text/css">'+
    '.language-sub-courses {position:absolute; top:0px !important; left:200px !important; color:#000; background-color: #fff; width: 150px; min-height: 50px; display: none !important;}'+
    '</style>').get(0));

// Variables
var courses = '{"en":["es","fr","de","it","pt"],"es":["en","fr","pt","de"],"pt":["en","es"],"fr":["en","es"],"it":["en"],"de":["en","fr"],"hu":["en"],"ru":["en","de"],"tr":["en"],"nl-NL":["en"],"pl":["en"],"ro":["en"],"ja":["en"],"ar":["en"],"zh-CN":["en"],"el":["en"],"id":["en"],"hi":["en"],"ko":["en"],"vi":["en"]}';

var languages = '{"ar":"Arabic","bn":"Bengali","zh-CN":"Chinese (Simpli)","zh-TW":"Chinese (Tradit)","cs":"Czech","nl-NL":"Dutch (Nether)","en":"English","eo":"Esperanto","fr":"French","de":"German","el":"Greek","he":"Hebrew","hi":"Hindi","hu":"Hungarian","id":"Indonesian","ga":"Irish","it":"Italian","ja":"Japanese","tlh":"Klingon","ko":"Korean","pl":"Polish","pt":"Portuguese","pa":"Punjabi","ro":"Romanian","ru":"Russian","es":"Spanish","sv":"Swedish","th":"Thai","tr":"Turkish","uk":"Ukrainian","vi":"Vietnamese"}';

function switchCourse(from, to) {
    $.ajax({
        url: 'https://www.duolingo.com/api/1/me/switch_language',
        type: 'post',
        data: {
            from_language: from,
            learning_language: to
        },
        dataType: 'json',
        success: function (data) {
            window.location = 'https://www.duolingo.com/';
        }
    });
}

$(document).ready(function() {

    var courseObject = $.parseJSON(courses);
    var languagesObject = $.parseJSON(languages);

    var languagesList = $('.languages');

    languagesList.empty();

    $.each(courseObject, function( from, value ) {

        fromCourse = '<li class="language-choice choice"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+from+'"></span><span>'+languagesObject[from]+'</span></a><ul class="dropdown-menu language-sub-courses '+from+'"></ul></li>';

        $(fromCourse).appendTo(languagesList);

        $.each(value, function( fromx, to ) {
            sub = '<li class="language-choice" data-from="'+from+'" data-to="'+to+'"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+to+'"></span><span>'+languagesObject[to]+'</span></a></li>';

            $(sub).appendTo('.'+from);
        });

    });

});

$(document).on('click', '.language-choice', function(){
    var from = $(this).attr('data-from');
    var to = $(this).attr('data-to');
    switchCourse(from, to);
});

$(document).on({
    mouseenter: function () {
        $(this).children('.language-sub-courses').attr('style', 'display: block !important');
    },
    mouseleave: function () {
        $(this).children('.language-sub-courses').attr('style', 'display: none !important');
    }
}, '.choice');

