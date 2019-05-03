/****************************************************************************

    sco.js Copyright 2016 Sublime Media LLC
        

*****************************************************************************/
'use strict';
(function(){
    
    // shim sets up dependencies
    window.requirejs.config({
        baseUrl: 'lib/js',
        paths: {
            // Shorthand references
            jquery: 'jquery-3.1.0.min',
            bootstrap: 'bootstrap/bootstrap.min',
            //bootstrap: 'bootstrap/bootstrap',
            custom: '../../lib_custom/js'
        },
        shim: {
            // Dependencies. Listed modules are dependent on the
            // associated array e.g.: bootstrap is dependent on jquery
            'bootstrap': ['jquery'],
            'plugins': ['bootstrap'],
            'sco/sco.engine': ['bootstrap']
        }
    });
    window.requirejs(['plugins','sco/sco.engine'], 
        function(plugins, sco){
            plugins.init(function(){
                sco.init();
            });
        },
        function(err){
            var failedId = err.requireModules && err.requireModules[0];
            console.log('Module failed to load: ', failedId);
            //window.setTimeout(window.location.reload(true), 5000);
        }
    );
    window.define('optional', [], {
        load : function (moduleName, parentRequire, onload, config){

            var onLoadSuccess = function(moduleInstance){
                // Module successfully loaded, call the onload callback so that
                // requirejs can work its internal magic.
                onload(moduleInstance);
            };

            var onLoadFailure = function(err){
                // optional module failed to load.
                var failedId = err.requireModules && err.requireModules[0];
                console.warn('Could not load optional module: ' + failedId);

                // Undefine the module to cleanup internal stuff in requireJS
                window.requirejs.undef(failedId);

                // Now define the module instance as a simple empty object
                // (NOTE: you can return any other value you want here)
                window.define(failedId, [], function(){return {};});

                // Now require the module make sure that requireJS thinks 
                // that is it loaded. Since we've just defined it, requirejs 
                // will not attempt to download any more script files and
                // will just call the onLoadSuccess handler immediately
                parentRequire([failedId], onLoadSuccess);
            };

            parentRequire([moduleName], onLoadSuccess, onLoadFailure);
        }
    });
    
})();
/* console shim*/
(function () {
    var f = function () {};
    if (!window.console) {
        window.console = {
            log:f, info:f, warn:f, debug:f, error:f
        };
    }
}());