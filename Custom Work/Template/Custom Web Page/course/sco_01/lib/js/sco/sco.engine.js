/****************************************************************************

    SCO Engine Copyright 2016 Sublime Media LLC

    TODO:

*****************************************************************************/
'use strict';
window.define([
    'require',
	'sco/sco.util',
	'sco/sco.lms',
	'sco/sco.assessment',
	'sco/sco.environment',
	'sco/sco.ui',
    'sco/sco.bootstrap',
    'custom/sco.custom'
	], function(
    require, 
    scoUtil, 
    scoLms, 
    scoAssessment, 
    scoEnvironment, 
    scoUi,
    scoBootstrap, 
    customize) {
		//Initialize the sco namespace and globals
		var sco = sco || {};
		sco.util = scoUtil(sco);
		sco.lms = scoLms(sco);
		sco.assessment = scoAssessment(sco);
		sco.environment = scoEnvironment(sco);
		sco.ui = scoUi(sco);
        sco.bootstrap = scoBootstrap(sco);

        // global sco namespace
        sco.config = {};
        sco.engine = {};
        sco.state = {};
        sco.id = '';
        sco.name = '';
        sco.description = '';
        sco.defaultLanguage = '';
        sco.language = '';
        sco.textDirection = '';
        sco.pages = [];
        sco.modules = [];
        sco.pageId = '';
        sco.pageName = '';
        sco.moduleId = '';
        sco.moduleName = '';
        sco.pageDescription = '';

        var _updateCourseProgress = function(){
            // course progress is based solely on page progress.
            // if it were based on modules progress, the fraction may not
            // be accurate
            var total = sco.ui.select.menu.pages().length;
            var completed = sco.ui.select.menu.completedPages().length;
            var progress = completed/total;
            sco.state.suspendData = sco.ui.suspendData();
            var statement = {
                id: sco.id,
                progress: progress
            };
            $(document).triggerHandler('courseProgress', statement);
        };
        var _updateModuleProgress = function(moduleId){
            if (sco.ui.select.menu.modules().length){
                var total = sco.ui.select.menu.modulePages(moduleId).length;
                var completed = sco.ui.select.menu
                .completedModulePages(moduleId).length;
                
                var progress = completed/total;
                var statement = {
                    id: moduleId,
                    progress: progress
                };
                $(document).triggerHandler('moduleProgress', statement);
            }
        };
        var _updatePageProgress = function(pageId){
            var total = sco.ui.select.page.interactions().length;
            var completed = sco.ui.select.page.completedInteractions().length;
            var progress = 0;
            if (
                sco.config('navigationlock','interactions') === 'optional' || 
                total === 0
            ){
                progress = 1;
            }else{
                progress = completed/total;
            }
            var statement = {
                id: pageId,
                progress: progress
            };
            $(document).triggerHandler('pageProgress', statement);
        };
        var _setUpListeners = function(){
            $(document).on('beforeDrawScoContent.sco.engine',
                function(event, pageId){

                }
            );
            $(document).on('drawScoContent.sco.engine',
                function(event, pageId){
                    _updatePageProgress(pageId);
                }
            );
            $(window).on('beforeunload.sco.engine unload.sco.engine',
                function(event){
                    var statement = {event: event};
                    $(document).triggerHandler('courseExit', statement);
                }
            );
        };
        var _initUi = function(){
            sco.ui.init()
            .done(function(){
                sco.util.messageLog.addMessage(
                    'UI loaded',
                    sco.util.messageLogLevel.Information);
            })
            .fail(function(err){
                sco.util.messageLog.addMessage(
                    'Error initializing ui: ' + err,
                    sco.util.messageLogLevel.Error);
            });
        };
        var _loadLanguage = function(){
            sco.defaultLanguage = 
                sco.config('languages', 'default') || 'en-us';
                sco.id = sco.config('config', 'identifier');
            if (sco.state.learnerPreferenceLanguage !== ''){
                sco.language = sco.state.learnerPreferenceLanguage;
            }else{
                sco.language = sco.defaultLanguage;
            }
            _initUi();
        };
        var _initLms = function(){
            sco.lms.init(sco.config('lms'))
            .done(function(){
                sco.util.messageLog.addMessage(
                    'LMS initialized',
                    sco.util.messageLogLevel.Information);
                _loadLanguage();
            })
            .fail(function(err){
                sco.util.messageLog.addMessage(
                    'Error initializing lms connection: ' + err,
                    sco.util.messageLogLevel.Error);
            });
        };
        var _getConfig = function(){
            sco.util.getXml('sco.xml')
            .done(function(config){
                sco.config = config;
                _initLms();
            })
            .fail(function(err){
                sco.util.messageLog.addMessage(
                    'Error loading sco.xml: ' + err,
                    sco.util.messageLogLevel.Error);
            });
        };

		sco.init = function(){
	        sco.util.messageLog.addMessage(
                    'Initialize sco',
                    sco.util.messageLogLevel.Information);
            _setUpListeners();
	        _getConfig();
		};
        sco.engine.updateCourseProgress = _updateCourseProgress;
        sco.engine.updateModuleProgress = _updateModuleProgress;
        sco.engine.updatePageProgress = _updatePageProgress;

        // Give sco.custom a chance to override before returning sco
        sco = customize(sco);
	    return sco;
	}
);