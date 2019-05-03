'use strict';
window.define(['sco/lms/xapiwrapper.min'],function(){return function(sco){

// set: function(statement, next){
        //     var deferred = $.Deferred();
        //     var _write = {
        //         course: {
        //             launched: function(){

        //             },
        //             initialized: function(){

        //             },
        //             progressed: function(measure){

        //             },
        //             scored: function(measure) {

        //             },
        //             passed: function(){

        //             },
        //             failed: function(){

        //             },
        //             suspended: function(){

        //             },
        //             resumed: function(){

        //             },
        //             completed: function(){

        //             },
        //             terminated: function(){

        //             },
        //             exited: function(){

        //             }
        //         },
        //         module: {
        //             initialized: function(){

        //             },
        //             progressed: function(measure){

        //             },
        //             completed: function(){

        //             }
        //         },
        //         page: {
        //             initialized: function(){

        //             },
        //             progressed: function(measure){

        //             },
        //             completed: function(){

        //             },
        //             experienced: function(){

        //             }
        //         },
        //         assessment: {
        //             initialized: function(){

        //             },
        //             progressed: function(measure){

        //             },
        //             scored: function(measure) {

        //             },
        //             passed: function(){

        //             },
        //             failed: function(){

        //             }
        //         },
        //         interaction: {
        //             interacted: function(interaction){

        //             },
        //             scored: function(measure){

        //             },
        //             completed: function(){

        //             }
        //         },
        //         question: {
        //             answered: function(answer){

        //             },
        //             scored: function(measure){

        //             }
        //         },
        //         item: {
        //             experienced: function(){

        //             },
        //             launched: function(){

        //             }
        //         }
        //     }
            // user passed, initilized, etc the course
            // user launched the item called blank
            // user initialized the page id page-one title "Page One" description "The description"
            // user interacted with interaction id my-interaction type likert correctPattern [] components []
            // user scored on interaction
            // var verb = statement.user;
            // var object = statement.the;
            // var objectId = statement.id || null;
            // var result = statement.with || null;
            // _write[object][verb](objectId, result, deferred);

    var _handle;
    var _api =  {
        establishConnection: function (init, deferred) {
            init(deferred);
        },
        courseProgress: function(event, statement){

        },
        courseExit: function(event, statement){

        },
        moduleProgress: function(event, statement){

        },
        pageProgress: function(event, statement){

        },
        interactionProgress: function(event, statement){

        },
        assessmentProgres: function(event, statement){

        },
        questionProgress: function(event, statement){

        },
        // sendStatement
        // getStatement
        // getActivities
        // sendState
        // getState
        // deleteState
        // sendActivityProfile
        // getActivityProfile
        // deleteActivityProfile
        // getAgents
        // sendAgentProfile
        // getAgentProfile
        // deleteAgentProfile
        // startAPI: function (init, deferred) {
        //     init(deferred);
        // },
        // Initialize: function (element) {
        //     MessageLog.addMessage('LMS: Initialize', MessageLogLevel.Information);
        //     return _handle.Initialize('');
        // },
        // Terminate: function (element) {
        //     MessageLog.addMessage('LMS: Terminate', MessageLogLevel.Information);
        //     return _handle.Terminate('');
        // },
        // GetValue: function (element) {
        //     MessageLog.addMessage('LMS: GetValue("' + element + '")', MessageLogLevel.Information);
        //     return _handle.GetValue(element);
        // },
        // SetValue: function (element, value) {
        //     MessageLog.addMessage('LMS: SetValue("' + element + '", "' + value + '")', MessageLogLevel.Information);
        //     return _handle.SetValue(element, value);
        // },
        // Commit: function (element) {
        //     MessageLog.addMessage('LMS: Commit', MessageLogLevel.Information);
        //     return _handle.Commit('');
        // },
        // GetLastError: function (element) {
        //     MessageLog.addMessage('LMS: GetLastError', MessageLogLevel.Information);
        //     return _handle.GetLastError('');
        // },
        // GetErrorString: function (code) {
        //     MessageLog.addMessage('LMS: GetErrorString("' + code + '")', MessageLogLevel.Information);
        //     return _handle.GetErrorString(code);
        // },
        // GetDiagnostic: function (code) {
        //     MessageLog.addMessage('LMS: GetDiagnostic', MessageLogLevel.Information);
        //     return _handle.GetDiagnostic(code);
        // },
        // name: 'xApi',
        // path: {
        //     children: '._children',
        //     count: '._count',
        //     version: 'cmi._version',
        //     commentsFromLearner: 'cmi.comments_from_learner',
        //     commentsFromLearnerNComment: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_learner.' + index + '.comment';
        //     },
        //     commentsFromLearnerNLocation: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_learner.' + index + '.location';
        //     },
        //     commentsFromLearnerNTimestamp: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_learner.' + index + '.timestamp';
        //     },
        //     commentsFromLms: 'cmi.comments_from_lms',
        //     commentsFromLmsNComment: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_lms.' + index + '.comment';
        //     },
        //     commentsFromLmsNLocation: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_lms.' + index + '.location';
        //     },
        //     commentsFromLmsNTimestamp: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the comment.</param>
        //         return 'cmi.comments_from_lms.' + index + '.timestamp';
        //     },
        //     completionStatus: 'cmi.completion_status',
        //     completionThreshold: 'cmi.completion_threshold',
        //     credit: 'cmi.credit',
        //     entry: 'cmi.entry',
        //     exit: 'cmi.exit',
        //     interactions: 'cmi.interactions',
        //     interactionsNId: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.id';
        //     },
        //     interactionsNType: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.type';
        //     },
        //     interactionsNTimestamp: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.timestamp';
        //     },
        //     interactionsNWeighting: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.weighting';
        //     },
        //     interactionsNLearnerResponse: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.learner_response';
        //     },
        //     interactionsNResult: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.result';
        //     },
        //     interactionsNLatency: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.latency';
        //     },
        //     interactionsNDescription: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.description';
        //     },
        //     interactionsNObjectives: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.objectives';
        //     },
        //     interactionsNObjectivesMId: function (index1, index2) {
        //         /// <param name="index1" type="Number">Index (0-based) of the interaction.</param>
        //         /// <param name="index2" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.interactions.' + index1 + '.objectives.' + index2 + '.id';
        //     },
        //     interactionsNCorrectResponses: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
        //         return 'cmi.interactions.' + index + '.correct_responses';
        //     },
        //     interactionsNCorrectResponsesMPattern: function (index1, index2) {
        //         /// <param name="index1" type="Number">Index (0-based) of the interaction.</param>
        //         /// <param name="index2" type="Number">Index (0-based) of the pattern.</param>
        //         return 'cmi.interactions.' + index1 + '.correct_responses.' + index2 + '.pattern';
        //     },
        //     launchData: 'cmi.launch_data',
        //     learnerId: 'cmi.learner_id',
        //     learnerName: 'cmi.learner_name',
        //     learnerPreference: 'cmi.learner_preference',
        //     learnerPreferenceAudioLevel: 'cmi.learner_preference.audio_level',
        //     learnerPreferenceLanguage: 'cmi.learner_preference.language',
        //     learnerPreferenceDeliverySpeed: 'cmi.learner_preference.delivery_speed',
        //     learnerPreferenceAudioCaptioning: 'cmi.learner_preference.audio_captioning',
        //     location: 'cmi.location',
        //     maximumTimeAllowed: 'cmi.max_time_allowed',
        //     mode: 'cmi.mode',
        //     objectives: 'cmi.objectives',
        //     objectivesNId: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.id';
        //     },
        //     objectivesNScore: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.score';
        //     },
        //     objectivesNScoreScaled: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.score.scaled';
        //     },
        //     objectivesNScoreRaw: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.score.raw';
        //     },
        //     objectivesNScoreMin: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.score.min';
        //     },
        //     objectivesNScoreMax: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.score.max';
        //     },
        //     objectivesNSuccessStatus: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.success_status';
        //     },
        //     objectivesNCompletionStatus: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.completion_status';
        //     },
        //     objectivesNProgressMeasure: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.progress_measure';
        //     },
        //     objectivesNDescription: function (index) {
        //         /// <param name="index" type="Number">Index (0-based) of the objective.</param>
        //         return 'cmi.objectives.' + index + '.description';
        //     },
        //     progressMeasure: 'cmi.progress_measure',
        //     scaledPassingScore: 'cmi.scaled_passing_score',
        //     score: 'cmi.score',
        //     scoreScaled: 'cmi.score.scaled',
        //     scoreRaw: 'cmi.score.raw',
        //     scoreMax: 'cmi.score.max',
        //     scoreMin: 'cmi.score.min',
        //     sessionTime: 'cmi.session_time',
        //     successStatus: 'cmi.success_status',
        //     suspendData: 'cmi.suspend_data',
        //     timeLimitAction: 'cmi.time_limit_action',
        //     totalTime: 'cmi.total_time',
        //     lessonStatus: ''
        // },
        // interactionType: {
        //     trueFalse: 'true_false',
        //     multipleChoice: 'multiple_choice',
        //     fillIn: 'fill_in',
        //     matching: 'matching',
        //     performance: 'performance',
        //     sequencing: 'sequencing',
        //     likert: 'likert',
        //     numeric: 'numeric'
        // },
        // result: {
        //     correct: 'correct',
        //     incorrect: 'incorrect',
        //     unanticipated: 'unanticipated',
        //     neutral: 'neutral'
        // }
    };
    return function () {
        MessageLog.addMessage('Using xAPI.', MessageLogLevel.Information);
        return null;
    };
};});

