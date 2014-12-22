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
    '.choice span:nth-child(2) {text-transform: capitalize;}'+
    '.language-sub-courses {position:absolute; top:-28px !important; left:200px !important; color:#000; background-color: #fff; width: 150px; min-height: 50px; display: none !important;}'+
    '</style>').get(0));

var header1 = JSON.parse('{"dn": "van", "sv": "fr\\u00e5n", "fr": "de", "hu": "-b\\u00f3l", "eo": "de", "tr": "-den", "es": "desde", "ro": "din", "ja": "\\u304b\\u3089", "vi": "t\\u1eeb", "it": "da", "he": "\\u05de", "el": "\\u03b1\\u03c0\\u03cc", "ru": "\\u0441", "ar": "\\u0645\\u0646", "en": "from", "ga": "\\u00f3", "cs": "od", "pt": "de", "de": "von", "zs": "\\u5f9e", "pl": "z"}');

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

function updateCourses(A) {
    var courses = JSON.parse(localStorage.getItem('courses')) || {};
    courses[A.ui_language] = A.languages.filter(function(lang){ return lang['learning']; }).map(function(lang){ return lang['language']; });
    localStorage.setItem('courses', JSON.stringify(courses));
    return courses;
}

function sortList() {
  var listitems = $('.languages > .language-choice').get();
  listitems.sort(function(a, b) { return $(a).text().localeCompare($(b).text()); });
  $.each(listitems, function(idx, itm) { $(itm).insertBefore( $('.languages > .divider') ); });
}

$(document).ready(function() {
    sortList();

    var A = duo.user.attributes;
    var courses = updateCourses(A);

    if(Object.keys(courses).length > 1) {
        var languageNames = duo.language_names_ui[A.ui_language];

        var activeLanguages = $('.languages > .language-choice');
        var divider = $('.languages > .divider');
        
        var header2 = $('.languages > .head > h6').text();
        $('.languages > .head > h6').text(header1[A.ui_language] || 'From');

        $.each(courses, function( from, value ) {
            fromCourse = '<li class="language-choice choice"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+from+'"></span><span>'+languageNames[from]+'</span></a><ul class="dropdown-menu language-sub-courses '+from+'"><li class="head"><h6>'+header2+'</h6></li></ul></li>';

            fromCourse = $(fromCourse).insertBefore(divider);
            
            if(from == A.ui_language) {
                activeLanguages.appendTo('.'+from);
                fromCourse.addClass('active');
            } else {
                value.sort();
                $.each(value, function( fromx, to ) {
                    sub = '<li class="language-choice" data-from="'+from+'" data-to="'+to+'"><a href="javascript:;"><span class="flag flag-svg-micro flag-'+to+'"></span><span>'+languageNames[to]+'</span></a></li>';

                    $(sub).appendTo('.'+from);
                });
            }
        });
        
        sortList();
    }
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

