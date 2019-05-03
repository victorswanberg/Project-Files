/****************************************************************************

    launch.js Copyright 2016 Sublime Media LLC
        

*****************************************************************************/
var domIsReady = (function(domIsReady) {
   var isBrowserIeOrNot = function() {
      return (!document.attachEvent || 
        typeof document.attachEvent === 'undefined' ? 'not-ie' : 'ie');
   };
   domIsReady = function(callback) {
      if(callback && typeof callback === 'function'){
         if(isBrowserIeOrNot() !== 'ie') {
            document.addEventListener('DOMContentLoaded', function() {
               return callback();
            });
         } else {
            document.attachEvent('onreadystatechange', function() {
               if(document.readyState === 'complete') {
                  return callback();
               }
            });
         }
      } else {
         console.error('The callback is not a function!');
      }
   };

   return domIsReady;
})(domIsReady || {});

(function(){
    var openerWindow = window;
    window.sm = window.sm || {};
    window.sm.launchCourse = function(){
        window.sm.scoWin = window.open(
            'sco.html', 'scoWin', 'width=1024, height=700, ' +
            'resizable=yes, toolbar=no, menubar=no, scrollbars=yes'
        );
        // watch for the course to launch
        window.sm.intervalObject = window.setInterval(
            function(){
                if (window.sm.scoWin && window.sm.scoWin
                .document.getElementById('scoContent')){
                    window.sm.courseLaunched();
                }
            },
        300);
    };

    window.sm.courseLaunched = function(){
        window.clearInterval(window.sm.intervalObject);
        document.getElementById('welcome').style.display = 'none';
        document.getElementById('launched').style.display = 'block';
        var unloadInjection = 'window.addEventListener("beforeunload",' +
        ' function(event){window.opener.sm.courseClosed()})';
        window.sm.scoWin.setTimeout(unloadInjection, 100);
    };

    window.sm.courseClosed = function(){
        document.getElementById('launched').style.display = 'none';
        document.getElementById('closed').style.display = 'block';
        openerWindow.setTimeout('top.close();', 500);
    };
})();

(function(document, window, domIsReady, undefined) {
    domIsReady(function() {
        var isOpener = window.opener && window.opener.location
        .href.indexOf('open.html') >= 0;
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (!isOpener && msie > 0 && (parseInt(ua.substring
        (msie + 5, ua.indexOf('.', msie)), 10) < 10)){
            window.sm.launchCourse();
        }else{
            window.location.replace('sco.html');
        }
    });
})(document, window, domIsReady);

