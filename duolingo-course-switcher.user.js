// ==UserScript==
// @name        DuoLingo Course Switcher
// @description Simplifies switching between courses that use different interface language (i.e., base language, the language from which you learn).
// @namespace   http://moviemap.me/duoinc
// @include     https://www.duolingo.com/*
// @downloadURL https://github.com/lupomikti/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @updateURL   https://github.com/lupomikti/DuolingoCourseSwitcher/raw/master/duolingo-course-switcher.user.js
// @version     1.0.1
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @author      arekolek, mofman, gmelikov, christeefury, guillaumebrunerie, lupomikti
// ==/UserScript==

var duo = unsafeWindow.duo; // Duo object to get things like courses

// Style info for new sublists
document.head.appendChild($('<style type="text/css">'+
    '.language-sub-courses {position:absolute; top: -40px !important; background-color: #fff; min-width: 150px; min-height: 50px; max-height: 500px; overflow-y:auto; display: none !important;}'+
    '.choice {position: relative !important;}' +
    '.choice:hover, .extra-choice:hover {cursor:pointer !important;}' +
    'html[dir="ltr"] .language-sub-courses {left:200px !important;}'+
    'html[dir="rtl"] .language-sub-courses {right:200px !important;}'+
    '</style>').get(0));

// Language strings for the header of the main list
var header1 = JSON.parse('{"nl-NL": "van", "sv": "fr\\u00e5n", "fr": "de", "hu": "-b\\u00f3l", "eo": "de", "tr": "-den", "es": "desde", "ro": "din", "ja": "\\u304b\\u3089", "vi": "t\\u1eeb", "it": "da", "he": "\\u05de", "el": "\\u03b1\\u03c0\\u03cc", "ru": "\\u0441", "ar": "\\u0645\\u0646", "en": "from", "ga": "\\u00f3", "cs": "od", "pt": "de", "de": "von", "zs": "\\u5f9e", "pl": "z"}');

// Each of the flags has a unique code for its class and we'll need this to be able to get the correct one
// Special thanks and mention goes to jrikhal who had this bit of code (and the code for the parseStr var below)
//    in his course switcher replacement for the new site
var flags = JSON.parse('{"ar":"_1ARRD","bn":"_2TXAL","ca":"mc4rg","cs":"_1uPQW","cy":"_1jO8h","da":"_1h0xh","de":"oboa9","el":"_2tQo9","en":"_2cR-E","eo":"pWj0w","es":"u5W-o","fr":"_2KQN3","ga":"_1vhNM","gn":"_24xu4","he":"_PDrK","hi":"OgUIe","hu":"_1S3hi","id":"_107sn","it":"_1PruQ","ja":"_2N-Uj","ko":"_2lkzc","nl-NL":"_1fajz","no-BO":"_200jU","pl":"_3uusw","pt":"pmGwL","ro":"_12U6e","ru":"_1eqxJ","sv":"_2DMfV","sw":"_3T1km","th":"_2oTcA","tl":"_1q_MQ","tlh":"_6mRM","tr":"_1tJJ2","uk":"_1zZsN","vi":"_1KtzC","zh-CN":"_2gNgd","zh-¿?":"xi6jQ","interrogation":"t-XH-"}');

// The following builds an object that contains all the localization strings for language names since Duo no longer stores this info
//    in an easy to access place like before. This way, more translations can be added manually instead of waiting for Duo to do it.
// This list is not complete or comprehensive, and any time a string does not exist, the English one is used instead.

var textApostrophe = "'";

var parseStr = '{"ar":{"ar": "العربية","de": "الألمانية","en": "الإنجليزية","es": "الإسبانية","fr": "الفرنسية","sv": "السويدية"},' +
'"bn":{"bn": "বাঙালি","de": "জার্মান","en": "ইংরেজি","es": "স্প্যানিশ"},' +
'"ca":{"ca": "Català","de": "Alemany","en": "Anglès","es": "Castellà","fr": "Francès"},' +
'"cs":{"ar": "Arabština","cs": "Česky","de": "Němčina","en": "Angličtina","es": "Španělština","fr": "Francouzština"},' +
'"de":{"ar": "Arabisch","bn": "Bengalisch","ca": "Katalanisch","cs": "Tschechisch","cy": "Walisisch","da": "Dänisch","de": "Deutsch","el": "Griechisch","en": "Englisch","eo": "Esperanto","es": "Spanisch","fr": "Französisch","ga": "Irisch","he": "Hebräisch","ht": "Haitianisches Creole","hu": "Ungarisch","id": "Indonesisch","it": "Italienisch","ja": "Japanisch","ko": "Koreanisch","nl-NL": "Niederländisch","no-BO": "Norwegisch (Bokmål)","pa": "Pandschabi (Gurmukhi)","pl": "Polnisch","pt": "Portugiesisch","ro": "Rumänisch","ru": "Russisch","sv": "Schwedisch","tlh": "Klingonisch","tr": "Türkisch","uk": "Ukrainisch","vi": "Vietnamesisch","zh-CN": "Chinesisch"},' +
'"el":{"de": "Γερμανικά","el": "Ελληνικά","en": "Αγγλική","es": "Ισπανικά","fr": "Γαλλικά"},' +
'"en":{"ar": "Arabic","bn": "Bengali","ca": "Catalan","cs": "Czech","cy": "Welsh","da": "Danish","de": "German","el": "Greek","en": "English","eo": "Esperanto","es": "Spanish","fr": "French","ga": "Irish","gn": "Guarani (Jopará)","he": "Hebrew","hi": "Hindi","ht": "Haitian Creole","hu": "Hungarian","id": "Indonesian","it": "Italian","ja": "Japanese","ko": "Korean","nl-NL": "Dutch","no-BO": "Norwegian (Bokmål)","pa": "Punjabi (gurmukhi)","pl": "Polish","pt": "Portuguese","ro": "Romanian","ru": "Russian","sv": "Swedish","sw": "Swahili","ta": "Tamil","te": "Telugu","th": "Thai","tl": "Tagalog","tlh": "Klingon","tr": "Turkish","uk": "Ukrainian","vi": "Vietnamese","zh-CN": "Chinese"},' +
'"eo":{"de": "Germanaj","el": "Greka","eo": "Esperanto","en": "Angla","es": "Hispana","fr": "Franca"},' +
'"es":{"ar": "Árabe","bn": "Bengalí","ca": "Catalán","cs": "Checo","cy": "Galés","da": "Danés","de": "Alemán","el": "Griego","en": "Inglés","eo": "Esperanto","es": "Español","fr": "Francés","ga": "Irlandés","gn": "Guaraní (Jopará)","he": "Hebreo","hi": "Hindi","ht": "Criollo haitiano","hu": "Húngaro","id": "Indonesio","it": "Italiano","ja": "Japonés","ko": "Coreano","nl-NL": "Neerlandés","no-BO": "Noruego","pa": "Panyabí (Gurmukhi)","pl": "Polaco","pt": "Portugués","ro": "Rumano","ru": "Ruso","sv": "Sueco","sw": "Suajili","ta": "Tamil","te": "Télugu","th": "Tailandés","tl": "Tagalo","tlh": "Klingon","tr": "Turco","uk": "Ucraniano","vi": "Vietnamita","zh-CN": "Chino"},' +
'"fr":{"ar": "Arabe","bn": "Bengali","ca": "Catalan","cs": "Tchèque","cy": "Gallois","da": "Danois","de": "Allemand","el": "Grec","en": "Anglais","eo": "Espéranto","es": "Espagnol","fr": "Français","ga": "Irlandais","gn": "Guarani (Jopará)","he": "Hébreu","hi": "Hindi","ht": "Créole haïtien","hu": "Hongrois","id": "Indonésien","it": "Italien","ja": "Japonais","ko": "Coréen","nl-NL": "Néerlandais (Pays-Bas)","no-BO": "Norvégien","pa": "Panjabi (gurmukhi)","pl": "Polonais","pt": "Portugais","ro": "Roumain","ru": "Russe","sv": "Suédois","sw": "Swahili","ta": "Tamoul","te": "Telougou","th": "Thaï","tl": "Tagalog","tlh": "Klingon","tr": "Turc","uk": "Ukrainien","vi": "Vietnamien","zh-CN": "Chinois"},' +
'"gn":{"de": "Alemañañe'+textApostrophe+'ẽ","en": "Ingleñe'+textApostrophe+'ẽ","eo": "Esperanto","es": "Karaiñe'+textApostrophe+'ẽ","fr": "Hyãsiañe'+textApostrophe+'ẽ","gn": "Avañe'+textApostrophe+'ẽ"},' +
'"hi":{"de": "जर्मन","en": "अंग्रेज़ी","eo": "एस्पेरांतो","es": "स्पेनी","fr": "फ्रांसीसी","gn": "गुआरानी","hi": "हिन्दी"},' +
'"hu":{"de": "Német","en": "Angol","es": "Spanyol","fr": "Francia","hi": "hindi","hu": "magyar"},' +
'"id": {"de": "Bahasa Jerman","en": "Bahasa Inggris","es": "Bahasa Spanyol","fr": "Bahasa Perancis","hu": "Bahasa Hungaria","id": "Bahasa Indonesia"},' +
'"it":{"de": "Tedesco","en": "Inglese","es": "Spagnolo","fr": "Francese","id": "Indonesiano","it": "Italiano"},' +
'"ja":{"de": "ドイツ語","en": "英語","es": "スペイン語","fr": "フランス語","ja": "日本語"},' +
'"ko":{"de": "독일어","en": "영어","es": "스페인어","fr": "프랑스어","ja": "일본어","ko": "한국어"},' +
'"nl-NL":{"de": "Duits","en": "Engels","es": "Spaans","fr": "Frans","ko": "Koreaans","nl-NL": "Nederlands"},' +
'"pa":{"de": "ਜਰਮਨ","en": "ਅੰਗਰੇਜ਼ੀ","es": "ਸਪੇਨੀ","fr": "ਫ਼ਰਾਂਸੀਸੀ","pa": "ਪੰਜਾਬੀ"},' +
'"pl":{"de": "Niemiecki","en": "Angielski","es": "Hiszpański","fr": "Francuski","pl": "Polski"},' +
'"pt":{"de": "Alemão","en": "Inglês","eo": "Esperanto","es": "Espanhol","fr": "Francês","it": "Italiano","pl": "Polonês","pt": "Português"},' +
'"ro":{"de": "Germană","en": "Engleză","es": "Spaniolă","fr": "Franceză","pt": "Portugheză","ro": "Română"},' +
'"ru":{"de": "Немецкий","en": "Английский","es": "Испанский","fr": "Французский","ro": "Румынский","ru": "Русский","sv": "Шве́дский"},' +
'"ta":{"de": "ஜெர்மன்","en": "ஆங்கிலம்","es": "எசுப்பனியம்","fr": "பிரெஞ்சு","ru": "ரஷியன்","ta": "தமிழ்"},' +
'"te":{"de": "జర్మన్","en": "ఆంగ్ల భాష","es": "స్పానిష్","fr": "ఫ్రెంచి భాష","te": "తెలుగు"},' +
'"th":{"de": "ภาษาเยอรมัน","en": "ภาษาอังกฤษ","es": "ภาษาสเปน","fr": "ภาษาฝรั่งเศส","th": "ภาษาไทย"},' +
'"tl":{"de": "Aleman","en": "Inggles","es": "Kastila","fr": "Pranses","tl": "Tagalog"},' +
'"tr":{"de": "Almanca","en": "İngilizce","es": "İspanyolca","fr": "Fransızca","ru": "Rusça","tl": "Tagalog","tr": "Türkçe"},' +
'"uk":{"de": "Німецька","en": "Англійська","es": "Іспанська","fr": "Французька","tr": "Турецька","uk": "Українська"},' +
'"vi": {"de": "Tiếng Đức","en": "Tiếng Anh","es": "Tiếng Tây Ban Nha","fr": "Tiếng Pháp","vi": "Tiếng Việt"},' +
'"zh-CN":{"de": "德语","en": "英语","es": "西班牙语","fr": "法语","vi": "越南语","zh-CN": "中文"}}';

var languageNames = JSON.parse(parseStr);

// Function to do what _.pick() did before.
// Takes an array of the fields desired as second arg
// Needed because _ is no longer defined
function pick(course, arr) {
    var tmp = {};
    for (var i = 0; i < arr.length; i++) {
        tmp[arr[i]] = course[arr[i]];
    }
    return tmp;
}

// Function to calculate the level of a course since Duo does not store this info anymore
// In fact, they themselves also calculate levels when needed, albeit probably better than this
function calculateLevel(xp,cutoffs) {
    for (var i = 1; i < cutoffs.length; i++) {
        if (cutoffs[i - 1] >= xp) {
            return i;
        }
    }
    return 1;
}

// Function that switches courses.
// NOTE: when switching between courses from the same base language,
//       I noticed that Duo sends a PATCH request instead of simply
//       using POST (POST is still involved obviously). It may be
//       worth it to look into how to do this here as well.
function switchCourse(from, to) {

	// Needed due to abbreviations used in Duo's language codes
	// Again, thanks go jrikhal for this bit of code
    if(from==='nl-NL'){from='dn';}
    if(from==='zh-CN'){from='zs';}
    if(from==='no-BO'){from='nb';}
    if(to==='nl-NL'){to='dn';}
    if(to==='zh-CN'){to='zs';}
    if(to==='no-BO'){to='nb';}

    $.post('/api/1/me/switch_language', {
            from_language: from,
            learning_language: to
        },
        function (data) {
            location.reload();
        }
    );
}

// Function to update the course list
function updateCourses(A) {

    if(localStorage.getItem('dcs.courses') && !GM_getValue('dcs.courses')){
      // switch to greasemonkey storage
      GM_setValue('dcs.courses', localStorage.getItem('dcs.courses'));
    }

    var rCourses = JSON.parse(GM_getValue('dcs.courses', '{}'));

    var learning = [].filter.call(Object.values(A.courses), function(course){ return course.fromLanguage === duo.uiLanguage; }),
        levelCutoffs = A.config.xpLevelCutoffs;

    rCourses[duo.uiLanguage] = learning.map(function(course){
        var rObj = pick(course, ['learningLanguage','xp']);
        rObj.level = calculateLevel(course.xp, levelCutoffs);
        return rObj;
    });

    GM_setValue('dcs.courses', JSON.stringify(rCourses));
    return rCourses;
}

function sortList() {
    var listitems = $('._20LC5 > ._2kNgI._1qBnH').get();
    listitems.sort(function(a, b) {
        return $(b).find('li._2kNgI._1qBnH').size() - $(a).find('li._2kNgI._1qBnH').size();
    });
    $.each(listitems, function(idx, itm) { $(itm).insertBefore('.qsrrc'); });
}

$(document).on({
    mouseenter: function() {
        // Do nothing if we've already updated it
        if($('ul._20LC5 ul:not(._1XE6M)').size() > 0)
            return;

        // Get and update languages in local storage
        var D = JSON.parse(localStorage.getItem('duo.state'));
        var courses = updateCourses(D);
        
        // Do nothing if there's only one base language
        if(Object.keys(courses).length < 2)
            return;

        // I'm not sure why this can't be invoked in top level.
        $('._6t5Uh').on('click', '.extra-choice', function(){
            var from = $(this).attr('data-from');
            var to = $(this).attr('data-to');
            switchCourse(from, to);
        });

        // Get localized strings
        var levelLabel = document.querySelectorAll('._20LC5 ._1fA14')[0].textContent.split(' ')[0]+' ';
        var currLangNames = languageNames[duo.uiLanguage];
        
        // Remove the current list
        $('._20LC5 ._2kNgI._1qBnH').remove();

        $('._1XE6M').remove();
        
        // Change top-level heading
        var header2 = $('._20LC5 > ._2PurW > h6').text();
        $('._20LC5 > ._2PurW > h6').text(header1[duo.uiLanguage] || 'From');

        // Create top-level list using source languages
        $.each(courses, function( from, value ) {
            fromCourse = '<li class="_2kNgI _1qBnH choice"><span class="'+ flags[from] +' _3viv6 _3vx2Z _1ct7y _2XSZu"></span>'+(currLangNames[from] || languageNames.en[from])+'<ul class="OSaWc _2HujR _1ZY-H language-sub-courses '+from+'"><li class="_2PurW"><h6>'+header2+'</h6></li></ul></li>';

            fromCourse = $(fromCourse).insertBefore('.qsrrc');
            
            value.sort(function(a, b) { return b.level - a.level; });
            $.each(value, function( fromx, v ) {
                to = v.learningLanguage;
                sub = $('<li class="_2kNgI _1qBnH extra-choice" data-from="'+from+'" data-to="'+to+'"><span class="'+ flags[to] +' _3viv6 _3vx2Z _1ct7y _2XSZu"></span>'+(currLangNames[to] || languageNames.en[to])+' '+'</span><span class="_1fA14">'+levelLabel+v.level+'</span></li>');
                sub.appendTo('ul.'+from);
                if(from == duo.uiLanguage && to == D.user.learningLanguage) {
                    sub.addClass('_1oVFS');
                }
            });

            if(from == duo.uiLanguage) {
                fromCourse.addClass('_1oVFS');
            }
        });

        sortList();
    }
}, '._3I51r._3HsQj._2OF7V');

$(document).on({
    mouseenter: function () {
        $(this).children('.language-sub-courses').attr('style', 'display: block !important');
    },
    mouseleave: function () {
        $(this).children('.language-sub-courses').attr('style', 'display: none !important');
    }
}, '.choice');