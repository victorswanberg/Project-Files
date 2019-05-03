'use strict';
window.define(function(){return function(sco){
    var _handle;
    var _path = {
        children: '._children',
        count: '._count',
        learnerId: 'cmi.core.student_id',
        learnerName: 'cmi.core.student_name',
        location: 'cmi.core.lesson_location',
        credit: 'cmi.core.credit',
        lessonStatus: 'cmi.core.lesson_status',
        entry: 'cmi.core.entry',
        exit: 'cmi.core.exit',
        score: 'cmi.core.score',
        scoreRaw: 'cmi.core.score.raw',
        scoreMax: 'cmi.core.score.max',
        scoreMin: 'cmi.core.score.min',
        totalTime: 'cmi.core.total_time',
        sessionTime: 'cmi.core.session_time',
        mode: 'cmi.core.lesson_mode',
        suspendData: 'cmi.suspend_data',
        launchData: 'cmi.launch_data',
        commentsFromLearner: 'cmi.comments',
        commentsFromLms: 'cmi.comments_from_lms',
        objectives: 'cmi.objectives',
        objectivesCount: 'cmi.objectives._count',
        objectivesNId: function (index) {
            return 'cmi.objectives.' + index + '.id';
        },
        objectivesNScoreScaled: function (index) {
            return 'cmi.objectives.' + index + '.score';
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
        objectivesNStatus: function (index) {
            return 'cmi.objectives.' + index + '.status';
        },
        scaledPassingScore: 'cmi.student_data.mastery_score',
        maximumTimeAllowed: 'cmi.student_data.max_time_allowed',
        timeLimitAction: 'cmi.student_data.time_limit_action',
        learnerPreference: 'cmi.student_preference',
        learnerPreferenceAudioLevel: 'cmi.student_preference.audio',
        learnerPreferenceLanguage: 'cmi.student_preference.language',
        learnerPreferenceDeliverySpeed: 'cmi.student_preference.speed',
        learnerPreferenceAudioCaptioning: 'cmi.student_preference.text',
        interactionsCount: 'cmi.interactions._count',
        interactionsNId: function (index) {
            return 'cmi.interactions.' + index + '.id';
        },
        interactionsNObjectivesCount: function (index) {
            return 'cmi.interactions.' + index + '.objectives._count';
        },
        interactionsNObjectivesMId: function (
            interactionIndex, objectiveIndex) {
            return 'cmi.interactions.' + interactionIndex + 
            '.objectives.' + objectiveIndex + '.id';
        },
        interactionsNTimestamp: function (index) {
            return 'cmi.interactions.' + index + '.time';
        },
        interactionsNType: function (index) {
            return 'cmi.interactions.' + index + '.type';
        },
        interactionsNCorrectResponsesCount: function (index) {
            return 'cmi.interactions.' + index + '.correct_responses._count';
        },
        interactionsNCorrectResponsesMPattern: function (
            interactionIndex, patternIndex) {
            return 'cmi.interactions.' + interactionIndex + 
            '.correct_responses.' + patternIndex + '.pattern';
        },
        interactionsNWeighting: function (index) {
            return 'cmi.interactions.' + index + '.weighting';
        },
        interactionsNStudentResponse: function (index) {
            return 'cmi.interactions.' + index + '.student_response';
        },
        interactionsNResult: function (index) {
            return 'cmi.interactions.' + index + '.result';
        },
        interactionsNLatency: function (index) {
            return 'cmi.interactions.' + index + '.latency';
        },
        version: '',
        commentsFromLearnerNComment: '',
        commentsFromLearnerNLocation: '',
        commentsFromLearnerNTimestamp: '',
        commentsFromLmsNComment: '',
        commentsFromLmsNLocation: '',
        commentsFromLmsNTimestamp: '',
        completionThreshold: '',
        interactionsNDescription: '',
        objectivesNProgressMeasure: '',
        objectivesNDescription: '',
        progressMeasure: '',
        scoreScaled: '',
        successStatus: '',
        completionStatus: ''
    };
    var _initialized = false;
    var _getLastError = function (element) {
        sco.lms.info('GetLastError');
        return _handle.LMSGetLastError(element);
    };
    var _getErrorString = function (code) {
        sco.lms.info('GetErrorString("' + code + '")');
        return _handle.LMSGetErrorString(code);
    };
    var _getDiagnostic = function (code) {
        sco.lms.info('GetDiagnostic');
        return _handle.LMSGetDiagnostic(code);
    };
    var _initialize = function (element) {
        sco.lms.info('Initialize');
        return _handle.LMSInitialize(element);
    };
    var _terminate = function (element) {
        sco.lms.info('Terminate');
        return _handle.LMSFinish(element);
    };
    var _lmsGet = function(element){
        var returnVal = _handle.LMSGetValue(element);
        sco.lms.info('lmsGet ' + element + ': ' + returnVal);
        return returnVal;
    };
    var _lmsSet = function(element, value){
        var success = _handle.LMSSetValue(element, value);
        if (success){
            sco.lms.info('lmsSet ' + element + ': ' + value);
        }else{
            var errorCode = _getLastError('');
            _getErrorString(errorCode);
            _getDiagnostic(errorCode);
        }
    };
    var _commit = function (element) {
        sco.lms.info('Commit');
        return _handle.LMSCommit(element);
    };
    var _api =  {
        establishConnection: function (init, deferred) {
            // already estabilished
            _initialized = _initialize('');
            init(deferred);
        },
        courseProgress: function(event, statement){
            var sessionTime = sco.util.convert.dateToTimespan(
                    'Scorm12Api', new Date() - sco.state.sessionStart);
            if (sco.lms.config.reportObjectives){
                sco.lms.info('Report status by objective');
                // TODO: this
            }else{
                if (statement.progress){
                    sco.state.progress = statement.progress;
                }
                if (statement.score){
                    sco.state.score = statement.score;
                    sco.state.scoreRaw = Math.round(
                        sco.state.score * sco.lms.config.scoreMax);
                }

                // scorm 1.2 has a single status for completion and pass/fail
                var lessonStatus; 
                var scoreRaw;

            
                var sThreshold = sco.lms.config.scoreThreshold;         
                if (sco.state.scored){
                    if(sco.state.score >= sThreshold){
                        sco.state.successStatus = 'passed';
                    }else{
                        sco.state.successStatus = 'failed';
                    }
                    lessonStatus = sco.state.successStatus;
                    scoreRaw = sco.state.scoreRaw;
                    sco.state.completionStatus = 'completed';
                }

                var cThreshold = sco.lms.config.completionThreshold;
                if(sco.state.progress >= cThreshold || sco.state.scored){
                    sco.state.completionStatus = 'completed';
                }else{
                    sco.state.completionStatus = 'incomplete';
                    lessonStatus = sco.state.completionStatus;
                }
                

                if (sco.lms.config.reportCompletion &&
                    !sco.lms.config.reportPassFail
                ){
                    lessonStatus = sco.state.completionStatus;
                    scoreRaw = Math.round(
                        sco.state.progress * sco.lms.config.scoreMax);
                }

                if (sco.state.mode !== 'browse' && sco.state.mode !== 'review'){
                    // send sco status only if it's normal mode
                    _lmsSet(_path.lessonStatus, lessonStatus);
                    if (scoreRaw){
                        _lmsSet(_path.scoreRaw, scoreRaw);
                    }
                }
                sco.state.lessonStatus = lessonStatus;
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
            if (sco.lms.config.reportObjectives){
                // see if the id is listed as an objective activity
            }
            if (sco.lms.config.reportInteractions){
                //
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
                $.extend(sco.state, {
                    initialized: _initialized,
                    learnerId: _lmsGet(_path.learnerId),
                    learnerName:_lmsGet(_path.learnerName),
                    location: _lmsGet(_path.location),
                    entry: _lmsGet(_path.entry),
                    mode: _lmsGet(_path.mode),
                    credit: _lmsGet(_path.credit),
                    totalTime: _lmsGet(_path.totalTime),
                    learnerPreferenceLanguage: _lmsGet(_path.learnerPreferenceLanguage),
                    learnerPreferenceDeliverySpeed: _lmsGet(_path.learnerPreferenceDeliverySpeed),
                    learnerPreferenceAudioLevel: _lmsGet(_path.learnerPreferenceAudioLevel),
                    learnerPreferenceAudioCaptioning: _lmsGet(_path.learnerPreferenceAudioCaptioning)
                });
                var lessonStatus = _lmsGet(_path.lessonStatus);
                if (lessonStatus === 'passed' || lessonStatus === 'failed'){
                    sco.state.successStatus = lessonStatus;
                }else if (lessonStatus === 'completed' || 
                lessonStatus === 'incomplete'){
                    sco.state.completionStatus = lessonStatus;
                }
                var suspendData = _lmsGet(_path.suspendData);
                if (suspendData !== ''){
                    sco.state.suspendData = JSON.parse(suspendData);
                    // For SCORM 1.2 we get progress measure from suspend data
                    // because the score is strictly for assessment or 
                    // objectives score.
                    if (suspendData.p){
                        for (var i = 0; i < suspendData.p.length; i++) {
                            sco.state.progress += parseFloat(suspendData.p[i]);
                        }
                    }
                }
                var scoreRaw = _lmsGet(_path.scoreRaw);
                if (scoreRaw !== ''){
                    sco.state.scoreRaw = parseInt(scoreRaw);
                    sco.state.score = sco.state.scoreRaw/
                    sco.lms.config.scoreMax;
                }
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
                if (sco.lms.config.reportInteractions){
                    var cmi = 'cmi.interactions.';
                    var interactionCount = _lmsGet(cmi + '._count');
                    for (var i = 0; i < interactionCount; i++) {
                        var cmin = cmi + '.' + i + '.';
                        var interaction = {
                            index: i,
                            id: _lmsGet(cmin + 'id'),
                            timestamp: _lmsGet(cmin + 'time'),
                            type: _lmsGet(cmin + 'type'),
                            weighting: _lmsGet(cmin + 'weighting'),
                            studentResponse: _lmsGet(cmin + 'student_response'),
                            result: _lmsGet(cmin + 'result'),
                            latency: _lmsGet(cmin + 'latency'),
                        };
                        var objectivesCount = _lmsGet(cmin + 'objectives._count');
                        if (objectivesCount > 0){
                            var intObj = [];
                            for (var io = 0; io < objectivesCount; io++) {
                                intObj.push(_lmsGet(cmin + 'objectives.' + io + '.id'));
                            }
                            interaction.objectives = intObj;
                        }
                        var responsesCount = _lmsGet(cmin + 'correct_responses._count');
                        if (responsesCount > 0){
                            var intRes = [];
                            for (var ir = 0; ir < objectivesCount; ir++) {
                                intRes.push(_lmsGet(cmin + 'correct_responses.' + ir + '.pattern'));
                            }
                            interaction.correctResponses = intRes;
                        }
                        sco.state.interactions(interaction);
                    }
                }
                // set the defaults:
                if (sco.state.entry === 'ab-initio'){
                    _lmsSet(_path.scoreMin, 
                    sco.lms.config.scoreMin);
                    _lmsSet(_path.scoreMax, 
                    sco.lms.config.scoreMax);
                }

                return sco.state;
            }
        },
        name: 'Scorm12Api',
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

    return function () {
        var win = window, attempts = 0;
        while (
            win.API == null && (
                (
                    win.parent != null && 
                    win.parent !== win
                ) || 
                win.opener != null
            )
        ){
            if (++attempts > 15) {
                sco.lms.warn('Error finding SCORM 1.2 API: ' +
                    'Frames are too deeply nested.');
                return null;
            }
            win = (
                win.parent != null && 
                win.parent !== win
            ) ? win.parent : win.opener;
        }
        if (win.API){
            _handle = win.API;
            sco.lms.info('Using SCORM 1.2 API.');
            return _api;
        }else{
            return null;
        }
    };
};});

