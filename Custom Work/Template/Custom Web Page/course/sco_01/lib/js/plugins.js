/****************************************************************************

    plugins.js Copyright 2016 Sublime Media LLC

    TODO:

*****************************************************************************/
'use strict';
window.define([
    'require',
	// 'plugins/vimeo-player.min',
    'plugins/appear',
    'plugins/imagesloaded.pkgd',
    'plugins/isotope.pkgd',
    'plugins/jqBootstrapValidation',
    'plugins/jquery.easing.1.3',
    'plugins/jquery.fitvids',
    'plugins/jquery.magnific-popup.min',
    'plugins/jquery.mb.YTPlayer.min',
    'plugins/jquery.parallax-1.1.3',
    'plugins/jquery.simple-text-rotator.min',
    'plugins/jquery.superslides.min',
    'plugins/jquery.keyboardtrap.min',
    'plugins/jquery.screenreadertrap.min',
    'plugins/jquery.focusable.min',
    'plugins/owl.carousel.min',
    'plugins/packery-mode.pkgd.min',
    'plugins/smoothscroll',
    'plugins/wow.min',
    'plugins/jquery.jplayer'
	], function(
        require,
        // vimeoPlayer,
        appear,
        imagesLoaded,
        Isotope,
        jqBootstrapValidation,
        jqEasing,
        jqFitvids,
        jqMagnificPopup,
        jqYtPlayer,
        jqParallax,
        jqSimpleTextRotator,
        jqSUperSlides,
        jqKeyboardTrap,
        jqScreenreaderTrap,
        jqFocusable,
        owlCarousel,
        packeryMode,
        smoothScroll,
        wow,
        jPlayer
    ) {
		//Initialize the sco namespace and globals
		var plugins = {};

		plugins.init = function(next){
            // window.VimeoPlayer = vimeoPlayer;
	        // take care of any plugin initializing here
	        var $player = $('<div>', {'id': 'jPlayer', 'aria-hidden':'true'}).appendTo('body');
            $player.jPlayer({
                swfPath:'lib/js/plugins/jquery.jplayer.swf',
                supplied: 'mp3',
                ready: function(){
                }
            });
            require( [ 'jquery-bridget/jquery-bridget' ],
            function( jQueryBridget ) {
              // make Isotope a jQuery plugin
              jQueryBridget( 'isotope', Isotope, $ );
              // now you can use $().isotope()
            });
            // jQuery plugin for or operator
            ( function($) {
                $.fn.or = function( fallbackSelector ) {
                    return this.length ? this : $( fallbackSelector || 'body' );
                };
            }( jQuery ));
	        next();
		};

	    return plugins;
	}
);