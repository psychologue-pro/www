
var mr = (function ($, window, document){
    "use strict";

    var mr         = {},
        components = {documentReady: [],documentReadyDeferred: [], windowLoad: [], windowLoadDeferred: []};


    $(document).ready(documentReady);
    $(window).load(windowLoad);

    function documentReady(context){

        context = typeof context == typeof undefined ? $ : context;
        components.documentReady.concat(components.documentReadyDeferred).forEach(function(component){
            component(context);
        });
    }

    function windowLoad(context){

        context = typeof context == "object" ? $ : context;
        components.windowLoad.concat(components.windowLoadDeferred).forEach(function(component){
           component(context);
        });
    }

    mr.setContext = function (contextSelector){
        var context = $;
        if(typeof contextSelector !== typeof undefined){
            return function(selector){
                return $(contextSelector).find(selector);
            };
        }
        return context;
    };

    mr.components    = components;
    mr.documentReady = documentReady;
    mr.windowLoad    = windowLoad;

    return mr;
}(jQuery, window, document));


//////////////// Utility Functions
mr = (function (mr, $, window, document){
    "use strict";
    mr.util = {};

    mr.util.requestAnimationFrame    = window.requestAnimationFrame ||
                                       window.mozRequestAnimationFrame ||
                                       window.webkitRequestAnimationFrame ||
                                       window.msRequestAnimationFrame;

    mr.util.documentReady = function($){
        var today = new Date();
        var year = today.getFullYear();
        $('.update-year').text(year);
    };

    mr.util.getURLParameter = function(name) {
        return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [undefined, ""])[1].replace(/\+/g, '%20')) || null;
    };


    mr.util.capitaliseFirstLetter = function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    mr.util.slugify = function(text, spacesOnly){
        if(typeof spacesOnly !== typeof undefined){
            return text.replace(/ +/g, '');
        }else{
            return text
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');
        }
    };

    mr.util.sortChildrenByText = function(parentElement, reverse){
        var $parentElement = $(parentElement);
        var items          = $parentElement.children().get();
        var order          = -1;
        var order2         = 1;
        if(typeof reverse !== typeof undefined){order = 1; order2 = -1;}

        items.sort(function(a,b){
          var keyA = $(a).text();
          var keyB = $(b).text();

          if (keyA < keyB) return order;
          if (keyA > keyB) return order2;
          return 0;
        });

        // Append back into place
        $parentElement.empty();
        $(items).each(function(i, itm){
          $parentElement.append(itm);
        });
    };

    // Set data-src attribute of element from src to be restored later
    mr.util.idleSrc = function(context, selector){

            selector  = (typeof selector !== typeof undefined) ? selector : '';
            var elems = context.is(selector+'[src]') ? context : context.find(selector+'[src]');

        elems.each(function(index, elem){
            elem           = $(elem);
            var currentSrc = elem.attr('src'),
                dataSrc    = elem.attr('data-src');

            // If there is no data-src, save current source to it
            if(typeof dataSrc === typeof undefined){
                elem.attr('data-src', currentSrc);
            }

            // Clear the src attribute
            elem.attr('src', '');

        });
    };

    // Set src attribute of element from its data-src where it was temporarily stored earlier
    mr.util.activateIdleSrc = function(context, selector){

        selector     = (typeof selector !== typeof undefined) ? selector : '';
        var elems    = context.is(selector+'[src]') ? context : context.find(selector+'[src]');

        elems.each(function(index, elem){
            elem = $(elem);
            var dataSrc    = elem.attr('data-src');

            // If there is no data-src, save current source to it
            if(typeof dataSrc !== typeof undefined){
                elem.attr('src', dataSrc);
            }
        });
    };

    mr.util.pauseVideo = function(context){
        var elems = context.is('video') ? context : context.find('video');

        elems.each(function(index, video){
            var playingVideo = $(video).get(0);
            playingVideo.pause();
        });
    };

    mr.components.documentReady.push(mr.util.documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Scroll Functions
mr = (function (mr, $, window, document){
    "use strict";

    mr.scroll           = {};
    mr.scroll.listeners = [];
    mr.scroll.y         = 0;
    mr.scroll.x         = 0;

     var documentReady = function($){

        // Check if scroll-assist is on
        if($('body').hasClass('scroll-assist')){
            mr.scroll.assisted = true;
        }

        //////////////// Capture Scroll Event and fire scroll function

        addEventListener('scroll', function(evt) {
                //if(!mr.scroll.assisted){
                    window.mr.scroll.y = window.pageYOffset;
                //}
                window.mr.scroll.update(evt);
        }, false);

    };

    mr.scroll.update = function(event){
        // Loop through all mr scroll listeners
        for (var i = 0, l = mr.scroll.listeners.length; i < l; i++) {
           mr.scroll.listeners[i](event);
        }
    };

    mr.scroll.documentReady = documentReady;

    mr.components.documentReady.push(documentReady);

    return mr;

}(mr, jQuery, window, document));

//////////////// Backgrounds
mr = (function (mr, $, window, document){
    "use strict";

    var documentReady = function($){

        //////////////// Append .background-image-holder <img>'s as CSS backgrounds

	    $('.background-image-holder').each(function() {
	        var imgSrc = $(this).children('img').attr('src');
	        $(this).css('background', 'url("' + imgSrc + '")').css('background-position', 'initial').css('opacity','1');
	    });
    };

    mr.backgrounds = {
        documentReady : documentReady
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Cookies
mr = (function (mr, $, window, document){
    "use strict";

    mr.cookies = {

        getItem: function (sKey) {
            if (!sKey) { return null; }
            return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
        },
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
                var sExpires = "";
                if (vEnd) {
                  switch (vEnd.constructor) {
                    case Number:
                      sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                      break;
                    case String:
                      sExpires = "; expires=" + vEnd;
                      break;
                    case Date:
                      sExpires = "; expires=" + vEnd.toUTCString();
                      break;
                }
            }
            document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
            return true;
        },
        removeItem: function (sKey, sPath, sDomain) {
            if (!this.hasItem(sKey)) { return false; }
            document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
            return true;
        },
        hasItem: function (sKey) {
            if (!sKey) { return false; }
            return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
        },
        keys: function () {
            var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
            for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
            return aKeys;
        }
    };

    return mr;

}(mr, jQuery, window, document));

//////////////// Maps
mr = (function (mr, $, window, document){
    "use strict";

    mr.maps = {};

    var documentReady = function($){
        // Interact with Map once the user has clicked (to prevent scrolling the page = zooming the map

        $('.map-holder').on('click', function() {
            $(this).addClass('interact');
        }).removeClass('interact');

        mr.maps.initAPI();
        mr.maps.init();

    };
    mr.maps.documentReady = documentReady;

    mr.maps.initAPI = function(){
        // Load Google MAP API JS with callback to initialise when fully loaded
        if(document.querySelector('[data-maps-api-key]') && !document.querySelector('.gMapsAPI')){
            if($('[data-maps-api-key]').length){
                var script = document.createElement('script');
                var apiKey = $('[data-maps-api-key]:first').attr('data-maps-api-key');
                apiKey = typeof apiKey != typeof undefined ? apiKey : '';
                if(apiKey !== ''){
                    script.type = 'text/javascript';
                    script.src = 'https://maps.googleapis.com/maps/api/js?key='+apiKey+'&callback=mr.maps.init';
                    script.className = 'gMapsAPI';
                    document.body.appendChild(script);
                }
            }
        }
    };

    mr.maps.init = function(){
        if(typeof window.google !== "undefined"){
            if(typeof window.google.maps !== "undefined"){
                $('.map-container[data-maps-api-key]').each(function(){
                    var mapElement    = this,
                        mapInstance   = $(this),
                        mapJSON       = typeof mapInstance.attr('data-map-style') !== typeof undefined ? mapInstance.attr('data-map-style'): false,
                        mapStyle      = JSON.parse(mapJSON) || [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}],
                        zoomLevel     = (typeof mapInstance.attr('data-map-zoom') !== typeof undefined && mapInstance.attr('data-map-zoom') !== "") ? mapInstance.attr('data-map-zoom') * 1: 17,
                        latlong       = typeof mapInstance.attr('data-latlong') !== typeof undefined ? mapInstance.attr('data-latlong') : false,
                        latitude      = latlong ? 1 *latlong.substr(0, latlong.indexOf(',')) : false,
                        longitude     = latlong ? 1 * latlong.substr(latlong.indexOf(",") + 1) : false,
                        geocoder      = new google.maps.Geocoder(),
                        address       = typeof mapInstance.attr('data-address') !== typeof undefined ? mapInstance.attr('data-address').split(';'): [""],
                        markerImage   = typeof mapInstance.attr('data-marker-image') !== typeof undefined ? mapInstance.attr('data-marker-image'): 'img/mapmarker.png',
                        markerTitle   = "We Are Here",
                        isDraggable   = $(document).width() > 766 ? true : false,
                        map, marker,
                        mapOptions = {
                            draggable: isDraggable,
                            scrollwheel: false,
                            zoom: zoomLevel,
                            disableDefaultUI: true,
                            styles: mapStyle
                        };

                    if(typeof mapInstance.attr('data-marker-title') !== typeof undefined && mapInstance.attr('data-marker-title') !== "" )
                    {
                        markerTitle = mapInstance.attr('data-marker-title');
                    }

                    if(address !== undefined && address[0] !== ""){
                            geocoder.geocode( { 'address': address[0].replace('[nomarker]','')}, function(results, status) {
                                if (status == google.maps.GeocoderStatus.OK) {
                                var map = new google.maps.Map(mapElement, mapOptions);
                                map.setCenter(results[0].geometry.location);

                                address.forEach(function(address){
                                    var markerGeoCoder;

                                    markerImage = {url: typeof window.mr_variant === typeof undefined ? markerImage : '../img/mapmarker.png', scaledSize: new google.maps.Size(50,50)};
                                    if(/(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/.test(address) ){
                                        var latlong = address.split(','),
                                        marker = new google.maps.Marker({
                                                        position: { lat: 1*latlong[0], lng: 1*latlong[1] },
                                                        map: map,
                                                        icon: markerImage,
                                                        title: markerTitle,
                                                        optimised: false
                                                    });
                                    }
                                    else if(address.indexOf('[nomarker]') < 0){
                                        markerGeoCoder = new google.maps.Geocoder();
                                        markerGeoCoder.geocode( { 'address': address.replace('[nomarker]','')}, function(results, status) {
                                            if (status === google.maps.GeocoderStatus.OK) {
                                                marker = new google.maps.Marker({
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle,
                                                    position: results[0].geometry.location,
                                                    optimised: false
                                                });
                                            }
                                            else{
                                                console.log('Map marker error: '+status);
                                            }
                                        });
                                    }

                                });
                            } else {
                                console.log('There was a problem geocoding the address.');
                            }
                        });
                    }
                    else if(typeof latitude !== typeof undefined && latitude !== "" && latitude !== false && typeof longitude !== typeof undefined && longitude !== "" && longitude !== false ){
                        mapOptions.center   = { lat: latitude, lng: longitude};
                        map                 = new google.maps.Map(mapInstance, mapOptions);
                        marker              = new google.maps.Marker({
                                                    position: { lat: latitude, lng: longitude },
                                                    map: map,
                                                    icon: markerImage,
                                                    title: markerTitle
                                                });

                    }

                });
            }
        }
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Navigation
mr = (function (mr, $, window, document){
    "use strict";

    // The navigation object
    mr.navigation = {};

    // The overall nav element (one per page)
    mr.navigation.nav = {};

    // In case there is a bar type nav element
    mr.navigation.bar = {};

    var documentReady = function($){

        mr.navigation.nav.element = $('nav');
        mr.navigation.bar.element = $('nav .nav-bar');

        // Check for nav element and set outerHeight variable
        if(mr.navigation.nav.element.length){
            mr.navigation.nav.outerHeight = mr.navigation.nav.element.outerHeight();
        }else{
            mr.navigation.nav.outerHeight = 0;
        }
        // Check for a bar type nav
        if(mr.navigation.bar.element.length){
            mr.navigation.bar.init();
        }

        //////////////// Mobile Menu Toggle

        $('.nav-mobile-toggle').on('click', function(){
            $('nav').toggleClass('nav-open');
        });

        $('.menu li').on('click', function(ev){
            var navItem = $(this),
                e       = ev || window.event;

            e.stopPropagation();
            if (navItem.find('ul').length) {
                navItem.toggleClass('active');
            } else {
                navItem.parents('.active').removeClass('active');
            }
        });

        //////////////// Mobile Menu Applets

        $('.module-applet').on('click', function(){
            $(this).toggleClass('active');
        });

        $('.module-applet__body').each(function(){
            var moduleBody = $(this);
            var farRight = moduleBody.offset().left + moduleBody.outerWidth();
            if(farRight > $(window).width()){
                moduleBody.addClass('pos-right');
            }
        });

        //////////////// Menu dropdown positioning

        $('.menu > li > ul').each(function() {
            var $window          = $(window);
            var dropDown         = $(this);
            var menu             = dropDown.offset();
            var farRight         = menu.left + dropDown.outerWidth(true);
            var windowWidth      = $window.width();
            var multiColumn      = dropDown.hasClass('multi-column');

            if (farRight > windowWidth && !multiColumn) {
                dropDown.addClass('make-right');
            } else if (farRight > windowWidth && multiColumn) {
                var difference = farRight - windowWidth;
                dropDown.css('margin-left', -(difference));
            }
        });

    };

    ///
    ///    END DOCUMENTREADY
    ///
    ////////////////////////////////////

    mr.navigation.bar.init = function(){
        // Get data-fixed-at attribute
        var fixedAt = mr.navigation.bar.element.attr('data-fixed-at');
        // Save mr.navigation.bar.fixedAt as a number or null if not set
        mr.navigation.bar.fixedAt = (typeof fixedAt !== typeof undefined) ? parseInt(fixedAt.replace('px', ''), 10) : false;

        // Only run scroll listeners if bar does not already have nav--fixed class
        if(mr.navigation.bar.element.hasClass('nav--fixed')){
            // We know this is a fixed nav bar
            mr.navigation.bar.isFixed = true;
        }else if (fixedAt) {
            // If fixedAt has a value (not false) and nav bar has no ".nav--fixed" class
            // add navigation.bar.update to scroll event cycle
            mr.navigation.nav.element.css('min-height', mr.navigation.nav.outerHeight);
            mr.navigation.bar.isFixed = false;
            mr.scroll.listeners.push(mr.navigation.bar.update);
        }


    };

    mr.navigation.bar.update = function(){
        // If page is scrolled beyond the point where nav should be fixed
        if( (mr.scroll.y > mr.navigation.bar.fixedAt) && !mr.navigation.bar.isFixed)
        {
            mr.navigation.bar.isFixed = true;
            mr.navigation.bar.element.addClass('nav--fixed');
        }

        if( (mr.scroll.y < mr.navigation.bar.fixedAt) && mr.navigation.bar.isFixed)
        {
            mr.navigation.bar.isFixed = false;
            mr.navigation.bar.element.removeClass('nav--fixed');
        }
    };

    mr.navigation.documentReady = documentReady;

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Parallax
mr = (function (mr, $, window, document){
    "use strict";

    var documentReady = function($){

        var $window      = $(window);
        var windowWidth  = $window.width();
        var windowHeight = $window.height();
        var navHeight    = $('nav').outerHeight(true);

        // Disable parallax on mobile

        if ((/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera)) {
            $('section').removeClass('parallax');
        }

        if (windowWidth > 768) {
            var parallaxHero = $('.parallax:nth-of-type(1)'),
                parallaxHeroImage = $('.parallax:nth-of-type(1) .background-image-holder');

            parallaxHeroImage.css('top', -(navHeight));
            if(parallaxHero.outerHeight(true) == windowHeight){
                parallaxHeroImage.css('height', windowHeight + navHeight);
            }
        }
    };

    mr.parallax = {
        documentReady : documentReady
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Scroll Reveal
mr = (function (mr, $, window, document){
    "use strict";

    var documentReady = function($){

        var $body = $('body');
        if($('body[data-reveal-selectors]').length){
            window.sr = ScrollReveal();
        	var selectors = $body.attr('data-reveal-selectors');

        	// Gather scroll reveal options
        	var revealTiming = 1000;
        	if($('body[data-reveal-timing]').length){
        		revealTiming = $body.attr('data-reveal-timing');
        	}

        	// Initialize scroll reveal
        	window.sr.reveal(''+selectors+'', { viewFactor: 0.1, duration: ''+revealTiming+'', scale: 1, mobile: false });

        }

    };

    mr.scrollreveal = {
        documentReady : documentReady
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Smoothscroll
mr = (function (mr, $, window, document){
    "use strict";

    var documentReady = function($){
        // Smooth scroll to inner links
        var innerLinks = $('a.inner-link');

        if(innerLinks.length){
            innerLinks.each(function(){
                var link = $(this);
                var href = link.attr('href');
                if(href.charAt(0) !== "#"){
                    link.removeClass('inner-link');
                }
            });

            var offset = 0;
            if($('body[data-smooth-scroll-offset]').length){
                offset = $('body').attr('data-smooth-scroll-offset');
                offset = offset*1;
            }

            smoothScroll.init({
                selector: '.inner-link',
                selectorHeader: null,
                speed: 750,
                easing: 'easeInOutCubic',
                offset: offset
            });
        }
    };

    mr.smoothscroll = {
        documentReady : documentReady
    };

    mr.components.documentReady.push(documentReady);
    return mr;

}(mr, jQuery, window, document));

//////////////// Transitions
$(window).bind("pageshow", function(event) {
    if (event.originalEvent.persisted) {
        window.location.reload();
    }
});

mr = (function (mr, $, window, document){
    "use strict";

    var documentReady = function($){
        $('a:not([href^="#"]):not([href^="tel"]):not([href^="mailto"]):not([data-lightbox]):not([href=""]):not([target="_blank"]):not(.modal-trigger):not([class*="lb-"])').on('click', function(){
            $('[class*="transition--"]').removeClass('transition--active');
        });
    };

    var windowLoad = function(){
        $('[class*="transition--"]').addClass('transition--active');
        $('.loader').addClass('loader--fade');
    };

    mr.transitions = {
        documentReady : documentReady,
        windowLoad : windowLoad
    };

    mr.components.documentReady.push(documentReady);
    mr.components.windowLoad.push(windowLoad);
    return mr;

}(mr, jQuery, window, document));
