/****************************************************************************

    sco.bootstrap Copyright 2016 Sublime Media LLC

    TODO:
        

*****************************************************************************/
'use strict';
window.define(function(){return function(sco){

	var _triggerInteractionProgress = function(interaction, progress){
		var id = $(interaction).attr('id');
	    var name = $(interaction).find('.sco-interaction-name') &&
	    	$(interaction).find('.sco-interaction-name').text() ||
	    	'Page: ' + sco.pageName + ', interaction ' + 
	    	$('.sco-interaction').index($(interaction));
	    var description = $(interaction).find('.sco-interaction-description');
	    if (progress >= 1){
	    	$(interaction).addClass('completed');
	    }
		var statement = {
			id: id,
			name: name,
			description: description,
			progress: progress
		};
		$(document).triggerHandler('interactionProgress', statement);
	};

	var _injectProgressTrigger = function(interaction){
        if ($(interaction).hasClass('carousel-widget')){
        	var $carousel = $($(interaction).find('.carousel'));
        	$carousel.on('slid.bs.carousel.sco.bootstrap', function () {
		        $carousel.find('.item.active').addClass('viewed');
		        var total = $carousel.find('.item').length;
		        var viewed = $carousel.find('.item.viewed').length;
		        var progress = viewed/total;
		        _triggerInteractionProgress(interaction, progress);
		    });
		    $(interaction).find('.item.active').addClass('viewed');
        }
        if ($(interaction).hasClass('nav-tabs-container')){
        	$(interaction).find('a[data-toggle="tab"]')
        	.on('click.sco.bootstrap.tabs', function(evt){
        		$(this).parent().addClass('viewed');
				var total = $(interaction).find('li>a').length;
		        var viewed = $(interaction).find('li.viewed>a').length;
		        var progress = viewed/total;
		        _triggerInteractionProgress(interaction, progress);
        	});
        	$(interaction).find('.nav.nav-tabs li.active').addClass('viewed');
        }
    };

    var _initColHeight = function(){
    	$('[class*="col-"]').each(function(){
    		if (/\b(col-)(xs|sm|md|lg)(-height-|-scale-)\b/g
    		.test($(this)[0].className)){
    			var $col = $(this);
	    		var observer;
				var observing = false;
				var visible = $col.is(':visible');
				var updateColHeight = function(){
					visible = $col.is(':visible');
					if (visible){
						var cl = $col.attr('class');
						var scale = null;
						if (/\b(col-)(xs|sm|md|lg)(-scale-)\b/g
    					.test(cl)){
							var scales = [
								/(?:\bcol-)(lg)(?:-scale-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(md)(?:-scale-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(sm)(?:-scale-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(xs)(?:-scale-)(.+?)\b/g.exec(cl)
							];
							scales = scales.slice(
								['lg', 'md', 'sm', 'xs'].indexOf(sco.bootstrap.size)
							);
							scale = scales[0] || scales[1] || scales[2] || scales[3];
							scale = (scale &&  scale[2]) / 100 || null;
						}
						var defHeight = null;
						var height = null;
						if (/\b(col-)(xs|sm|md|lg)(-height-)\b/g
    					.test(cl)){
							var heights = [
								/(?:\bcol-)(lg)(?:-height-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(md)(?:-height-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(sm)(?:-height-)(.+?)\b/g.exec(cl),
								/(?:\bcol-)(xs)(?:-height-)(.+?)\b/g.exec(cl)
							];
							defHeight = heights[0] || heights[1] || heights[2] || heights[3];
							defHeight = (defHeight && ((defHeight[2] === 'auto' && 1) || 
								$col.width() * (defHeight[2] / 100))) || 1;
							heights = heights.slice(
								['lg', 'md', 'sm', 'xs'].indexOf(sco.bootstrap.size)
							);
							height = heights[0] || heights[1] || heights[2] || heights[3];
							height = (height && ((height[2] === 'auto' && 1) || 
								$col.width() * (height[2] / 100))) || 1;
							$col.height(height);
						}
						var widths = [
							/(?:\bcol-)(lg)(?:-)(.+?)\b/g.exec(cl),
							/(?:\bcol-)(md)(?:-)(.+?)\b/g.exec(cl),
							/(?:\bcol-)(sm)(?:-)(.+?)\b/g.exec(cl),
							/(?:\bcol-)(xs)(?:-)(.+?)\b/g.exec(cl)
						];
						var defWidth = widths[0] || widths[1] || widths[2] || widths[3];
						widths = widths.slice(
							['lg', 'md', 'sm', 'xs'].indexOf(sco.bootstrap.size)
						);
						defWidth = (defWidth && defWidth[2] / 12) || 1;
						var width = widths[0] || widths[1] || widths[2] || widths[3];
						width = (width && width[2] / 12) || 1;
						// factor column/parent ratio changes - wider child = increase
						var emScale = width/defWidth;
						if (emScale === 1 && defHeight !== height){
							emScale = height/defHeight;
						}
						if (scale){
							emScale = scale;
						}
						$col.data('scoEmScale', emScale);
						$col.css('fontSize', emScale + 'em');
					}else{
						// watch hidden parent
						if (observer && !observing){
							observing = true;
							var hiddenParents = $col.parentsUntil(':visible');
							try {
	    							observer.observe(
									hiddenParents[hiddenParents.length-1], 
									{attributes:true}
								);
							}
							catch(err) {
							    // ignore
							    console.log('error observing hidden parent: ', err);
							}
						}
					}
			    };
				// update on show
				$(window).on('scroll.sco.bootstrap.colheight resize.sco.bootstrap.colheight', updateColHeight);
				if (MutationObserver){
					observer = new MutationObserver(function(mutations) {
					    if ($(mutations[0].target).is(':visible')){
					    	if (observer){
					    		observer.disconnect();
					    	}
					    	observing = false;
					    	if ($col){
					    		updateColHeight();
					    	}
					    }
					 });
				}
				updateColHeight();
    		}
    		
    	});
    };

	var _initPageInteractions = function(pageId){
        sco.ui.select.page.interactions().each(function(){
            var intId = $(this).attr('id');
            var intState = sco.lms.getState(intId);
            if (intState && intState.progress === 1){
                $(this).addClass('completed');
            }
            _injectProgressTrigger(this);
        });
        _initColHeight();
    };

	var _initPage = function(pageId){
		_initPageInteractions(pageId);
		_initColHeight();
	};

	var _setUpListeners = function(){
		$(window).on('resize.sco.bootstrap',
			function(event){

			}
		);
		$(document).on('drawScoUi.sco.bootstrap',
            function(event){

            }
        );
        $(document).on('beforeDrawScoContent.sco.bootstrap',
            function(event, pageId){

            }
        );
        $(document).on('drawScoContent.sco.bootstrap',
            function(event, pageId){
            }
        );
        $(document).on('afterdrawScoContent.sco.bootstrap',
            function(event, pageId){
                _initPage(pageId);
            }
        );
        
    };

    $(function(){
		_setUpListeners();
		
	});

    sco.bootstrap = {
        //setUpListeners: _setUpListeners
    };

    sco.bootstrap.size="unknown";$(document).ready(function(){function b(){$(a).find("div")
	.each(function(){var a=$(this).attr("class");$(this).is(":visible")&&(sco.bootstrap.size=
	String(a).match(/device-xs/)?"xs":String(a).match(/device-sm/)?"sm":String(a)
	.match(/device-md/)?"md":String(a).match(/device-lg/)?"lg":"unknown")})}var a=$("<div>")
	.css({position:"absolute",top:"-200px"}).addClass("current-screen-size").append([$("<div>")
	.addClass("device-xs visible-xs").html("&nbsp;"),$("<div>").addClass("device-sm visible-sm")
	.html("&nbsp;"),$("<div>").addClass("device-md visible-md").html("&nbsp;"),$("<div>")
	.addClass("device-lg visible-lg").html("&nbsp;")]);$("body").prepend(a),$(window)
	.bind("resize orientationchange",function(){b()}),b()});
    
    return sco.bootstrap;
};});

