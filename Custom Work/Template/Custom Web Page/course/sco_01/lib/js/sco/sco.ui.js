/****************************************************************************

    Course Framework Router Copyright 2016 Sublime Media LLC

    TODO:
        

*****************************************************************************/
'use strict';
window.define(['bootstrap'], function(){return function(sco){
    sco.ui = {};
    
    var _select = {
        menu: {
            page: function(pageId){
                return $('#scoMenu [data-page-id="' + pageId + '"]');
            },
            pageModule: function(pageId){
                return $('#scoMenu [data-page-id="' + pageId + '"]')
                .closest('[data-module-id]');
            },
            module: function(moduleId){
                return $('#scoMenu [data-module-id="' + moduleId + '"]');
            },
            modulePages: function(moduleId){
                return $('#scoMenu [data-module-id="' + 
                moduleId + '"]  [data-page-id]');
            },
            completedModulePages: function(moduleId){
                return $('#scoMenu [data-module-id="' + 
                moduleId + '"]  [data-page-id].completed');
            },
            pages: function(){ 
                return $('#scoMenu [data-page-id]');
            },
            completedPages: function(){ 
                return $('#scoMenu [data-page-id].completed');
            },
            activePage: function(){ 
                return $('#scoMenu [data-page-id].active');
            },
            modules: function(){ 
                return $('#scoMenu [data-module-id]');
            },
            completedModules: function(){ 
                return $('#scoMenu [data-module-id].completed');
            },
            activeModule: function(){ 
                return $('#scoMenu [data-module-id].active');
            },
        },
        page: {
            interaction: function(interactionId){
                return $('#scoContent .sco-interaction#' + 
                interactionId);
            },
            interactions: function(){ 
                return $('#scoContent .sco-interaction');
            },
            completedInteractions: function(){ 
                return $('#scoContent .sco-interaction.completed');
            }
        }
        
    };
    sco.ui.select = _select;
    sco.ui.pageIds = function(){
        var pageids = [];
        _select.menu.pages().each(function(){
            pageids.push($(this).data('pageId'));
        });
        return pageids;
    };
    sco.ui.ModuleIds = function(){
        var moduleIds = [];
        _select.menu.modules().each(function(){
            moduleIds.push($(this).data('moduleId'));
        });
        return moduleIds;
    };
    sco.ui.suspendData = function(){
        var suspendData = arguments[0] || null;
        if(suspendData){
            var i;
            for (i = 0; i < suspendData.p.length; i++) {
                if (suspendData.p[i] === 1){
                    $(_select.menu.pages()[i])
                    .addClass('completed');
                }
            }
            for (i = 0; i < suspendData.m.length; i++) {
                if (suspendData.m[i] === 1){
                    $(_select.menu.modules()[i])
                    .addClass('completed');
                }
            }
        }else{
            suspendData = {};
            suspendData.p = [];
            _select.menu.pages().each(function(){
                if ($(this).hasClass('completed')){
                    suspendData.p.push(1);
                }else{
                    suspendData.p.push(0);
                }
            });
            suspendData.m = [];
            _select.menu.modules().each(function(){
                if ($(this).hasClass('completed')){
                    suspendData.m.push(1);
                }else{
                    suspendData.m.push(0);
                }
            });
            return JSON.stringify(suspendData);
        }
    };
    sco.ui.activePage = function(){
        var activePage = arguments[0] || null;
            if(activePage){
                _select.menu.activePage()
                .removeAttr('aria-describedby')
                .removeClass('active');
                _select.menu.page(activePage)
                .addClass('active')
                .attr({
                    'aria-describedby': 'scoLabelCurrentPage'
                });
                sco.pageId = activePage;
                if(_select.menu.pageModule(activePage)){
                    _select.menu.activeModule()
                    .removeAttr('aria-describedby')
                    .removeClass('active');
                    sco.moduleId = _select.menu.pageModule(activePage)
                    .data('moduleId');
                    _select.menu.module(sco.moduleId)
                    .addClass('active')
                    .attr({
                        'aria-describedby': 'scoLabelCurrentModule'
                    });
                }
            }else{
                return _select.menu.activePage().data('pageId');
            }
        };
    sco.ui.drawContent = function(){
        console.log('sco.ui.activePage()', sco.ui.activePage())
        var deferred = $.Deferred();
        $(document).triggerHandler('beforeDrawScoContent', [sco.pageId]);
        sco.pageName = $('#pageName') && $('#pageName').text() || '';
        sco.pageDescription = $('#pageDescription') && 
            $('#pageDescription').text() || '';
        $.get(
            'content_' + 
            sco.language + 
            '/pages/' + 
            sco.pageId + 
            '.html',
            'html'
        )
        .done(function(data, status, jqXHR){
            // replace curly bracket references in body
            var pageContentString = /(?:<body[^]*?>)([^]*)(?:<\/body>)/i
                .exec(data)[1].replace(/(?:\{\{)(.+?)(?:\}\})/g, 
                function(match, dataRef){
                    try{
                        return sco[dataRef];
                    }catch(err){
                        sco.util.messageLog.addMessage(
                        'Error substituting text in body: ' + err,
                        sco.util.messageLogLevel.Error);
                        return '';
                    }
                }
            );
            var $bodyContent = $.parseHTML(pageContentString, null, true);
            $('.wrapper').fadeOut(600, function(){
                $('#scoContent').html($bodyContent);
                $(document).triggerHandler('drawScoContent', [sco.pageId]);
                $('.wrapper').fadeIn(600, function(){
                    if(!$('.modal').is(':visible')){
                        $('#pageName').attr('tabindex', '-1');
                        window.setTimeout(function(){
                            $('#pageName').focus();
                        }, 10);
                    }
                    document.title = $('#pageName').text();
                    $(document).triggerHandler(
                        'afterdrawScoContent', 
                        [sco.pageId]
                    );
                    deferred.resolve();
                });
            });
        })
        .fail(function(jqXHR, status, err){
            deferred.fail(err);
        });
        return deferred;
    };

    var _showReturnModal = function(stateLocation){
        $('#returnDialog').on('shown.bs.modal', function(event){
            $('#returnDialog').off('shown.bs.modal');
            $.trapScreenreader($('#returnDialog'));
            $.trapKeyboard($('#returnDialog'));
            $('#returnDialog button.close').focus();
        });
        $('#returnDialog button').on('click', function (event) {
            $('#returnDialog button').off('click');
            $.untrapKeyboard();
            $.untrapScreenreader();
            if($(this).data('return')){
                sco.ui.activePage(stateLocation);
                sco.ui.drawContent();
            }
        });
        $('#returnDialog').modal({'show':'true', 'keyboard':'true'});
    };

    var _showLanguageModal = function(){
        var selectedLanguage;
        $('#languageDialog').on('shown.bs.modal', function(event){
            $('#languageDialog').off('shown.bs.modal');
            $.trapScreenreader($('#languageDialog'));
            $.trapKeyboard($('#languageDialog'));
            $('#languageDialog button.close').focus();
        });
        $('#languageDialog button').on('click', function (event) {
            $('#languageDialog button').off('click');
            $.untrapKeyboard();
            $.untrapScreenreader();
            if($(this).data('return')){
                selectedLanguage = $(this).data('return');
            }
        });
        $('#languageDialog').on('hidden.bs.modal', function(event){
            $('#languageDialog').off('hidden.bs.modal');
            console.log('selectedLanguage ',selectedLanguage)
            if (selectedLanguage){
                sco.state.learnerPreferenceLanguage = selectedLanguage;
                $(document).triggerHandler('learnerPreferencesUpdate', {'learnerPreferenceLanguage':selectedLanguage});
                if (sco.state.learnerPreferenceLanguage !== sco.language){
                    sco.language = selectedLanguage;
                    sco.ui.init();
                }
            }
        });
        $('#languageDialog').modal({'show':'true', 'keyboard':'true'});
    };

    var _setUpListeners = function(){
        $(document).on('courseProgress.sco.ui',
            function(event, statement){
                if (statement.progress >= 1){
                    $('body').addClass('course-completed');
                }else{
                    $('body').removeClass('course-completed');
                }
            }
        );
        $(document).on('courseExit.sco.ui',
            function(event, statement){

            }
        );
        $(document).on('moduleProgress.sco.ui',
            function(event, statement){
                // mark module as completed in the menu
                if (statement.progress >= 1){
                    _select.menu.module(statement.id)
                    .addClass('completed');
                }
                if(statement.id === sco.moduleId){
                    if (statement.progress >= 1){
                        $('body').addClass('module-completed');
                    }else{
                        $('body').removeClass('module-completed');
                    }
                }
            }
        );
        $(document).on('pageProgress.sco.ui',
            function(event, statement){
                // mark page as completed in the menu
                if (statement.progress >= 1){
                    _select.menu.page(statement.id)
                    .addClass('completed');
                }
                if(statement.id === sco.pageId){
                    if (statement.progress >= 1){
                        $('body').addClass('page-completed');
                    }else{
                        $('body').removeClass('page-completed');
                    }
                }
                sco.engine.updateModuleProgress(sco.moduleId);
                sco.engine.updateCourseProgress();
            }
        );
        $(document).on('interactionProgress.sco.ui',
            function(event, statement){
                if (statement.progress >= 1){
                    _select.page.interaction(statement.id)
                    .addClass('completed');
                }
                sco.engine.updatePageProgress(sco.pageId);
            }
        );
        $(document).on('assessmentProgress.sco.ui',
            function(event, statement){

            }
        );
        $(document).on('questionProgress.sco.ui',
            function(event, statement){

            }
        );
    };
    var _initNav = function(){
        _select.menu.pages().on('click.sco.ui', function(event){
            // assuming it is an anchor tag
            event.preventDefault();
            if ($(this).data('pageId')){
                sco.ui.activePage($(this).data('pageId'));
                sco.ui.drawContent()
                .done(function(){
                    
                })
                .fail(function(jqXHR, status, err){
                    sco.util.messageLog.addMessage(
                        'Error loading content: ' + err,
                        sco.util.messageLogLevel.Error);
                }); 
            }
        });
    };
    sco.ui.drawBase = function(){
        var deferred = $.Deferred();
        $(document).triggerHandler('beforeDrawScoUi');
        $.get(
            'content_' + sco.language + '/base.html',
            'html'
        )
        .done(function(data, status, jqXHR){
            var $bodyContent = $(
                /(?:<body[^]*?>)([^]*)(?:<\/body>)/i.exec(data)[1]
            );
            $('.wrapper').html($bodyContent);
            $(document).triggerHandler('drawScoUi');
            sco.name = $('#scoInfo #scoName').text();
            sco.description = $('#scoInfo #scoDescription').text();
            _setUpListeners();
            if(sco.state.suspendData.p){
                sco.ui.suspendData(sco.state.suspendData);
            }
            var activePage = sco.ui.activePage();
            sco.ui.activePage(activePage);

            console.log('sco.state.learnerPreferenceLanguage ',(!sco.state.learnerPreferenceLanguage || sco.state.learnerPreferenceLanguage === ''));
            console.log('dialog? ',(sco.config('dialogswitches', 'languagedialog') === 'true' && (!sco.state.learnerPreferenceLanguage || sco.state.learnerPreferenceLanguage === '')));
            console.log('is sco location?', sco.state.location);
            if (sco.config('dialogswitches', 'languagedialog') === 'true' && (!sco.state.learnerPreferenceLanguage || sco.state.learnerPreferenceLanguage === '')){
                // Show language dialog
                $(document).on('afterdrawScoContent.sco.ui.languagedialog', function(event){
                    $(document).off('afterdrawScoContent.sco.ui.languagedialog');
                    _showLanguageModal();
                });
                // _showLanguageModal(function(lang){
                //     console.log('lang return: ',lang);
                //     // lang = 'zh-cn';
                //     sco.state.learnerPreferenceLanguage = lang;
                //     if (sco.state.learnerPreferenceLanguage !== sco.language){
                //         sco.language = lang;
                //         if (sco.lms.setLearnerPreferences){
                //             sco.lms.setLearnerPreferences();
                //         }
                //         sco.ui.init();
                //     }
                // });
            }else if(sco.state.location){
                var stateLocation = sco.state.location;
                if (
                    sco.config('dialogswitches', 'returndialog') === 'true' &&
                    activePage !== stateLocation
                ){
                    // Show return dialog
                    $(document).on('afterdrawScoContent.sco.ui.returndialog', function(event){
                        $(document).off('afterdrawScoContent.sco.ui.returndialog');
                        _showReturnModal(stateLocation);
                    });
                    // sco.ui.activePage(sco.ui.activePage());
                    // _showReturnModal(function(){
                    //     sco.ui.activePage(stateLocation);
                    //     sco.ui.drawContent();
                    // });
                }else if (activePage !== stateLocation){
                    // Automatically go to the bookmarked page
                    sco.ui.activePage(stateLocation);
                    // sco.ui.drawContent();
                }
            }else{
                // get the active page from the state of the menu.

                sco.ui.activePage(sco.ui.activePage());
                console.log('sco.ui.activePage', sco.ui.activePage())
            }
            deferred.resolve();
        })
        .fail(function(jqXHR, status, err){
            sco.util.messageLog.addMessage(
                'Error loading base.html: ' + err,
                sco.util.messageLogLevel.Error);
            deferred.fail(err);
        });
        return deferred;
    };
    sco.ui.init = function(){
        var deferred = $.Deferred();
        sco.util.messageLog.addMessage(
            'Current Language: ' + sco.language,
            sco.util.messageLogLevel.Information);
        $('html')
        .attr({
            'lang': sco.language,
            'dir': sco.textDirection,
            'class': sco.language + ' ' + sco.textDirection
        });
        // Load localized js and css
        var cssHref = 'content_' + sco.language + '/lib_local/css/sco.local.css';
        if ($('#scolocalcss').attr('href') !== cssHref){
            $('#scolocalcss').attr('href', cssHref);
        }        
        require([
                '../../content_' + sco.language + 
                '/lib_local/js/sco.local'
            ],
            function(localize) {
                // Allow sco.local to override sco
                sco = localize(sco);
                sco.textDirection = sco.config(
                    'languages>language[code="' + 
                    sco.language + '"]', 'direction') || 'ltr';
                sco.ui.drawBase()
                .done(function(data, status, jqXHR){
                    _initNav();
                    sco.ui.drawContent()
                    .done(function(data, status, jqXHR){
                        $('.loader').hide();
                        $('.page-loader').hide();
                        deferred.resolve(); 
                    })
                    .fail(function(jqXHR, status, err){
                        deferred.fail(err);
                    }); 
                })
                .fail(function(jqXHR, status, err){
                    deferred.fail(err);
                });
            }
        );
        return deferred;
    };
    sco.ui.showLanguageModal = _showLanguageModal;
    return sco.ui;
};});