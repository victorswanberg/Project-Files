  'use strict';
window.define(function(){return function(sco){
    var _handle;
    var _path = {
        children: '._children',
        count: '._count',
        version: 'cmi._version',
        commentsFromLearner: 'cmi.comments_from_learner',
        commentsFromLearnerNComment: function (index) {
            return 'cmi.comments_from_learner.' + index + '.comment';
        },
        commentsFromLearnerNLocation: function (index) {
            return 'cmi.comments_from_learner.' + index + '.location';
        },
        commentsFromLearnerNTimestamp: function (index) {
            return 'cmi.comments_from_learner.' + index + '.timestamp';
        },
        commentsFromLms: 'cmi.comments_from_lms',
        commentsFromLmsNComment: function (index) {
            return 'cmi.comments_from_lms.' + index + '.comment';
        },
        commentsFromLmsNLocation: function (index) {
            return 'cmi.comments_from_lms.' + index + '.location';
        },
        commentsFromLmsNTimestamp: function (index) {
            return 'cmi.comments_from_lms.' + index + '.timestamp';
        },
        completionStatus: 'cmi.completion_status',
        completionThreshold: 'cmi.completion_threshold',
        credit: 'cmi.credit',
        entry: 'cmi.entry',
        exit: 'cmi.exit',
        interactions: 'cmi.interactions',
        interactionsNId: function (index) {
            return 'cmi.interactions.' + index + '.id';
        },
        interactionsNType: function (index) {
            return 'cmi.interactions.' + index + '.type';
        },
        interactionsNTimestamp: function (index) {
            return 'cmi.interactions.' + index + '.timestamp';
        },
        interactionsNWeighting: function (index) {
            return 'cmi.interactions.' + index + '.weighting';
        },
        interactionsNStudentResponse: function (index) {
            return 'cmi.interactions.' + index + '.learner_response';
        },
        interactionsNResult: function (index) {
            return 'cmi.interactions.' + index + '.result';
        },
        interactionsNLatency: function (index) {
            return 'cmi.interactions.' + index + '.latency';
        },
        interactionsNDescription: function (index) {
            return 'cmi.interactions.' + index + '.description';
        },
        interactionsNObjectives: function (index) {
            return 'cmi.interactions.' + index + '.objectives';
        },
        interactionsNObjectivesMId: function (iIndex, oIndex) {
            return 'cmi.interactions.' + iIndex + 
            '.objectives.' + oIndex + '.id';
        },
        interactionsNCorrectResponses: function (index) {
            return 'cmi.interactions.' + index + 
            '.correct_responses';
        },
        interactionsNCorrectResponsesMPattern: function (iIndex, crIndex) {
            return 'cmi.interactions.' + iIndex + 
            '.correct_responses.' + crIndex + '.pattern';
        },
        launchData: 'cmi.launch_data',
        learnerId: 'cmi.learner_id',
        learnerName: 'cmi.learner_name',
        learnerPreference: 'cmi.learner_preference',
        learnerPreferenceAudioLevel: 'cmi.learner_preference.audio_level',
        learnerPreferenceLanguage: 'cmi.learner_preference.language',
        learnerPreferenceDeliverySpeed: 'cmi.learner_preference.delivery_speed',
        learnerPreferenceAudioCaptioning: 
            'cmi.learner_preference.audio_captioning',
        location: 'cmi.location',
        maximumTimeAllowed: 'cmi.max_time_allowed',
        mode: 'cmi.mode',
        objectives: 'cmi.objectives',
        objectivesNId: function (index) {
            return 'cmi.objectives.' + index + '.id';
        },
        objectivesNScore: function (index) {
            return 'cmi.objectives.' + index + '.score';
        },
        objectivesNScoreScaled: function (index) {
            return 'cmi.objectives.' + index + '.score.scaled';
        },
        objectivesNScoreRaw: function (index) {
            return 'cmi.objectives.' + index + '.score.raw';
        },
        objectivesNScoreMin: function (index) {
            return 'cmi.objectives.' + index + '.score.min';
        },
        objectivesNScoreMax: function (index) {
            return 'cmi.objectives.' + index + '.score.max';
        },
        objectivesNSuccessStatus: function (index) {
            return 'cmi.objectives.' + index + '.success_status';
        },
        objectivesNCompletionStatus: function (index) {
            return 'cmi.objectives.' + index + '.completion_status';
        },
        objectivesNProgressMeasure: function (index) {
            return 'cmi.objectives.' + index + '.progress_measure';
        },
        objectivesNDescription: function (index) {
            return 'cmi.objectives.' + index + '.description';
        },
        progressMeasure: 'cmi.progress_measure',
        scaledPassingScore: 'cmi.scaled_passing_score',
        scoreScaled: 'cmi.score.scaled',
        scoreRaw: 'cmi.score.raw',
        scoreMax: 'cmi.score.max',
        scoreMin: 'cmi.score.min',
        sessionTime: 'cmi.session_time',
        successStatus: 'cmi.success_status',
        suspendData: 'cmi.suspend_data',
        timeLimitAction: 'cmi.time_limit_action',
        totalTime: 'cmi.total_time',
        lessonStatus: '',
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
    var _initialized = false;
    var _getLastError = function (element) {
        sco.lms.info('GetLastError');
        return _handle.GetLastError(element);
    };
    var _getErrorString = function (code) {
        sco.lms.info('GetErrorString("' + code + '")');
        return _handle.GetErrorString(code);
    };
    var _getDiagnostic = function (code) {
        sco.lms.info('GetDiagnostic');
        return _handle.GetDiagnostic(code);
    };
    var _initialize = function (element) {
        sco.lms.info('Initialize');
        return _handle.Initialize(element);
    };
    var _terminate = function (element) {
        sco.lms.info('Terminate');
        return _handle.Terminate(element);
    };
    var _lmsGet = function(element){
        var returnVal = _handle.GetValue(element);
        sco.lms.info('lmsGet ' + element + ': ' + returnVal);
        return returnVal;
    };
    var _lmsSet = function(element, value){
        var success = _handle.SetValue(element, value);
        if (success){
            sco.lms.info('lmsSet ' + element + ': ' + value);
        }else{
            var errorCode = _getLastError('');
            _getErrorString(errorCode);
            _getDiagnostic(errorCode);
        }
    };
    var _commit = function(element) {
        sco.lms.info('Commit');
        return _handle.Commit(element);
    };
    
    
    var _api =  {
        establishConnection: function (init, deferred) {
            // already estabilished
            _initialized = _initialize('');
            init(deferred);
        },
        courseProgress: function(event, statement){
            var sessionTime = sco.util.convert.dateToTimespan(
                    'Scorm2004Api', new Date() - sco.state.sessionStart);
            if (sco.lms.config.reportObjectives){
                sco.lms.info('Report status by objective');
                // TODO: this
            }else{
                if (statement.progress){
                    // the course is stating progress
                    sco.state.progress = sco.util.convert
                        .floatToSevenDecimals(statement.progress);
                }
                if (statement.score || statement.scoreRaw){
                    sco.state.score = statement.score;
                    sco.state.scoreRaw = Math.round(
                        sco.state.score * sco.lms.config.scoreMax);
                }

                var score;
                var scoreRaw;

                var sThreshold = sco.lms.config.scoreThreshold;         
                if (sco.state.scored){
                    if(sco.state.score >= sThreshold){
                        sco.state.successStatus = 'passed';
                    }else{
                        sco.state.successStatus = 'failed';
                    }
                    scoreRaw = sco.state.scoreRaw;
                    score = sco.util.convert
                        .floatToSevenDecimals(sco.state.score);
                    sco.state.completionStatus = 'completed';
                }

                var cThreshold = sco.lms.config.completionThreshold;
                if(sco.state.progress >= cThreshold || sco.state.scored){
                    sco.state.completionStatus = 'completed';
                }else{
                    sco.state.completionStatus = 'incomplete';
                }
 
                if (sco.lms.config.reportCompletion &&
                    !sco.lms.config.reportPassFail
                ){
                    scoreRaw = Math.round(
                        sco.state.progress * sco.lms.config.scoreMax);
                    score = sco.util.convert
                        .floatToSevenDecimals(sco.state.progress);
                }

                if (sco.state.mode !== 'browse' && sco.state.mode !== 'review'){
                    // send sco status only if it's normal mode
                    if (sco.state.scored){
                        _lmsSet(_path.successStatus, sco.state.successStatus);
                    }
                    _lmsSet(_path.completionStatus, sco.state.completionStatus);
                    if (scoreRaw && score){
                        _lmsSet(_path.scoreRaw, scoreRaw);
                        _lmsSet(_path.scoreScaled, score);
                    }
                }
            }
            sco.state.location = sco.pageId;
            _lmsSet(_path.sessionTime, sessionTime);
            _lmsSet(_path.location,  sco.state.location);
            _lmsSet(_path.suspendData, sco.state.suspendData) ;
            _commit('');
        },
        courseExit: function(event, statement){
            // There are multiple event handlers for courseExit
            // so we have to make sure it only executes once.
            if (!sco.lms.courseExitCalled){
                sco.lms.courseExitCalled = true;
                // the course should always be up to date, so we 
                // just have to call finish.
                if (sco.state.mode !== 'browse' && sco.state.mode !== 'review'){
                    if (['passed', 'failed', 'completed']
                        .indexOf(sco.state.lessonStatus) !== -1){
                        _lmsSet(_path.exit, '');
                    }else{
                        _lmsSet(_path.exit, 'suspend');
                    }
                }
                _terminate('');
            }
        },
        moduleProgress: function(event, statement){
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
        },
        pageProgress: function(event, statement){
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
        },
        interactionProgress: function(event, statement){
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
            if (sco.lms.config.reportInteractions){
                console.log('statement',statement);
                var interaction = sco.state.interactions(statement);
                if (interaction){
                    _lmsSet(_path.interactionsNId(interaction.index), interaction.id);
                    if (interaction.timestamp){
                        _lmsSet(_path.interactionsNTimestamp(interaction.index), interaction.timestamp);
                    }
                    if (interaction.type){
                        _lmsSet(_path.interactionsNType(interaction.index), _api.interactionType[interaction.type]);
                    }
                    if (interaction.weight){
                        _lmsSet(_path.interactionsNWeighting(interaction.index), interaction.weight);
                    }
                    if (interaction.latency){
                        _lmsSet(_path.interactionsNLatency(interaction.index), interaction.latency);
                    }
                    if (interaction.response){
                        _lmsSet(_path.interactionsNStudentResponse(interaction.index), interaction.response);
                    }
                    if (interaction.result){
                        _lmsSet(_path.interactionsNResult(interaction.index), _api.result[interaction.result]);
                    }
                    if (interaction.objectives){
                        for (var o = 0; o < interaction.objectives.length; o++) {
                            _lmsSet(_path.interactionsNObjectivesMId(interaction.index, o), interaction.objectives[o]);
                        }
                    }
                    if (interaction.patterns){
                        for (var p = 0; p < interaction.patterns.length; p++) {
                            _lmsSet(_path.interactionsNCorrectResponsesMPattern(interaction.index, p), interaction.patterns[p]);
                        }
                    }
                }
            }
        },
        assessmentProgres: function(event, statement){
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
        },
        questionProgress: function(event, statement){
            if (sco.lms.config.reportInteractions){
                //
            }
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
        },
        learnerPreferencesUpdate: function(event, statement){
            _lmsSet(_path.learnerPreferenceLanguage, 
                sco.state.learnerPreferenceLanguage);
            _lmsSet(_path.learnerPreferenceDeliverySpeed, 
                sco.state.learnerPreferenceDeliverySpeed);
            _lmsSet(_path.learnerPreferenceAudioLevel, 
                sco.state.learnerPreferenceAudioLevel);
            _lmsSet(_path.learnerPreferenceAudioCaptioning, 
                sco.state.learnerPreferenceAudioCaptioning);
        },
        getState: function(type, id){
            if(type === 'course'){
                // get core course data
                $.extend(sco.state, {
                    initialized: _initialized,
                    learnerId: _lmsGet(_path.learnerId),
                    learnerName:_lmsGet(_path.learnerName),
                    location: _lmsGet(_path.location),
                    entry: _lmsGet(_path.entry),
                    mode: _lmsGet(_path.mode),
                    credit: _lmsGet(_path.credit),
                    totalTime: _lmsGet(_path.totalTime),
                    completionStatus: _lmsGet(_path.completionStatus),
                    successStatus: _lmsGet(_path.successStatus),
                    learnerPreferenceLanguage: _lmsGet(_path.learnerPreferenceLanguage),
                    learnerPreferenceDeliverySpeed: _lmsGet(_path.learnerPreferenceDeliverySpeed),
                    learnerPreferenceAudioLevel: _lmsGet(_path.learnerPreferenceAudioLevel),
                    learnerPreferenceAudioCaptioning: _lmsGet(_path.learnerPreferenceAudioCaptioning)
                });
                var suspendData = _lmsGet(_path.suspendData);
                if (suspendData === ''){
                    sco.state.suspendData = {};
                }else{
                    sco.state.suspendData = JSON.parse(suspendData);
                }
                var progress = _lmsGet(_path.progressMeasure);
                var score = _lmsGet(_path.scaledPassingScore);
                var scoreRaw = _lmsGet(_path.scoreRaw);
                if (progress !== ''){
                   sco.state.progress = parseFloat(progress);
                }
                if (score !== ''){
                    sco.state.score = parseFloat(score);
                }
                if (scoreRaw !== ''){
                    sco.state.scoreRaw = parseFloat(scoreRaw);
                }

                // get objective data
                if (sco.lms.config.reportObjectives){
                    var objectiveCount = _lmsGet(_path.objectivesCount);
                    for (var o = 0; o < objectiveCount; o++) {
                        sco.state.objectives({
                            index: o,
                            id: _lmsGet(_path.objectivesNId(o)),
                            score: _lmsGet(_path.objectivesNScoreRaw(o)),
                            min: _lmsGet(_path.objectivesNScoreMin(o)),
                            max: _lmsGet(_path.objectivesNScoreMax(o)),
                            status: _lmsGet(_path.objectivesNStatus(o))
                        });
                    }
                }
                // get interaction data
                if (sco.lms.config.reportInteractions){
                    var int = _path.interactions;
                    var interactionCount = _lmsGet(int + _path.count);
                    for (var i = 0; i < interactionCount; i++) {
                        var cmin = int + '.' + i + '.';
                        var interaction = {
                            index: i,
                            id: _lmsGet(cmin + 'id'),
                            timestamp: _lmsGet(cmin + 'time'),
                            type: _lmsGet(cmin + 'type'),
                            weighting: _lmsGet(cmin + 'weighting'),
                            studentResponse: _lmsGet(cmin + 'learner_response'),
                            result: _lmsGet(cmin + 'result'),
                            latency: _lmsGet(cmin + 'latency'),
                        };
                        var objectivesCount = _lmsGet(cmin + 
                            'objectives._count');
                        if (objectivesCount > 0){
                            var intObj = [];
                            for (var io = 0; io < objectivesCount; io++) {
                                intObj.push(_lmsGet(cmin + 
                                    'objectives.' + io + '.id'));
                            }
                            interaction.objectives = intObj;
                        }
                        var responsesCount = _lmsGet(cmin + 
                            'correct_responses._count');
                        if (responsesCount > 0){
                            var intRes = [];
                            for (var ir = 0; ir < objectivesCount; ir++) {
                                intRes.push(_lmsGet(cmin + 
                                    'correct_responses.' + ir + '.pattern'));
                            }
                            interaction.correctResponses = intRes;
                        }
                        sco.state.interactions(interaction);
                    }
                }

                // set the defaults:
                if (sco.state.entry === 'ab_initio'){
                    if (sco.lms.config.reportCompletion){
                        _lmsSet(_path.progressMeasure, 0);
                    }
                    if (sco.lms.config.reportPassFail){
                        _lmsSet(_path.scoreMin, 
                        sco.lms.config.scoreMin);
                        _lmsSet(_path.scoreMax, 
                        sco.lms.config.scoreMax);
                    }
                }
                return sco.state;
            }
        },
        name: 'Scorm2004Api',
        path: _path,
        interactionType: {
            trueFalse: 'true-false',
            multipleChoice: 'choice',
            fillIn: 'fill-in',
            matching: 'matching',
            performance: 'performance',
            sequencing: 'sequencing',
            likert: 'likert',
            numeric: 'numeric'
        },
        result: {
            correct: 'correct',
            incorrect: 'wrong',
            unanticipated: 'unanticipated',
            neutral: 'neutral'
        }
    };
    return function (handle) {
        if (handle){ // handle allows a faux api to be passed for emulation
            _handle = handle;
            return _api;
        }else{
            var win = window, attempts = 0;
            while (win.API_1484_11 == null && 
                (
                    (win.parent != null && win.parent !== win) || 
                    win.opener != null
                )
            ){
                if (++attempts > 15) {
                    sco.lms.warn('Error finding SCORM 2004 API: ' +
                        'Frames are too deeply nested.');
                    return null;
                }
                win = (win.parent != null && win.parent !== win) ? 
                win.parent : 
                win.opener;
            }
            if (win.API_1484_11 != null){
                _handle = win.API_1484_11;
                sco.lms.info('Using SCORM 2004 API.');
                return _api;
            }else{
                sco.lms.warn('Failed to find SCORM 2004 API.');
                return null;
            }
        }
    };
};});

