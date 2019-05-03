/****************************************************************************

    sco.custom Copyright 2016 Sublime Media LLC

    TODO: 
        

*****************************************************************************/
'use strict';
window.define(function(){return function(sco){
    // Override sco object here
    var holder;
    var widgetAnimation      = 'slideInUp';
	var widgetCoverAnimation = 'flipInX';
	var $window = $(window);
	var wrapperMaxWidth = 1200;
	var windowHeight = $window.height();
	var windowWidth = Math.max($window.width(), window.innerWidth);
	var wrapperWidth = windowWidth;
	if (wrapperWidth >= 1200){
		wrapperWidth = 1200;
	}
	$window.resize(function () {
		windowHeight = $window.height();
		windowWidth = Math.max($window.width(), window.innerWidth);
		var wrapperWidth = windowWidth;
		if (wrapperWidth >= 1200){
			wrapperWidth = 1200;
		}
	});
	/* ---------------------------------------------- /*
	 * Mobile detect
	/* ---------------------------------------------- */

	var mobileTest;
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
	.test(navigator.userAgent)) {
		mobileTest = true;
	} else {
		mobileTest = false;
	}

	/* ---------------------------------------------- /*
	 * Safari detect
	/* ---------------------------------------------- */

	var safariTest = navigator.vendor.indexOf('Apple')===0 && 
	/\sSafari\//.test(navigator.userAgent);
	var ipadTest = 	/iPad/.test(navigator.userAgent);
	if (ipadTest){
		widgetCoverAnimation = 'zoomIn';
		if (parent && parent.document && 
			parent.document.getElementById('activityFrame')
		){
			var bodyHeight = 0;
			var observer;
			var $body = $('body')
			var setHeight = function(){
				bodyHeight = $body.height();
				parent.document.getElementById('activityFrame').style.height = bodyHeight + 'px';
			};
			$(window).on('scroll.sco.custom.minheight resize.sco.custom.minheight', function(event){
				$(window).off('scroll.sco.custom.minheight resize.sco.custom.minheight');
				$('html').addClass('scrolled');
				
				
				if (MutationObserver){
					observer = new MutationObserver(function(mutations) {
					    if (bodyHeight !== $body.height()){
					    	setHeight();
					    }
					});
					observer.observe(document.body, {attributes:true, subtree: true});
				}
				setHeight();
				
			});
			$(document).on('beforeDrawScoContent.sco.custom.minheight',
		    	function(event, pageId){
		    		parent.document.getElementById('activityFrame').style.height = "100%";
		    	}
		    );
		    $(document).on('afterdrawScoContent.sco.custom.minheight',
		    	function(event, pageId){
		    		setHeight();
		    	}
		    );
		}
	}

    var requireCustomJs = requirejs.config({
    	baseUrl: 'lib_custom/js'
    });
    // load additional js here. baseUrl for this
    // function is the lib_custom js folder
    requireCustomJs(['holder'], function(Holder){
    	holder = Holder;
    	
    });

    var toggleKB = function(event){
    	if (event.type === 'mousedown') {
	        $('body').removeClass('keys-active');
	    }
	    if (event.type === 'keydown') {
	        $('body').addClass('keys-active');
	    }
    };

    $(document).on('mousedown.sco.custom.kbfocus', toggleKB);
    $(document).on('keydown.sco.custom.kbfocus', toggleKB);
    
    var _initializeNavigation = function (){
    	// add icons
    	$('#scoMenuHamburger').on('click.sco.custom', function(event){
    		event.preventDefault();
    		$('#scoMenu').toggleClass('collapsed');
    		$('html, body').animate({ scrollTop: $(document).height() }, 'slow');
    	});

    	sco.ui.select.menu.modules().on('click.sco.custom', function(event){
    		event.preventDefault();
    		var $this = $(this);
            if ($this.data('moduleId')){
                sco.moduleId = $this.data('moduleId');
                var currModId = sco.ui.select.menu
                .pageModule(sco.pageId).data('moduleId');
                if (sco.moduleId !== currModId){
                	// different module. Select first page and draw the submenu
                	var pageId = sco.ui.select.menu
                	.modulePages(sco.moduleId).data('pageId');
                	sco.ui.activePage(pageId);
                	sco.ui.drawContent();
                }
            }
        });
    };

    var _rndId = function(){
    	return 'id' + Math.floor((Math.random() * 10000000) + 1);
	};

    var _scaleFonts = function(){
    	var ratioWidth = Math.max($(window).width(), window.innerWidth);
    	if (ratioWidth >= 1200){
    		ratioWidth = 1200;
    	}
		var windowRatio = ratioWidth/768;
		$('body').css('fontSize', windowRatio + 'em');
		// $('.widget-button-wrapper').css('fontSize', windowRatio + 'rem');
    };

    var _renderPlaceholderImages = function(){
    	holder.run();
    };
    var _registerCompletionButton = function(){
    	$('#completePackage').click(function(){
    		window.top.close();
    	});
    };
    var _loadPageContentPlugins = function(){
    	var requirePageContentJs = requirejs.config({
    		baseUrl: 'lib_custom/js'
	    });
	   //  // load additional js here. baseUrl for this
	   //  // function is the lib_custom js folder
	    // requirePageContentJs(['bootstrap3_player'], function(bs3p){
	    // 	console.log('bootstrap player loaded',bs3p)
	    // });
    };

    var _stopMedia = function(){
    	$('#jPlayer').jPlayer( 'clearMedia' );
    	$(document).triggerHandler('stopmedia');
    	$('iframe[src*="https://hubtv.corp.ebay.com"]').each(function(){
    		// can't control videos - cross domain security violation...
    	});
    };

    var _hideReveals = function(){
    	$('.reveal').each(function(){
    		$(this)
			.removeClass(widgetCoverAnimation)
			.addClass('hidden')
			.siblings('.widget-button-wrapper')
			.removeClass('hidden');
    	});

    };
    var _initializePageComponents = function(){

		/* ---------------------------------------------- /*
		 * Initialization general scripts for all pages
		/* ---------------------------------------------- */

		// var moduleHero  = $('#hero'),
		// 	slider      = $('#slides'),
		// 	navbar      = $('.navbar-custom'),
		// 	filters     = $('#filters'),
		// 	worksgrid   = $('#works-grid'),
		// 	grid        = $('.grid'),
		// 	modules     = $('.module-hero, .module, .module-small'),
		// 	navbatTrans,
		// 	mobileTest;
		
		/* ---------------------------------------------- /*
		 * Replace external links for chrome compatiblity	
		/* ---------------------------------------------- */

		$('a').each(function(){
			var thisHref = $(this).attr('href');
			if (thisHref !== '' && thisHref !== '#' && thisHref.indexOf('#') !== 0){
				$(this).on('click', function(event){
					event.preventDefault();
					window.open( thisHref, '_blank', 
						'toolbar=0,resizable=yes,scrollbars=yes');
				});
			}
		});


		/* ---------------------------------------------- /*
		 * Setting height of module columns and fonts therein
		/* ---------------------------------------------- */

		function resizeRowHeight(){
			// column height percentage is based on a full width column (12) 
			// at the largest column size. e.g: lg
			windowWidth = Math.max($(window).width(), window.innerWidth);
			wrapperWidth = windowWidth;
			if (wrapperWidth >= 1200){
				wrapperWidth = 1200;
			}
			//console.log('CurrentBootstrapScreenSize', sco.bootstrap.size);
			$('.row[class*="row-height-"]').each(function(){
				var heightRatio = Number(
					/(?:row-height-)(\d+)/g.exec($(this).attr('class'))[1]
				) / 100;

				$(this).children('[class*="col-"]').each(function(){
					//var sizes = ['lg', 'md', 'sm', 'xs'];
					var sizes = ['lg', 'md', 'sm'];
					var cl = $(this).attr('class');
					var numColumns = 0;
					for (var i = 0; i < sizes.length; i++) {
						if (cl.indexOf('col-' + sizes[i]) !== -1 &&
							numColumns === 0
						){
							numColumns = Number(
								/(?:col-)(?:sm|md|lg)(?:-)(\d+)/g
								.exec($(this).attr('class'))[1]
							);
						}
					}
					var rowHeight;
					if (wrapperWidth > 767){
						// desktop mode
						rowHeight = wrapperWidth * heightRatio;
						$(this).css('fontSize', '1em');
					}else{
						// phone mode
						var numXsColumns = 12;
						if (cl.indexOf('col-xs-') !== -1){
							numXsColumns = Number(
								/(?:col-)(?:xs)(?:-)(\d+)/g
								.exec($(this).attr('class'))[1]
							);
						}
						rowHeight = (wrapperWidth * heightRatio) * (numXsColumns/numColumns);
						// scale the fonts up
						$(this).css('fontSize', (numXsColumns/numColumns) + 'em');
					}
					$(this).height(rowHeight);
					//$(this).css('min-height',rowHeight);
				});
			});
		}
		$(function(){
			resizeRowHeight();
			$(window).on('resize.sco.custom.resizerowheight', resizeRowHeight);
		});



		// company grid

		$('.company-grid [class*="col-"]').each(function(){
			var $container = $(this);
			if ($container.find('.reveal').length){
				$container.find('.reveal').attr('aria-live', 'assertive')
				.append($('<span>',{
					'class':'glyphicon glyphicon-remove',
					'aria-hidden': 'true'
				}));
				$container.append(
					$('<img>',{
						'src': $container.attr('data-hover-background'),
						'class': 'animated fadeIn'
					}),
					$('<span>',{
						'class':'glyphicon glyphicon-plus',
						'aria-hidden': 'true'
					})
				).attr('aria-live', 'assertive');
				var $button = $('<button>', {
					'tabindex': '0'
				}).on('click', function(event){
					event.preventDefault();
					if ($container.find('.reveal').hasClass('hidden')){
						_hideReveals();
						$container.find('.reveal')
						.removeClass('hidden')
						.addClass(widgetCoverAnimation + ' animated');
					}else{
						$container.find('.reveal')
						.removeClass(widgetCoverAnimation)
						.addClass('hidden');
					}
				});
				$container.wrapInner($button);
			}
		});

		/* ---------------------------------------------- /*
		 * filter grid
		/* ---------------------------------------------- */

		// $('a', '.grid-filters').on('click', function(event) {
		$('.grid-filters').on('click', function(event) {
			event.preventDefault();
			var $filters = $(this).closest('ul');
			var filterTarget = $filters.data('filterTarget');
			$(filterTarget).triggerHandler('filter', $(this));
		});

		var onFilterGrid = function(event, filter){
			event.preventDefault();
			var $filter = $(filter);
			var $filterGrid = $(event.target);
			var $filters = $filterGrid.data('filterSource');
			$('.current', $filters).removeClass('current');
			$filter.addClass('current');
			$filter.addClass('completed');
			if ($('.completed', $filters).length === $('li', $filters).length){
				$filterGrid.addClass('completed');
			}
			var selector = $filter.attr('data-filter');
			$filterGrid.isotope({
				filter: selector
			});
		};

		var sizeFilterGrid = function($filterGrid){
			windowWidth = Math.max($window.width(), window.innerWidth);
			wrapperWidth = windowWidth;
			if (wrapperWidth >= 1200){
				wrapperWidth = 1200;
			}
			var itemWidth      = $filterGrid.find('.filter-grid-sizer').width();
			var itemHeight     = Math.floor(itemWidth * 0.95);
			var itemTallHeight = itemHeight * 2;
			$filterGrid.find('.filter-grid-item').each(function() {
				if ($(this).hasClass('tall')) {
					$(this).css({
						height : itemTallHeight
					});
				} else if ($(this).hasClass('wide')) {
					$(this).css({
						height : itemHeight / 2
					});
				} else if ($(this).hasClass('wide-tall')) {
					$(this).css({
						height : itemTallHeight
					});
				} else {
					$(this).css({
						height : itemHeight
					});
				}
			});

			var $gridFilters = $filterGrid.data('filterSource');
			if (!$gridFilters){
				$('.grid-filters').each(function(){
					var filterTarget = $(this).data('filterTarget');
					if ('#' + $filterGrid.attr('id') === filterTarget){
						$gridFilters = $(this);
						$filterGrid.data('filterSource', $gridFilters);
					}
				});
			}
			$filterGrid.imagesLoaded(function(event) {
				// make sure the default filter has been applied
				var $currFilter = $gridFilters.find('.current');
				var selector = $currFilter.data('filter') || '';
				var filterGridMode;
				if ($filterGrid.hasClass('filter-grid-masonry')) {
					filterGridMode = 'masonry';
				} else {
					filterGridMode = 'packery';
				}
				$filterGrid.isotope({
					layoutMode: filterGridMode,
					itemSelector: '.filter-grid-item',
					transitionDuration: '0.3s',
					packery: {
						columnWidth: '.filter-grid-sizer',
					},
					filter: selector
				});
			});
		};

		var sizeFilterGrids = function(){
			$('.filter-grid').each(function(){
				sizeFilterGrid($(this));
			});
		};

		if ($('.filter-grid').length){
			$('.filter-grid').on('filter', onFilterGrid);
			$(window).on(
				'resize.sco.custom.filtergrids scroll.sco.custom.filtergrids', 
				sizeFilterGrids
			).resize();
			$(document).on('afterdrawScoContent.sco.custom.filtergrids',
            function(event, pageId){
            	$(document).off('afterdrawScoContent.sco.custom.filtergrids');
                sizeFilterGrids();
            });
		}

		/* ---------------------------------------------- /*
		 * custom walk the walk filter grid
		/* ---------------------------------------------- */

		$('#gc-wtw-filter-grid').on('filter', function(event, filter){
			event.preventDefault();
			var $filter = $(filter);
			var selector = $filter.attr('data-filter');
			var $filterGrid = $(event.target);
			if(selector === '.gc-wtw-all'){
				$filterGrid.find('.filter-grid-item').removeClass('wide-tall');
			}else{
				$filterGrid.find(selector).addClass('wide-tall');
			}
			sizeFilterGrid($filterGrid);
		});

		$('#gc-wtw-filter-grid .filter-grid-item').on('click', function(event){
			event.preventDefault();
			var $gridItem = $(event.currentTarget);
			var currentSelector = $('#gc-wtw-filters .current').data('filter');
			var filter = $gridItem.data('sourceFilter');
			if (currentSelector === '.gc-wtw-all'){
				$gridItem.find('.reveal-prompt')
				.text($('#scoLabelsSelectToReturn').text());
				$('#gc-wtw-filter-grid .filter-grid-item' +
				'[data-source-filter="' + filter + '"] .column-content')
				.attr('aria-hidden', 'false');
				var $filter = $(filter);
				$('#gc-wtw-filter-grid').triggerHandler('filter', $filter);
			}else{
				// filter by all
				$('#gc-wtw-filter-grid .filter-grid-item')
				.attr('aria-hidden', 'true');
				$('#gc-wtw-filter-grid .filter-grid-item[data-background]')
				.attr('aria-hidden', 'false');
				$('#gc-wtw-filter-grid .filter-grid-item[data-background]' +
				'[data-source-filter="' + filter + '"]')
				.focus()
				.find('.reveal-prompt')
				.text($('#scoLabelsSelectToReveal').text());
				$('#gc-wtw-filter-grid')
				.triggerHandler('filter', $('#gc-wtw-all-filter'));
			}
		});

		// $('#gc-wtw-filter-grid .filter-grid-item button')
		// .attr('aria-label', $('#scoLabelsSelectToReveal').text());
		

		$('#gc-wtw-filter-grid .filter-grid-item[data-background] button').each(function(){
			$(this).append($('<div>',{
					'class':'filter-grid-icon',
					'aria-hidden':'true'
				}),
				$('<span>', {
					'class':'sr-only reveal-prompt', 
					'text': $('#scoLabelsSelectToReveal').text()
				})
			);
		});
		$('#gc-wtw-filter-grid .filter-grid-item .column-content').each(function(){
			$(this)
			// .attr('aria-live', 'assertive')
			.append($('<div>',{
				'class':'filter-grid-icon',
				'aria-hidden':'true'
			}),
				$('<span>', {
					'class':'sr-only reveal-prompt', 
					'text': $('#scoLabelsSelectToReturn').text()
				})
			);
		});

		/* ---------------------------------------------- /*
		 * Carousel Widget
		/* ---------------------------------------------- */
		$(function(){
			$('.carousel-widget').each(function(){
				var $carouselContainer = $(this);
				var id = $(this).data('carouselId');
				var $indicators = $('<ol>', {'class': 'carousel-indicators'});
				var $inner = $('<div>', {
					'class': 'carousel-inner', 
					'aria-live': 'assertive'
				});
				var carouselClasses = 'carousel slide';
				if ($carouselContainer.data('carouselClass')){
					carouselClasses += ' ' + $carouselContainer.data('carouselClass');
				}
				var numSlides = $carouselContainer.find('.carousel-item').length;
				$carouselContainer.find('.carousel-item').each(function(index, itemElem){
					var indicatorParams = {
						'class': '',
						'data-target': '#' + id,
						'data-slide-to': index
					};
					var itemClass = 'item';
					if (index === 0){
						indicatorParams['class'] = ' active';
						itemClass = 'item active';
					}
					$indicators.append($('<li>', indicatorParams));
					$inner.append(
						$(itemElem)
						.prepend($('<h3>', {
							'class':'sr-only',
							'text': $('#scoLabelCarouselSlideNum').text()
									.replace('_num_', index +1)
									.replace('_total_', numSlides)
						}))
						.addClass(itemClass)
					);
				});

				var $leftControl = $('<div>', {'class':'hidden'})
				.append($('<button>', {
						'class': 'left carousel-control'	
					}).on('click.sco.custom.carousel', function(event){
						$leftControl.find('a').click();
					}).append(
						$('<span>', {
						'class': 'glyphicon glyphicon-chevron-left',
						'aria-hidden': 'true'
						}),
						$('<span>', {
						'class': 'sr-only',
						'text': $('#scoLabelPreviousCarousel').text()
						})
					),
					$('<a>', {
						'href': '#' + id,
						'role': 'button',
						'data-slide': 'prev',
						'aria-hidden': 'true',
						'tabindex': '-1'
					})
					
				);

				var $rightControl = $('<div>')
				.append($('<button>', {
						'class': 'right carousel-control'	
					}).on('click.sco.custom.carousel', function(event){
						$rightControl.find('a').click();
					}).append(
						$('<span>', {
						'class': 'glyphicon glyphicon-chevron-right',
						'aria-hidden': 'true'
						}),
						$('<span>', {
						'class': 'sr-only',
						'text': $('#scoLabelNextCarousel').text()
						})
					),
					$('<a>', {
						'href': '#' + id,
						'role': 'button',
						'data-slide': 'next',
						'aria-hidden': 'true',
						'tabindex': '-1'			
					})
					
				);

				var $carousel = $('<div>', {
					'id': id,
					// 'aria-hidden': 'true',
					'class': carouselClasses,
					'role': 'region',
					'data-interval': false
				})
				.append($indicators, $leftControl, $inner, $rightControl)
				.on('slid.bs.carousel.sco.custom', function(){
			        var activeIndex = $carousel.find('.item.active').index() + 1;
			        if (activeIndex === 1){
			        	$leftControl.addClass('hidden');
			        	$rightControl.removeClass('hidden');
			        }else if (activeIndex === $carousel.find('.item').length){
			        	$leftControl.removeClass('hidden');
			        	$rightControl.addClass('hidden');
			        }else{
			        	$leftControl.removeClass('hidden');
			        	$rightControl.removeClass('hidden');
			        }
			        // Focus any focusable items
			        var focusablItems = $carousel.find(
			       	'.item.active [tabindex], .item.active a, .item.active button');
			       if(focusablItems.length){
			       		focusablItems[0].focus();
			       }
			    });
				$carouselContainer.append($carousel);
			});
		});

		/* ---------------------------------------------- /*
		 * Audio Widget
		/* ---------------------------------------------- */
		$(function(){
			$('.audio-widget').each(function(){
				var $container = $(this);
				var id;
				if($container.attr('id')){
					id = $container.attr('id');
				}else{
					id = _rndId();
					$container.attr('id', id);
				}
				var positionClass = $(this).data('widgetPosition') || 'bottom right';
				var audioPath = $(this).data('audio');
				var allStates = 'stopped playing paused';
				var playerState = 'stopped';
				$container.addClass(playerState);
				var $transcriptButton;
				var $replayButton;

				var setState = function(state){
					$container.removeClass(allStates);
					$container.addClass(state);
					if($container.hasClass('playing')){
						$container.find('.audio-widget-button .glyphicon')
						.each(function(index, iconElem){
      						$(iconElem).attr('class', 'glyphicon glyphicon-pause');
      					});
      					$container.find('.audio-widget-button').attr('aria-label', $('#scoLabelsPauseAudio').text());
					}else{
						$container.find('.audio-widget-button .glyphicon')
						.each(function(index, iconElem){
      						$(iconElem).attr('class', 'glyphicon glyphicon-volume-up');
      					});
      					$container.find('.audio-widget-button').attr('aria-label', $('#scoLabelsPlayAudio').text());
					}
				};
				var setAudioEvents = function(){
					$('#jPlayer').on($.jPlayer.event.timeupdate + '.' + id, function(evt){
						$container.find('.time').text(
							Math.round(evt.jPlayer.status.currentTime) + 
							'/' + Math.round(evt.jPlayer.status.duration)
						);
					});
					$('#jPlayer').on($.jPlayer.event.ended + '.' + id, function(evt){
						$('#jPlayer').jPlayer('playHead', 0);
						setState('paused');
					});
				};
				var clearAudioEvents = function(){
					$('#jPlayer').off($.jPlayer.event.timeupdate + '.' + id);
					$('#jPlayer').off($.jPlayer.event.ended + '.' + id);
				};
				var toggleAudio = function(stop){
					if (stop){
						playerState = 'stopped';
						clearAudioEvents();
					}else if ($container.hasClass('playing')){
						playerState = 'paused';
						$('#jPlayer').jPlayer( 'pause' );
					}else if ($container.hasClass('paused')){
						playerState = 'playing';
						$('#jPlayer').jPlayer( 'play' );
					}else if ($container.hasClass('stopped')){
						_stopMedia();
						setAudioEvents();
						playerState = 'playing';
						$('#jPlayer').jPlayer( 'option', 'cssSelectorAncestor', '#' + id );
						$('#jPlayer').jPlayer('setMedia', {
        					mp3: audioPath
      					}).jPlayer('play');
      					if(sco.language !== 'en-us'){
      						$transcriptButton.click();
      					}
					}
					setState(playerState);
				};
				var showTranscript = function(event){
					event.preventDefault();
					event.stopPropagation();
					$('#largeCourseModal #largeCourseModalTitle')
					.text($('#scoLabelsAudioTranscriptTitle').text());
					$('#largeCourseModal .modal-body')
					.text($container.find('.audio-transcript').text());
					$('#largeCourseModal')
					.on('shown.bs.modal.sco.custom.audiocontrol', function () {
						$('#largeCourseModal')
						.off('shown.bs.modal.sco.custom.audiocontrol');
						$('#largeCourseModal button.close').focus();
			            $.trapScreenreader($('#largeCourseModal'));
			            $.trapKeyboard($('#largeCourseModal'));
					})
					.modal({'show':'true', 'keyboard':'true','focus':'true'});
					
					$('#largeCourseModal').off('hidden.bs.modal.sco.custom.audiocontrol')
					.on('hidden.bs.modal.sco.custom.audiocontrol', function(event){
						$.untrapKeyboard();
            			$.untrapScreenreader();
					    $transcriptButton.focus();
					});
				};
				var restartAudio = function(event){
					event.preventDefault();
					event.stopPropagation();
					$('#jPlayer').jPlayer('play', 0);
				};

				// var $button = $('<button>', {
				// 	'class': positionClass + 
				// 	' widget-button audio-widget-button wow ' + 
				// 	widgetAnimation,
				// 	'data-wow-duration': '1s',
				// 	'data-wow-delay': '0',
				// 	'aria-labelledby': 'scoLabelsPlayAudio'
				// }).append(
				// 	$('<span>', {
				// 		'class': 'widget-icon',
				// 		'aria-hidden': 'true'
				// 	}).append(
				// 		$('<span>', {
				// 			'class': 'glyphicon glyphicon-volume-up',
				// 			'aria-hidden': 'true'
				// 		})
				// 	)
				var $button = $('<button>', {
					'class': positionClass + 
					' widget-button audio-widget-button',
					'aria-label': $('#scoLabelsPlayAudio').text()
				}).append(
					$('<span>', {
						'class': 'widget-icon wow ' + 
						widgetAnimation,
						'data-wow-duration': '1s',
						'data-wow-delay': '0',
						'aria-hidden': 'true'
					}).append(
						$('<span>', {
							'class': 'glyphicon glyphicon-volume-up',
							'aria-hidden': 'true'
						})
					)
				).on('click', function(event){
					event.preventDefault();
					event.stopPropagation();
					toggleAudio(false);
				});
				$container.on('click', function(){
					$button.click();
				});
				$(document).on('stopmedia.' + _rndId(), function(){
					toggleAudio(true);
				});
				var $controlPanel = $('<div>',{
					'class': positionClass +
					' audio-widget-control-panel',
				}).append(
					$replayButton = $('<button>', {
						'class': 'restart widget-button', 'tabindex':'-1',
						'aria-label': $('#scoLabelsRestartAudio').text()
					})
					.append(
						$('<span>', {
							'class': 'widget-icon',
							'aria-hidden': 'true'
						}).append(
							$('<span>', {
								'class': 'glyphicon glyphicon-repeat',
								'aria-hidden': 'true'
							})
						)
					).on('click', restartAudio),
					$('<span>', {
						'class': 'time', 'aria-label': $('#scoLabelsAudioProgress').text()
					}),
					$transcriptButton = $('<button>', {
						'class': 'transcript widget-button', 'tabindex':'-1',
						'aria-label': $('#scoLabelsShowTranscript').text()
					})
					.append(
						$('<span>', {
							'class': 'widget-icon',
							'aria-hidden': 'true'
						}).append(
							$('<span>', {
								'class': 'glyphicon glyphicon-file',
								'aria-hidden': 'true'
							})
						)
					).on('click', showTranscript)
				);
				$(this).append(
					$('<div>', {'class':'widget-button-wrapper'})
					.append($button, $controlPanel)
				).on('keyup.sco.custom.audiocontrol', function(event){
					if ((event.keyCode === 37 || event.keyCode === 39) && 
					$container.find('button:focus').length){
						var $buttons = [$button, $replayButton, $transcriptButton];
						var $focusedButton = $container.find('button:focus');
						var indexTo = null;
						for (var i = 0; i < $buttons.length; i++) {
							if ($focusedButton.get(0) === $buttons[i].get(0)){
								if(event.keyCode === 39){
									if (i === ($buttons.length-1)){
										indexTo = 0;
									}else{
										indexTo = i + 1;
									}
								}else if(event.keyCode === 37){
									if (i === 0){
										indexTo = ($buttons.length-1);
									}else{
										indexTo = i - 1;
									}
								}
							}
						}
						if (indexTo !== null && 
							$buttons[indexTo] && 
							$buttons[indexTo].length
						){
							$buttons[indexTo].focus();
						}
					}
				});
			});
		});

		/* ---------------------------------------------- /*
		 * Slideout Widget
		/* ---------------------------------------------- */
		$(function(){
			$('.slideout-widget').each(function(){
				var $container = $(this);
				$container.attr('aria-live', 'assertive');
				var id;
				var slideoutText = $container.find('.slideout-widget-text').text();
				if($container.attr('id')){
					id = $container.attr('id');
				}else{
					id = _rndId();
					$container.attr('id', id);
				}
				
				var positionClass = $(this).data('widgetPosition') || 'bottom right';
				var $button = $('<button>', {
					'class': 'widget-button slideout-widget-button',
					'aria-label': $('#scoLabelsRevealText').text()
				}).append(
					$('<span>', {
						'text': slideoutText,
						'class': 'slideout-widget-display-text'
					}),
					$('<span>', {
						'class': 'glyphicon glyphicon-plus',
						'aria-hidden': 'true'
					})
				);
				var revealSlideout = function(){
					if (!$container.hasClass('open')){
						$('.slideout-widget').removeClass('open');
						$container.addClass('opening');
						window.setTimeout(function(){
							if ($container.hasClass('opening')){
								$container.addClass('open');
								$container.removeClass('opening');
							}
						}, 200);
					}else{
						$container.removeClass('open');
					}
				};
				$button.on('click', function(event){
					event.preventDefault();
					//event.stopPropagation();
					revealSlideout();
				});
				$container.append(
					$('<div>', {'class': positionClass + 
					' widget-button-wrapper slideout-widget-button-wrapper'})
					.append($button)
				);
			});
		});

		/* ---------------------------------------------- /*
		 * Reveal Widget
		/* ---------------------------------------------- */
		$(function(){
			$('.reveal-widget').each(function(){
				var positionClass = $(this).data('widgetPosition') || 'bottom right';
				var $container = $(this);
				var $reveal = $container
				.attr('aria-live', 'assertive')
				.find('.reveal')
				.attr('aria-live', 'assertive')
				.append($('<span>',{
					'class':'glyphicon glyphicon-remove',
					'aria-hidden': 'true'
				}));
				var id;
				if($reveal.attr('id')){
					id = $reveal.attr('id');
				}else{
					id = _rndId();
					$reveal.attr('id', id);
				}
				
				var $button = $('<button>', {
					'class': positionClass + 
					' widget-button reveal-widget-button',
					'aria-controls': id,
					'aria-label': $('#scoLabelsRevealText').text()
				}).append(
					$('<span>', {
						'class': 'widget-icon wow ' + 
						widgetAnimation,
						'data-wow-duration': '1s',
						'data-wow-delay': '0',
						'aria-hidden': 'true'
					}).append(
						$('<span>', {
							'class': 'glyphicon glyphicon-plus',
							'aria-hidden': 'true'
						})
					)
				).on('click', function(event){
					event.preventDefault();
					event.stopPropagation();
					if ($reveal.hasClass('hidden')){
						_hideReveals();
						$reveal
						.removeClass('hidden')
						.addClass(widgetCoverAnimation + ' animated')
						.on('click', function(event){
							event.preventDefault();
							event.stopPropagation();
							$reveal
							.removeClass(widgetCoverAnimation)
							.addClass('hidden')
							.siblings('.widget-button-wrapper')
							.removeClass('hidden');
						})
						.siblings('.widget-button-wrapper')
						.addClass('hidden');
					}else{
						_hideReveals();
					}
				});
				$container.on('click', function(){
					$button.click();
				});
				$container.append(
					$('<div>', {'class':'widget-button-wrapper'})
					.append($button)
				);
			});
		});

		/* ---------------------------------------------- /*
		 * Parallax
		/* ---------------------------------------------- */

		if (mobileTest === true) {
			$('.module-parallax').css({'background-attachment': 'scroll'});
		} else {
			$('#hero.module-parallax').parallax('50%', 0.2); //old way

			$('.background-parallax').each(function(){
				var $this = $(this);
				var id = _rndId();
				var observer;
				var observing = false;
				var visible = $this.is(':visible');
				var factor = $this.data('parallaxFactor') || 50;
				$this.css('background-size', 'auto ' + (Number(factor) + 100) + '%');
				var updateBgPos = function(){
					// Check if within viewport
					visible = $this.is(':visible');
					if (visible){
						if ($this.offset().top < ($window.scrollTop() + windowHeight) && 
						($this.height()+$this.offset().top) > $window.scrollTop()) {
							var percent = ((($window.scrollTop()-(
								$this.offset().top-windowHeight))/((
								$this.height()+$this.offset().top)-(
								$this.offset().top-windowHeight))))*100;
							if (!isNaN(percent)){
								$this.css('background-position-y', percent + '%');
							}
						}
					}else{
						// watch hidden parent
						if (observer && !observing){
							observing = true;
							var hiddenParents = $this.parentsUntil(':visible');
							try {
	    							observer.observe(
									hiddenParents[hiddenParents.length-1], 
									{attributes:true}
								);
							}
							catch(err) {
							    console.log('error observing hidden parent: ', err);
							}
						}
					}
				};
				// update on show
				var eventNs = '.sco.custom.parallax.' + id;
				$window.on('scroll' + eventNs + ' resize' + eventNs, 
				function(){
					if (!$.contains(document.documentElement, $this.get(0))){
						$window.off(
							'scroll' + eventNs + ' resize' + eventNs);
					}else{
						updateBgPos();
					}
				});
				$(document).on('afterdrawScoContent' + eventNs,
	            function(event, pageId){
	            	$(document).off('afterdrawScoContent' + eventNs);
	                updateBgPos();
	            });
				if (MutationObserver){
					observer = new MutationObserver(function(mutations) {
					    if ($(mutations[0].target).is(':visible')){
					    	if (observer && observer.disconnect){
					    		observer.disconnect();
					    	}
					    	observing = false;
					    	if ($this){
					    		updateBgPos();
					    	}
					    }
					 });
				}
				updateBgPos();
			});
		}
		
		/* ---------------------------------------------- /*
		 * Youtube video background
		/* ---------------------------------------------- */

		$(function(){
			$('.video-player').mb_YTPlayer();
		});

		/* ---------------------------------------------- /*
		 * WOW Animation
		/* ---------------------------------------------- */


		if (!window.wow){
			window.wow = new WOW({
				mobile: true,
				offset: 0,
				live: true,
				callback: function(elem){
					// $(elem)
					// .removeClass('wow animated');
				}
			});
			window.wow.init();
		}
		
		/* ---------------------------------------------- /*
		 * Setting background image
		/* ---------------------------------------------- */
		$('[data-background]').each(function(){
			$(this).css('background-image', 'url(' + 
				$(this).attr('data-background') + ')');
		});

		/* ---------------------------------------------- /*
		 * A jQuery plugin for fluid width video embeds
		/* ---------------------------------------------- */

		$('body').fitVids(); 
		// $('body').fitVids({ 
		// 	customSelector: 'iframe[src^="https://hubtv.corp.ebay.com"]'
		// });

		/* ---------------------------------------------- /*
		 * Scroll To
		/* ---------------------------------------------- */

		var scrollTo = function(position){
			// $elem is a jQuery object.
			$('html, body').stop().animate({
				scrollTop: position
			}, 1000);
		};
	};

	var _initializePostRenderComponents = function(){

	};

	// Global event handlers

    // two events are triggered when  the ui
    // is drawn and then again when content is drawn:
    // drawUi and drawContent, each with an accompanying
    // before event.
    // $(function() {
  		$(document).on('beforeDrawScoUi.sco.custom', 
	    	function(event){
	    		sco.util.messageLog.addMessage(
	                'beforeDrawScoUi',
	                sco.util.messageLogLevel.Information);
	    	}
	    );
	    $(document).on('drawScoUi.sco.custom', 
	    	function(event){
	    		sco.util.messageLog.addMessage(
	                'drawScoUi',
	                sco.util.messageLogLevel.Information);
	    		_initializeNavigation();
	    		_scaleFonts();
	    		$(window).on('resize.fontsize', _scaleFonts);
	    	}
	    );
	    $(document).on('beforeDrawScoContent.sco.custom', 
	    	function(event, pageId){
	    		sco.util.messageLog.addMessage(
	                'beforeDrawScoContent',
	                sco.util.messageLogLevel.Information);
	    		_stopMedia();
	    	}
	    );
	    $(document).on('drawScoContent.sco.custom', 
	    	function(event, pageId){
	    		sco.util.messageLog.addMessage(
	                'drawScoContent',
	                sco.util.messageLogLevel.Information);
	        	_initializePageComponents();
	    	}
	    );
	    $(document).on('afterdrawScoContent.sco.custom', 
	    	function(event, pageId){
	    		sco.util.messageLog.addMessage(
	                'afterdrawScoContent',
	                sco.util.messageLogLevel.Information);
	    		_initializePostRenderComponents();
	    	}
	    );
	    $(document).on('learnerPreferencesUpdate.sco.custom', 
	    	function(event, statement){
	    		if (statement.learnerPreferenceLanguage){
	    			$(document).triggerHandler('interactionProgress', {
						id: 'language-chooser',
						description: 'Student language choice dialog',
						type: 'multipleChoice',
						response: statement.learnerPreferenceLanguage
					});
	    		}
	    		
	    	}
	    );
    return sco;
};});