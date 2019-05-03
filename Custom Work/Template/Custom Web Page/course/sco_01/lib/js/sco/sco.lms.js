/****************************************************************************

    API Connector Copyright 2016 Sublime Media LLC 

    TODO:
        I probably broke aicc. very complicated chain with callbacks...
        Combine objective and interaction handling between AICC and SCORM modes
        Modernize code formatting to meet modern standards
        Add support for xApi (emulate scorm 2004)

*****************************************************************************/
'use strict';
window.define([
    'sco/lms/xapi',
    'sco/lms/scorm-1-3',
    'sco/lms/scorm-1-2',
    'sco/lms/aicc'
    ],function(xApi, scorm13Api, scorm12Api, aiccApi){return function(sco){

    sco.lms = {};
    sco.lms.xApi = xApi(sco);
    sco.lms.scorm13Api = scorm13Api(sco);
    sco.lms.scorm12Api = scorm12Api(sco);
    sco.lms.aiccApi = aiccApi(sco);
    
    var _api = null;
    var _config = {};
    var _messageLog = [];
    sco.lms.log = function(){
        var message = 'LMS Event: ' + arguments[0] || null;
        // level: Information, Warning, Error
        var level = arguments[1] || null;
        if(message && level){
            _messageLog.push([message, level]);
            sco.util.messageLog.addMessage(message, level);
        }else{
            return _messageLog;
        }
    };
    sco.lms.err = function(message){
        sco.lms.log(message, 'Error');
    };
    sco.lms.warn = function(message){
        sco.lms.log(message, 'Warning');
    };
    sco.lms.info = function(message){
        sco.lms.log(message, 'Information');
    };

    var _scorm13Emulator = {
        Initialize: function () {
            //MessageLog.addMessage('LMS: Initialize', MessageLogLevel.Information);
            return 'true';
        },
        Terminate: function () {
            //MessageLog.addMessage('LMS: Terminate', MessageLogLevel.Information);
            return 'true';
        },
        GetValue: function (element) {
            //MessageLog.addMessage('LMS: GetValue("' + element + '")', MessageLogLevel.Information);
            return '';
        },
        SetValue: function (element, value) {
            //MessageLog.addMessage('LMS: SetValue("' + element + '", "' + value + '")', MessageLogLevel.Information);
            return 'true';
        },
        Commit: function () {
            //MessageLog.addMessage('LMS: Commit', MessageLogLevel.Information);
            return 'true';
        },
        GetLastError: function () {
            //MessageLog.addMessage('LMS: GetLastError', MessageLogLevel.Information);
            return '0';
        },
        GetErrorString: function (code) {
            //MessageLog.addMessage('LMS: GetErrorString("' + code + '")', MessageLogLevel.Information);
            return '';
        },
        GetDiagnostic: function (code) {
            //MessageLog.addMessage('LMS: GetDiagnostic', MessageLogLevel.Information);
            return '';
        },
        interactionType: {
            trueFalse: 'true_false',
            multipleChoice: 'multiple_choice',
            fillIn: 'fill_in',
            matching: 'matching',
            performance: 'performance',
            sequencing: 'sequencing',
            likert: 'likert',
            numeric: 'numeric'
        },
        result: {
            correct: 'correct',
            incorrect: 'incorrect',
            unanticipated: 'unanticipated',
            neutral: 'neutral'
        }
    };

    var _objectives = (function(){
        var _objectivesObj = {};
        var _objectivePrototype = function(){
            var returnObj = {
                id: '',
                index: 0,
                context: [],
                score: -1,
                min: 0,
                max: 0,
                raw: 0,
                status: 'unknown',
                scoreScheme: 'none'
            };
            return returnObj;
        };
        var _contextPrototype = function(){
            var returnObj = {
                id: '',
                type: 0,
                status: 'unknown',
                score: -1
            };
            return returnObj;
        }; 
        var _getObjectiveByIndex = function(index){
            var returnObj = null;
            for(var id in _objectivesObj){
                if (_objectivesObj[id].index === index){
                    returnObj = _objectivesObj[id];
                }
            }
            return returnObj;
        };
        var _setObjectiveByContext = function(contextId, data){
            var contextObjectives = [];
            for(var id in _objectivesObj){
                if (_objectivesObj[id].context && _objectivesObj[id].context.length){
                    for (var i = 0; i < _objectivesObj[id].context.length; i++) {
                        if (_objectivesObj[id].context[i].id === contextId){
                            contextObjectives.push(_objectivesObj[id]);
                        }
                    }
                }
            }
            if (contextObjectives.length){

            }else{
                sco.lms.warn('Failed to set objective by context. Context id "' + contextId + '" was not found.');
                return null;
            }
        };
        var _setObjectiveByIndex = function(index, data){
            var returnObj = null;
            var count = 0;
            for(var id in _objectivesObj){
                if (_objectivesObj[id].index === index && !returnObj){
                    // verify existing object matches
                    if (data.id === id){
                        _objectivesObj[id] = data;
                        _objectivesObj[id].index = index;
                        returnObj = id;
                    }else{
                        sco.lms.err('Error setting objective. Objective' +
                            'with index "' + index + '" id value is "' + id +
                            ', but the new data has an id of "' + data.id);
                        returnObj = 'err';
                    }
                    returnObj = id;
                }else if (_objectivesObj[id].index === index && returnObj){
                    sco.lms.err('Error setting objective. Objective' +
                        'index "' + index + '" is duplicated in the data structure');
                    returnObj = 'err';
                }
                count ++;
            }
            if (!returnObj){
                // create a new entry
                _objectivesObj[data.id] = data;
                _objectivesObj[data.id].index = index;
                count ++;
                _objectivesMethod.length = count;
                return data.id;
            }else if (returnObj != 'err'){
                _objectivesMethod.length = count;
                return returnObj;
            }else{
                //error. return null
                return null;
            }
        };
        var _setObjectiveById = function(id, data){
            var returnObj = null;
            var count = 0;
            for(var id in _objectivesObj){count ++;}
            if (_objectivesObj.id){
                // already exists. verify data
                if (data.index && data.index !== _objectivesObj.id.index){
                    sco.lms.err('Error setting objective. Objective' +
                        'id "' + id + '" has a different existing' +
                        'index from the one being set');
                    returnObj = 'err';
                }else{
                    data.index = _objectivesObj.id.index;
                    _objectivesObj.id = data;
                    returnObj = data.index;
                }
            }else{
                // doesnt exist yet. create it
                count ++;
                for(var id in _objectivesObj){count ++;}
                data.index = count;
                _objectivesObj.id = data;
                returnObj = data.index;
            }
            if (returnObj != 'err'){
                _objectivesMethod.length = count;
                return returnObj;
            }else{
                //error. return null
                return null;
            }
        };
        var _objectivesMethod = function(){
            // Common scenarios:
            // 1. The course creates the objectives which it does by id.
            // 2. The LMS sets objective data which it does by index.
            // 3. The course updates an objective by contextId.
            // 4. The LMS retrieves the objective data by index.
            // 5. The course retreives the objective by id.

            var statement = arguments[0] || null;
            if (!statement){
                return _objectivesObj;
            }else if(typeof statement === 'number'){
                return _getObjectiveByIndex(statement);
            }else if (typeof statement === 'string'){
                return _objectivesObj[statement];
            }else{
                if (statement.id){
                    return _setObjectiveById(statement.id, statement);
                }else if (statement.index){
                    return _setObjectiveByIndex(statement.index, statement);
                }else if (statement.contextId){
                    return _setObjectiveByContext(statement.contextId, statement);
                }else{
                    return null;
                }
            }
        };

        return _objectivesMethod;
    })();

    var _interactions = (function(){
        var _interactionsObj = {};
        var _interactionPrototype = function(){
            var returnObj = {
                id: '',
                index: 0,
                type: null,
                objectives: [],
                timestamp: null,
                patterns: [],
                weight: 1,
                response: null,
                latency: null,
                description: ''
            };
            return returnObj;
        };
        var _getInteractionByIndex = function(index){
            var returnObj = null;
            for(var id in _interactionsObj){
                if (_interactionsObj[id].index === index){
                    returnObj = _interactionsObj[id];
                }
            }
            return returnObj;
        };
        var _setInteractionByIndex = function(index, data){
            var returnObj = null;
            try{
                for(var id in _interactionsObj){
                    if (_interactionsObj[id].index === index){
                        if (data.id === id){
                            if (!returnObj){
                                returnObj = _interactionsObj[id];
                            }else{
                                throw 'Error setting interaction. Interaction' +
                                'index "' + index + '" is  a duplicate';
                            }
                        }else{
                            throw 'Error setting interaction. Interaction' +
                            'with index "' + index + '" id value is "' + id +
                            ', but the new data has an id of "' + data.id;
                        }
                    }
                }
                if (!returnObj){
                    returnObj = _interactionPrototype();
                    returnObj.id = data.id;
                    returnObj.index = index;
                }
                for (var d in data){
                    returnObj[d] = data[d];
                }
            }catch(err){
                returnObj = null;
                sco.lms.err(err);
            }finally{
                return returnObj;
            }
        };
        var _setInteractionById = function(id, data){
            var returnObj = null;
            var count = 0;
            try{
                for(var id in _interactionsObj){count ++;}
                if (_interactionsObj.id){
                    returnObj = _interactionsObj.id;
                    if(data.index && data.index !== returnObj.index){
                        throw 'Error setting interaction. Interaction' +
                        'with id "' + id + '" exists, and it has an index' +
                        'of ' + returnObj.index + ', but the new index is' +
                        data.index;
                    }
                }else{
                    returnObj = _interactionPrototype();
                    returnObj.id = id;
                    if (data.index){
                        if (_getInteractionByIndex(data.index)){
                            throw 'Error setting interaction. Interaction' +
                            'with index "' + data.index + '" already exists';
                        }else{
                            returnObj.index = data.index;
                        }
                    }else{
                        returnObj.index = count;
                    }
                    
                }
                for (var d in data){
                    returnObj[d] = data[d];
                }
            }catch(err){
                returnObj = null;
                sco.lms.err(err);
            }finally{
                return returnObj;
            }
        };
        var _interactionsMethod = function(){
            // Common scenarios:
            // 1. The course creates the interaction which it does by id.
            // 2. The LMS sets interaction data which it does by index.
            // 3. The course updates an interaction by contextId.
            // 4. The LMS retrieves the interaction data by index.
            // 5. The course retreives the interaction by id.

            var statement = arguments[0] || null;
            if (!statement){
                return _interactionsObj;
            }else if(typeof statement === 'number'){
                return _getInteractionByIndex(statement);
            }else if (typeof statement === 'string'){
                return _interactionsObj[statement];
            }else{
                if (statement.id){
                    return _setInteractionById(statement.id, statement);
                }else if (statement.index){
                    return _setInteractionByIndex(statement.index, statement);
                }else{
                    return null;
                }
            }
        };
        return _interactionsMethod;
    })();

    var _establishCourseState = function (deferred) {
        sco.state = {
            initialized: false,
            learnerId: 'john.doe@sublimemedia.com',
            learnerName: 'John Doe',
            entry: 'ab-initio',
            location: '',
            mode: 'normal',
            credit: 'credit',
            totalTime: '',
            sessionStart: new Date(),
            completionStatus: '',
            successStatus: '',
            lessonStatus: '',
            progress: 0,
            score: 0,
            scoreRaw: 0,
            scored: false,
            suspendData: '',
            objectives: _objectives,
            interactions: _interactions,
            learnerPreferenceLanguage: '',
            learnerPreferenceDeliverySpeed: '',
            learnerPreferenceAudioLevel: '',
            learnerPreferenceAudioCaptioning: '',
        };
        if (sco.lms.config.reportObjectives){
            for (var i = 0; i < sco.lms.config.objectiveData.length; i++) {
                sco.state.objectives(sco.lms.config.objectiveData[i]);
            }
        }
        sco.state = _api.getState('course', sco.id);
        if (sco.state.location){
             sco.ui.activePage(sco.state.location);
        }
        deferred.resolve();
    };

    var _apiCall = function(event, statement){
        sco.lms.info('received event: ' + event.type);
        _api[event.type](event, statement);
    };

    var _setUpCourseListeners = function(){
        $(document).on(
            'courseProgress.lms courseExit.lms moduleProgress.lms ' +
            'pageProgress.lms interactionProgress.lms assessmentProgress.lms ' +
            'questionProgress.lms learnerPreferencesUpdate.lms', 
            _apiCall);
    };

    var _init = function(config){
        var deferred = $.Deferred();
        _config = {
                  preferredApis: config('preferredapis>api'),
                       scoreMin: parseFloat(config('scoremin')),
                       scoreMax: parseFloat(config('scoremax')),
                 scoreThreshold: parseFloat(config('scorethreshold')),
            completionThreshold: parseFloat(config('completionthreshold')),
               reportCompletion: config('reporting', 'completion') === 'true',
                 reportPassFail: config('reporting', 'passfail') === 'true',
               reportObjectives: config('reporting', 'objectives') === 'true',
             reportInteractions: config('reporting', 'interactions') === 'true'
        };
        if (_config.reportObjectives){
            // set up objectives.
            _config.objectiveData = [];
            //var objectiveData = sco.ui.readObjectives(); // this doesnt exist yet...
            if (!_config.objectiveData.length){
                _config.reportObjectives = false;
            }
        }
        _config.preferredApis = _config.preferredApis || ['Scorm2004Api', 'Scorm12Api'];
        if(!$.isArray(_config.preferredApis)){
            var currentVal = _config.preferredApis;
            _config.preferredApis = [];
            if (currentVal && currentVal !== ''){
                _config.preferredApis.push(currentVal);
            }
        }
        _config.preferredApis.push('Scorm2004Emulator');
        sco.lms.config = _config;
        var i = 0;
        
        while(_api === null && i < _config.preferredApis.length){
            switch (_config.preferredApis[i]) {
                case 'xAPI':
                    _api = sco.lms.xApi();
                    break;
                case 'Scorm2004Api':
                    _api = sco.lms.scorm13Api();
                    break;
                case 'Scorm12Api':
                    _api = sco.lms.scorm12Api();
                    break;
                case 'AiccApi':
                    _api = sco.lms.aiccApi();
                    break;
                case 'Scorm2004Emulator':
                    sco.lms.info('Using SCORM 2004 emulator.');
                    _api = sco.lms.scorm13Api(_scorm13Emulator);
                    break;
            }
            i++;
        }
        _setUpCourseListeners();
        _api.establishConnection(_establishCourseState, deferred);
        sco.lms.getState = _api.getState;
        return deferred;
    };
    // expose the init function 
    sco.lms.init = _init;
    return sco.lms;
};});

