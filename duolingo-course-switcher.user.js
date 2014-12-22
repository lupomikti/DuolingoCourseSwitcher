// ==UserScript==
// @name        DuoLingo Course Switcher
// @namespace   http://moviemap.me/duoinc
// @include     https://www.duolingo.com/*
// @downloadURL https://github.com/mofman/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @updateURL   https://github.com/mofman/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @version     0.5.2
// @grant       none
// ==/UserScript==

document.head.appendChild($('<style type="text/css">'+
    '.language-sub-courses {position:absolute; top:0px !important; left:200px !important; color:#000; background-color: #fff; width: 150px; min-height: 50px; display: none !important;}'+
    '</style>').get(0));

var courses = '{"en":["es","fr","de","it","pt"],"es":["en","fr","pt","de"],"pt":["en","es"],"fr":["en","es"],"it":["en"],"de":["en","fr"],"hu":["en"],"ru":["en","de"],"tr":["en"],"dn":["en"],"pl":["en"],"ro":["en"],"ja":["en"],"ar":["en"],"zs":["en"],"el":["en"],"id":["en"],"hi":["en"],"ko":["en"],"vi":["en"]}';

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

    var A = duo.user.attributes;
    var courseObject = $.parseJSON(courses);
    var languagesNames = duo.language_names_ui[A.ui_language];

    var languagesList = $('.languages');

    languagesList.empty();

    $.each(courseObject, function( from, value ) {

        fromCourse = '<li class="language-choice choice"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+from+'"></span><span>'+languagesNames[from]+'</span></a><ul class="dropdown-menu language-sub-courses '+from+'"></ul></li>';

        $(fromCourse).appendTo(languagesList);

        $.each(value, function( fromx, to ) {
            sub = '<li class="language-choice" data-from="'+from+'" data-to="'+to+'"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+to+'"></span><span>'+languagesNames[to]+'</span></a></li>';

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

