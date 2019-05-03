'use strict';
window.define(function(){return function(sco){
    // private properites
    var _handle = {};
    var _aiccUrl;
    var _aiccSid;
    var _defaultopener;
    var _xdomain;
    var _self = this;
    var _onload;
    var _ini; //  need to point ini stuff to config
    var _config;
    var _scormInitialized = false;
    var _dataModel;
    var _scormData;
    var _lastError = '';
    var _sessionId = '';
    var _isHistorical = 1;
    var _notHistorical = 0;
    var _reset = false;
    var _postData = '';
    var _postFrames = [];
    var _postMessageNode;
    var _hacpReturnDataObject = {};
    var _hacpPostDialog;
    var _communicationFailure = false;
    // private methods
    function _LoadResources(init, deferred) {
        // Start by loading the data template and data model xml documents.
        var loader = ResourceLoader();
        loader.addResource('xml', sco.rootPath + 'framework/scripts/scormapi_1_3/scormDataTemplate_1484_11.xml', 'scormDataTemplate_1484_11');
        if (_xdomain) {
            loader.addResource('js', sco.rootPath + 'framework/scripts/crossxhr/crossxhr.js');
        }
        loader.onSuccess(function(){
            _InitializeEmulator(init, deferred);
        });
        loader.getResources();
    }
    function _InitializeEmulator(init, deferred) {
        _scormData = xml.scormDataTemplate_1484_11;
        _reset = false;
        _self.Start = function () {
        }
        // Initialize communication with the server and load SCORM object model with data.
        // Set a timer. If there is no return from the server within 1 full minute, Continue with a message:
        _communicationFailure = true;
        setTimeout(function(){_hacpGetFailed(init, deferred)}, 60000);
        _hacpGet(init, deferred);
    }
    function _hacpGetFailed(init, deferred) {
        if (_communicationFailure) {
            alert(xml.labels.find('apiconnector > aicc > hacpgetfailed').text());
            _killPostMessage();
            init(deferred);
        }
    }
    function _InitializeEmulatorComplete(init, deferred) {
        //alert('_InitializeEmulatorComplete');
        _communicationFailure = false;
        init(deferred);
    }
    _handle.Initialize = function () {
        _lastError = '0';
        if (!_scormInitialized) {
            // Initialize the scorm object model.
            _SetMetaData('initialized', 'true');
            _SetMetaData('finished', 'false');
            _SetScormData('Initialize', 'initializeSession', 'true', _isHistorical);
            _scormInitialized = true;
            return 'true';
        } else {
            return 'false';
        }
    }
    _handle.Terminate = function () {
        _lastError = '0';
        var success = 'false';
        if ((_GetMetaData('initialized') == 'true') && (_GetMetaData('finished') == 'false')) {
            var utcDatestamp = new Date().valueOf();
            _SetMetaData('finished', 'true');
            _SetMetaData('initialized', 'false');
            if (_SetScormData('Terminate', 'terminateSession', 'true', _isHistorical)) {
                if (_handle.Commit()) {
                    success = 'true';
                }
                _hacpPut();
            }
        }
        return success;
    }
    _handle.GetValue = function (pointer) {
        // alert('initialized? '+_GetMetaData('initialized'));
        _lastError = '0';
        var data = '';
        if (_GetMetaData('initialized') == 'true') {
            data = _GetScormData(pointer);
            //alert('pointer: ' + pointer + ' data: ' + data);
        }
        return data;
    }
    _handle.SetValue = function (pointer, data) {
        _lastError = '0';
        var success = 'false';
        if (_GetMetaData('initialized') == 'true') {
            var historical = _notHistorical;
            if (_SetScormData('SetValue', pointer, data, historical)) {
                success = 'true';
            }
        }
        return success;
    }
    _handle.Commit = function () {
        _lastError = '0';
        var success = true;
        return success;
    }
    _handle.GetLastError = function () {
        return _lastError;
    }
    _handle.GetErrorString = function () {
        return '';
    }
    _handle.GetDiagnostic = function () {
        return '';
    }

    function _SetMetaData(pointer, data) {
        var selector = 'scormdata > metadata > ' + pointer.replace(/\./g, ' > ');
        var success;
        try {
            success = true;
            _scormData.find(selector).text(data);
        } catch (e) {
            success = false;
        }
        return success;
    }
    function _GetMetaData(pointer) {
        var selector = 'scormdata > metadata > ' + pointer.replace(/\./g, ' > ');
        var data;
        try {
            data = _scormData.find(selector).text();
        } catch (e) {
            data = '';
        }
        return data;
    }
    function _SetScormData(call, pointer, data) {
        var success = false;
        if (pointer.indexOf('adl.nav') == -1) {
            success = _UpdateDataObjectModel(call, pointer, data);
        } else {
            success = true;
        }
        return success;
    }
    function _UpdateDataObjectModel(call, pointer, data) {
        var success = true;
        // If the selctor contains collection notation, modifiy the pointer to be jquery friendly
        // change dots to angle brackets
        var selector;
        if (/\.\d+\./.test(pointer)) {  // Has a number it, indicating an objective or interaction collection
            selector = pointer.replace(/(\.)(\d+)(\.)/g, ' > item[itemIndex="$2"] > ').replace(/\./g, ' > ');
        } else { // Regular non-collection pointer
            selector = 'scormdata > ' + pointer.replace(/\./g, ' > ');
        }
        //alert('_SetScormData: selector: ' + selector + ',  data: ' + data);
        // If it is not an Initialize or Terminate,
        if (pointer != '' && pointer != 'initializeSession' && pointer != 'terminateSession') {
            // If the pointer is collection notation and not already in the DOM. We can tell it's a collection notation because there is a number with dots on either side.
            if ((/\.\d+\./.test(pointer)) && !(_scormData.find(selector).length)) { 
                // make a selector pointing to the prototype...
                var prototypeSelector = 'prototypes > ' + /(.*)(\.)(\d+)(\.)/g.exec(pointer)[1].replace(/\./g, '\\.') + ' > item';
                var rootSelector = /(.*)(\.)(\d+)(\.)/g.exec(pointer)[1].replace(/\./g, ' > ');
                var itemIndex = parseFloat(/(\.)(\d+)(\.)/g.exec(pointer)[2]);
                //alert(pointer + ' :: ' + selector + ' :: ' + prototypeSelector + ' :: ' + rootSelector);
                // Create the attachment point
                var $attachmentElement = _scormData.find(prototypeSelector).clone();
                $attachmentElement.attr('itemIndex',itemIndex);
                //alert($attachmentElement[0].outerHTML);
                _scormData.find(rootSelector).append($attachmentElement);
            } else {
                // Else, just put the data into the DOM
                try {
                    _scormData.find(selector).text(data);
                    success = true;
                } catch (e) {
                    success = false;
                }
            }
        }
        return success;
    }
    function _GetScormData(pointer) {
        var selector;
        if (/\.\d+\./.test(pointer)) {  // Has a number it, indicating an objective or interaction collection
            selector = pointer.replace(/(\.)(\d+)(\.)/g, ' > item[itemIndex="$2"] > ').replace(/\./g, ' > ');
        } else { // Regular non-collection pointer
            selector = 'scormdata > ' + pointer.replace(/\./g, ' > ');
        }
        var data;
        // Check for keyword
        var leafNode = pointer.split('.')[(pointer.split('.').length) - 1];

        if (leafNode == '_children') {
            // return the children
            var childrenArray = [];
            selector = selector.replace(/ > _children/, '');
            $(selector).each(function (index) {
                childrenArray.push($(this).prop("tagName"));
            });
            data = childrenArray.join();

        } else if (leafNode == '_count') {
            // return the count
            selector = selector.replace(/_count/, 'item');
            try {
                var data = parseFloat(_scormData.find(selector).length);
            } catch (e) {
                data = 0;
            }
           
        } else {
            try {
                data = _scormData.find(selector).text().replace(/(\r\n|\n|\r)/gm, "");
            } catch (e) {
                data = '';
            }
        }
        //alert('_GetScormData: selector: ' + selector + ',  data: ' + data);
        return data;
    }
    var _hacpPut = function () {
        var successStatus = _GetScormData('cmi.success_status');
        var completionStatus = _GetScormData('cmi.completion_status');
        var lessonStatus = '';
        var lessonScore = '';
        if (successStatus != '') {
            lessonStatus = successStatus;
            lessonScore = _GetScormData('cmi.score.raw') + ',' + _GetScormData('cmi.score.max');
        } else {
            lessonStatus = completionStatus;
            // never send a score...
        }

        // Test for Plateau since it doesn't support 'completed', 'c', or 'passed'; only 'P'
        var firstChar = lessonStatus.charAt(0).toLowerCase();
        if (window.sco.launchOrigin == 'plateau' && (firstChar == 'c' || firstChar == 'p'))
            lessonStatus = 'P';

        var suspendData = _GetScormData('cmi.suspend_data');
        var aiccData = '[core]\n';
        aiccData += 'lesson_status=' + lessonStatus + '\n';
        aiccData += 'lesson_location=' + _GetScormData('cmi.location') + '\n';
        if (lessonScore) {
            aiccData += 'score=' + lessonScore + '\n';
        }
        aiccData += '[core_lesson]\n' + suspendData + '\n';
        //alert(aiccData);
        _postData = 'command=PutParam&version=4.0&session_id=' + _aicc_sid + '&aicc_data=' + aiccData;
        // If internet explorer, open a dialog to keep the browser from closing.
        var dataPackage = {};
        dataPackage.url = _aicc_url;
        dataPackage.sid = _aicc_sid;
        dataPackage.xdomain = _xdomain;
        dataPackage.data = _postData;
        dataPackage.waitMessage = xml.labels.find('apiconnector > aicc > pleasewait').text();
        dataPackage.failedMessage = xml.labels.find('apiconnector > aicc > hacpgetfailed').text();
        if (_defaultopener) { // let's load the hacpput page into a hidden frame in the opener page!
            window.opener.parseHacpPutData(JSON.stringify(dataPackage));
            var $frameElement = window.opener.$('<iframe id="postFrame" name="postFrame" src="' + sco.rootPath + 'framework/scripts/hacp/hacpput.htm" style="bg-color:#000000;border:none;left:0;top:0;width:500px;height:300px;xz-index:1001;xposition:absolute;overflow:hidden;" />');

            window.opener.$("body").find('p').css('width', '500px');
            window.opener.$("body").find('p').html($frameElement);
            window.opener.$("body").find('h1').html(xml.labels.find('apiconnector > aicc > communicating').text());
            window.opener.$("body").find('button').css('display', 'none');
            //window.opener.$("body").find('p').append($frameElement);
        } else {
            dataPackage.defaultopener = null; // No default opener page. We have to open the put page in a popup. Won't work with ipad.
            if (/chrome/.test(navigator.userAgent.toLowerCase())) {
                var postWindow = window.open(sco.rootPath + "framework/scripts/hacp/hacpput.htm", "putWindow", "width=500,height=300,location=no,menubar=no,resizable=no,scrollbars=no,status=no,toolbar=no");
                postWindow.dialogArguments = dataPackage;
                postWindow.closeCourse = window.opener.closeCourse;
                postWindow.focus();
            } else {
                var result = window.showModalDialog(sco.rootPath + "framework/scripts/hacp/hacpput.htm", dataPackage, "dialogWidth:500px; dialogHeight:300px; center:yes");
                try { // close the course whatever the result
                    window.opener.closeCourse();
                } catch (e) {

                }
            }
        }
        
    }
    var _parseHapcPut = function (postReturn) {
        // I dont think this is connected to anything
        //alert(postReturn);
        _hacpPostDialog.close();
    }
    var _hacpGet = function (init, deferred) {
        //show get message:
        _showPostMessage();

        if (1) {
            var postData = 'command=GetParam&version=4.0&session_id=' + _aicc_sid;
            if (_xdomain) {
                var ieOlderThan9 = ((/msie/.test(navigator.userAgent.toLowerCase())) && (/msie ([0-9]{1,}[\.0-9]{0,})/.test(navigator.userAgent.toLowerCase())) && (parseFloat(/msie ([0-9]{1,}[\.0-9]{0,})/.exec(navigator.userAgent.toLowerCase())[1]) < 9));
                var isFirefox = /firefox/.test(navigator.userAgent.toLowerCase());
                if (ieOlderThan9 || isFirefox) {
                    //alert('IE older than ver 9, or is Firefox');
                    var dataPackage = { postURL: _aicc_url, postData: postData, labels: xml.labels }

                    var result = window.showModalDialog(sco.rootPath + "framework/scripts/hacp/hacpget.htm", dataPackage, "dialogWidth:400px; dialogHeight:200px; center:yes");
                    if (result == null) {
                        // The dialog didn't work. Popups are blocked.
                        alert(xml.labels.find('apiconnector > aicc > popupsblocked').text());
                    }
                    _parseHapcGet(result, init, deferred);
                } else {
                    var postRequest = new CrossXHR();
                    postRequest.onreadystatechange = function () {
                        if (postRequest.readyState == 4) {
                            try {
                                if (postRequest.status != 200) {
                                    // fail!
                                    _hacpGetFailed(init, deferred);
                                } else {
                                    // ok, process...
                                    _parseHapcGet(postRequest.responseText);
                                }
                            } catch (e) {
                                // fail!
                                _hacpGetFailed(init, deferred);
                            }
                        }
                    };
                    postRequest.open('PUT', _aicc_url);
                    postRequest.send(postData);
                }
            } else {
                _executePost(postData, _parseHapcGet, init, deferred);
            }

        } else {
            //        // fake it!
            var postReturn = 'Error = 0\n\r' + 'error_text = An error!\n\r' + 'version=3.5\n\r' + 'aicc_data=[core]\n\r' +
                            'student_id=dave.carlile@sublimemedia.com\n\r' +
                            'student_name=Carlile, Dave\n\r' +
                            'credit=credit\n\r' +
                            'lesson_location=\n\r' +
                            'lesson_mode=normal\n\r' +
                            'lesson_status=n,ab-initio\n\r' +
                            'score=33,100\n\r' +
                            'time=0000:00:00\n\r' +
                            '[core_lesson]\n\r' +
                            '[core_vendor]\n\r' +
                            '[objectives_status]\n\r' +
                            '[student_data]\n\r' +
                            'mastery_score=80.000000000\n\r' +
                            'max_time_allowed=\n\r' +
                            'time_limit_action=';
                    setTimeout(_parseHapcGet(postReturn, init, deferred),500);
        }
    }
    var _parseHapcGet = function (postReturn, init, deferred) {
        _destroyPostFrames();
        _killPostMessage();
        //wuz there an error?
        var hacpResponseError = /error\s?=\s?(.*)/i.exec(postReturn)[1];
        if (postReturn == 'xdom') {

        } else if (hacpResponseError != 0) {
            //ruh-roh!
            var hacpResponseErrorText = '';
            if (/error_text\s?=\s?(.*)/i.test(postReturn)) {
                hacpResponseErrorText = /error_text\s?=\s?(.*)/i.exec(postReturn)[1];
                //alert(hacpResponseErrorText);
            }
        } else {
            var hacpResponseAiccData = /aicc_data\s?=\s?([\s\S]*)/i.exec(postReturn)[1];
            //alert(hacpResponseAiccData);
            //loop through the top level objects
            var groupTitles = hacpResponseAiccData.match(/\[\S*\]/g);
            //var returnArray = hacpResponseAiccData.split(/\[\S*\]/g);
            //alert(groupTitles.length);
            for (i = 0; i < groupTitles.length; i++) {
                var groupTitle = /\[(\S*)\]/.exec(groupTitles[i])[1].toLowerCase();
                //alert('groupTitle: ' + groupTitle);
                //(?<=\[core\])[\S\s]*?(?=\[|$)
                //alert('(\\[' + groupTitle + '\\])([\\S\\s]*?)(\\[|$)');
                var valExpression = new RegExp('(\\[' + groupTitle + '\\])([\\S\\s]*?)(\\[|$)', 'gi');
                var groupValue = valExpression.exec(hacpResponseAiccData)[2];

                //alert('groupValue: ' + groupValue);
                // There are three free-form groups:
                if ((groupTitle.toLowerCase() == 'core_lesson') || (groupTitle.toLowerCase() == 'core_vendor') || (groupTitle.toLowerCase() == 'comments')) {
                    // There are three free-form groups
                    _hacpReturnDataObject[groupTitle] = groupValue.replace(/[\n\r\t]/g,'');
                } else {
                    // The rest have a structure
                    _hacpReturnDataObject[groupTitle] = {};
                    var keywords = groupValue.match(/.*=/g);
                    var valueArray = groupValue.split(/.*=/m);
                    //alert('valueArray.length: ' + valueArray.length)
                    if (keywords) {
                        //alert(keywords.length);
                        for (n = 0; n < keywords.length; n++) {
                            var keyword = /(.*)=/.exec(keywords[n])[1].toLowerCase();
                            var value = valueArray[n + 1];
                            //alert(n + ' ' + groupTitle + ' ' + keyword + ': ' + value);
                            _hacpReturnDataObject[groupTitle][keyword] = value;
                            //alert(_hacpReturnDataObject[groupTitle][keyword])
                        }
                    }

                }
            }
            // Put the data where it belongs!
            _SetScormData('SetValue', 'cmi.learner_id', _hacpReturnDataObject.core.student_id);
            _SetScormData('SetValue', 'cmi.learner_name', _hacpReturnDataObject.core.student_name);
            _SetScormData('SetValue', 'cmi.location', _hacpReturnDataObject.core.lesson_location);
            _SetScormData('SetValue', 'cmi.credit', _hacpReturnDataObject.core.credit);
            var scoreRaw;
            var scoreMax;
            var scoreMin;
            var scorePercent
            if (_hacpReturnDataObject.core.score != '') {
                scoreArray = _hacpReturnDataObject.core.score.split(',');
                scoreRaw = scoreArray[0]
                if (scoreArray[1]) {
                    scoreMax = scoreArray[1];
                    if (scoreArray[2]) {
                        scoreMin = scoreArray[2];
                        scorePercent = Math.round(((scoreRaw - scoreMin) / (scoreMax - scoreMin)) * 100);
                    } else {
                        // there is no scoreMin...
                        scorePercent = Math.round((scoreRaw / scoreMax) * 100);
                    }
                } else {
                    // there is no scoreMax
                    scorePercent = scoreRaw;
                }

            }
            // completionStatus “completed”, “incomplete”, “not attempted”, “unknown”
            // successStatus “passed”, “failed”, “unknown”
            // lessonStatus "passed", "completed", "failed", "incomplete", "browsed", "not attempted"

            var successStatus = '';
            var completionStatus = '';
            switch (_hacpReturnDataObject.core.lesson_status.toLowerCase().substring(0, 1)) {
                case "p":
                    successStatus = 'passed';
                    break;
                case "f":
                    successStatus = 'failed';
                    break;
                case "c":
                    completionStatus = 'completed';
                    break;
                case "i":
                    completionStatus = 'incomplete';
                    break;
                case "b":
                    completionStatus = 'not attempted';
                    break;
                case "n":
                    completionStatus = 'not attempted';
                    break;
            }
            // If the success status is passed or failed, assume it is graded as an assessment and use those values, otherwise assume it is scored by completion:
            if (successStatus != '') {
                _SetScormData('SetValue', 'cmi.success_status', successStatus);
                if (successStatus == 'passed') {
                    _SetScormData('SetValue', 'cmi.completion_status', 'completed');
                }
                if (scoreRaw) {
                    _SetScormData('SetValue', 'cmi.score.raw', scoreRaw );
                }
                if (scoreMax) {
                    _SetScormData('SetValue', 'cmi.score.max', scoreMax);
                }
                if (scoreMin) {
                    _SetScormData('SetValue', 'cmi.score.min', scoreMin);
                }
                if (scorePercent) {
                    _SetScormData('SetValue', 'cmi.score.scaled', scorePercent);
                }

            } else if (completionStatus != '') {
                _SetScormData('SetValue', 'cmi.completion_status', completionStatus);
                if (scorePercent) {
                    _SetScormData('SetValue', 'cmi.progress_measure', scorePercent);
                }
            }
            var completionThreshold;
            try {
                completionThreshold = parseFloat(xml.ini.find('completionthreshold').text());
            } catch (e) {
                // 100% percent page consumption
                completionThreshold = (1).toString();
            }
            var scaledPassingScore;
            try {
                scaledPassingScore = parseFloat(xml.ini.find('scorethreshold').text());
                if (_hacpReturnDataObject.student_data.mastery_score) {
                    scaledPassingScore = _hacpReturnDataObject.student_data.mastery_score;
                }
            } catch (e) {
                // 80% assessment score mastery
                scaledPassingScore = .8 + '';
            }
            _SetScormData('SetValue', 'cmi.completion_threshold', completionThreshold);
            _SetScormData('SetValue', 'cmi.scaled_passing_score', scaledPassingScore);
            _SetScormData('SetValue', 'cmi.total_time', _hacpReturnDataObject.core.time);
            _SetScormData('SetValue', 'cmi.entry', _hacpReturnDataObject.core.lesson_status.split(',')[1]);
            if (_hacpReturnDataObject.core.mode) {
                _SetScormData('SetValue', 'cmi.mode', _hacpReturnDataObject.core.lesson_mode);
            }
            _SetScormData('SetValue', 'cmi.launch_data', _hacpReturnDataObject.core_vendor);
            _SetScormData('SetValue', 'cmi.suspend_data', _hacpReturnDataObject.core_lesson);
        }
        _InitializeEmulatorComplete(init, deferred);
    }
    var _showPostMessage = function () {
        _postMessageNode = document.createElement('IFRAME');
        _postMessageNode.id = 'postMessage';
        _postMessageNode.name = 'postMessage';
        _postMessageNode.style.width = '100%';
        _postMessageNode.style.height = '100%';
        _postMessageNode.style.left = '0px';
        _postMessageNode.style.top = '0px';
        _postMessageNode.style.zIndex = '1000';
        _postMessageNode.style.position = 'absolute';
        _postMessageNode.style.overflow = 'hidden';
        _postMessageNode.frameBorder = '0';
        //_postMessageNode.style.border = '5px solid #dddddd';
        _postMessageNode.src = sco.rootPath + 'sco_01/theme/aicc/postmessage.htm';
        document.body.insertBefore(_postMessageNode, document.getElementById('mainFrame'));
    }
    var _killPostMessage = function () {
        document.body.removeChild(_postMessageNode);
    }
    var _executePost = function (postData, parseFunction, init, deferred) {
        //alert('executePost');
        _postData = postData;
        var postFrame = document.createElement('iframe');
        postFrame.id = 'postFrame';
        postFrame.name = 'postFrame';
        postFrame.style.width = '100%';
        postFrame.style.height = '100%';
        postFrame.style.zIndex = '1001';
        postFrame.style.position = 'absolute';
        postFrame.style.visibility = 'hidden';
        postFrame.postFrameStatus = 'prepost';
        postFrame.submitAttempts = 0;
        postFrame.postData = postData;
        if (typeof (postFrame.onreadystatechange) == 'object') { // then onreadystatechange has been implemented in this browser
            postFrame.onreadystatechange = readystatechangeEvent;
        } else {
            postFrame.onload = loadEvent;
        }
        function readystatechangeEvent() {
            //alert('postFrame.onreadystatechange')
            var postFrameReadyState = this.readyState;
            var postFrameLocation = false;
            try {
                postFrameLocation = window.frames[this.name].location + '';
            } catch (e) {
                postFrameLocation = false;
            }
            //alert('readyState= ' + postFrameReadyState + ' location= ' + postFrameLocation);
            if (postFrameReadyState == 'complete') {
                if (this.postFrameStatus == 'prepost') {
                    var html = '';
                    html += '<body onload="document.forms[\'Form1\'].submit()"><form id="Form1" name="Form1" action="' + _aicc_url + '" method="post">';
                    var postArray = this.postData.split('&');
                    for (i = 0; i < postArray.length; i++) {
                        var kvPair = postArray[i].split('=');
                        html += '<input type="text" name="' + kvPair[0] + '" value="' + kvPair[1] + '">';
                    }
                    html += '<input type="submit"></form></body>';
                    this.postFrameStatus = 'posting';
                    window.frames[this.name].document.write(html);
                    window.frames[this.name].document.close();
                } else if ((postFrameLocation) && (postFrameLocation.indexOf(_aicc_url) != -1)) {
                    var returnText = '';
                    if (window.frames[this.name].document.body.innerText) {
                        returnText = window.frames[this.name].document.body.innerText;
                    } else if (window.frames[this.name].document.body.textContent) {
                        returnText = window.frames[this.name].document.body.textContent;
                    }
                    parseFunction(returnText, init, deferred);
                } else if (postFrameLocation && postFrameLocation.indexOf('navcancl.htm') != -1) {
                    //alert('postFrame 404')
                    var err = _throwError('postFrame 404');
                } else if (postFrameLocation && postFrameLocation.indexOf('blank') == -1) {
                    //alert(postFrameLocation)
                } else {
                    if (this.postFrameStatus == 'posting') {
                        //alert('posting to posted');
                        this.postFrameStatus = 'posted';
                        //if (!postFrameLocation) {
                        //    parseFunction('xdom');
                        //}
                    } else {
                        var err = _throwError('unknown http issue with postFrame');
                    }
                }
            }
        }
        function loadEvent() {
            //alert('postFrame.onload. this.postFrameStatus= ' + this.postFrameStatus)
            var postFrameLocation = false;
            try {
                postFrameLocation = window.frames[this.name].location + '';
            } catch (e) {
                postFrameLocation = false;
            }
            //alert('location= ' + postFrameLocation);
            if (this.postFrameStatus == 'prepost') {
                var html = '';
                html += '<form id="Form1" name="Form1" action="' + _aicc_url + '" method="post">';
                var postArray = this.postData.split('&');
                for (i = 0; i < postArray.length; i++) {
                    var kvPair = postArray[i].split('=');
                    html += '<input type="text" name="' + kvPair[0] + '" value="' + kvPair[1] + '">';
                }
                html += '<input type="submit"></form>';
                html += '<script type="text/javascript">';
                html += 'function submitForm(){';
                //html += ' alert(\'submitForm\');';
                html += ' if (document.forms[\'Form1\']){';
                html += '  document.forms[\'Form1\'].submit();';
                html += ' }else{';
                html += '  window.setTimeout("submitForm()",10);';
                html += ' }';
                html += '}';
                html += 'window.setTimeout("submitForm()",10);';
                html += '</script>';
                this.postFrameStatus = 'posting';
                window.frames[this.name].document.write(html);
                window.frames[this.name].document.close();
            } else if ((postFrameLocation) && (postFrameLocation.indexOf(_aicc_url) != -1)) {
                var returnText = '';
                if (window.frames[this.name].document.body.innerText) {
                    returnText = window.frames[this.name].document.body.innerText;
                } else if (window.frames[this.name].document.body.textContent) {
                    returnText = window.frames[this.name].document.body.textContent;
                }
                //alert('successful return. send to _parse')
                parseFunction(returnText);
            } else if (postFrameLocation && postFrameLocation.indexOf('navcancl.htm') != -1) {
                //alert('postFrame 404')
                var err = _throwError('postFrame 404');
            } else if (postFrameLocation && postFrameLocation.indexOf('blank') == -1) {
                //alert(postFrameLocation)
            } else if (this.postFrameStatus == 'posting') {
                //alert('posting to posted');
                this.postFrameStatus = 'posted';
            } else if (this.postFrameStatus == 'posted') {
                //alert('We're done.');
            } else {
                var err = _throwError('unknown http issue with postFrame');
            }
        }
        document.body.insertBefore(postFrame, document.getElementById('mainFrame'));
        _postFrames.push(postFrame);
    }
    var _destroyPostFrames = function () {
        // Removes the post frames used by the class
        for (var i = 0; i < _postFrames.length; i++)
            if (_postFrames[i].parentNode)
                _postFrames[i].parentNode.removeChild(_postFrames[i])
    }
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
        Initialize: function (element) {
            MessageLog.addMessage('LMS: Initialize', MessageLogLevel.Information);
            return _handle.Initialize('');
        },
        Terminate: function (element) {
            MessageLog.addMessage('LMS: Terminate', MessageLogLevel.Information);
            return _handle.Terminate('');
        },
        GetValue: function (element) {
            MessageLog.addMessage('LMS: GetValue("' + element + '")', MessageLogLevel.Information);
            return _handle.GetValue(element);
        },
        SetValue: function (element, value) {
            MessageLog.addMessage('LMS: SetValue("' + element + '", "' + value + '")', MessageLogLevel.Information);
            return _handle.SetValue(element, value);
        },
        Commit: function (element) {
            MessageLog.addMessage('LMS: Commit', MessageLogLevel.Information);
            return _handle.Commit('');
        },
        GetLastError: function (element) {
            MessageLog.addMessage('LMS: GetLastError', MessageLogLevel.Information);
            return _handle.GetLastError('');
        },
        GetErrorString: function (code) {
            MessageLog.addMessage('LMS: GetErrorString("' + code + '")', MessageLogLevel.Information);
            return _handle.GetErrorString(code);
        },
        GetDiagnostic: function (code) {
            MessageLog.addMessage('LMS: GetDiagnostic', MessageLogLevel.Information);
            return _handle.GetDiagnostic(code);
        },
        name: 'AiccApi',
        path: {
            children: '._children',
            count: '._count',
            version: 'cmi._version',
            commentsFromLearner: 'cmi.comments_from_learner',
            commentsFromLearnerNComment: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_learner.' + index + '.comment';
            },
            commentsFromLearnerNLocation: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_learner.' + index + '.location';
            },
            commentsFromLearnerNTimestamp: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_learner.' + index + '.timestamp';
            },
            commentsFromLms: 'cmi.comments_from_lms',
            commentsFromLmsNComment: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_lms.' + index + '.comment';
            },
            commentsFromLmsNLocation: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_lms.' + index + '.location';
            },
            commentsFromLmsNTimestamp: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the comment.</param>
                return 'cmi.comments_from_lms.' + index + '.timestamp';
            },
            completionStatus: 'cmi.completion_status',
            completionThreshold: 'cmi.completion_threshold',
            credit: 'cmi.credit',
            entry: 'cmi.entry',
            exit: 'cmi.exit',
            interactions: 'cmi.interactions',
            interactionsNId: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.id';
            },
            interactionsNType: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.type';
            },
            interactionsNTimestamp: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.timestamp';
            },
            interactionsNWeighting: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.weighting';
            },
            interactionsNLearnerResponse: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.learner_response';
            },
            interactionsNResult: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.result';
            },
            interactionsNLatency: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.latency';
            },
            interactionsNDescription: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.description';
            },
            interactionsNObjectives: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.objectives';
            },
            interactionsNObjectivesMId: function (index1, index2) {
                /// <param name="index1" type="Number">Index (0-based) of the interaction.</param>
                /// <param name="index2" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.interactions.' + index1 + '.objectives.' + index2 + '.id';
            },
            interactionsNCorrectResponses: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the interaction.</param>
                return 'cmi.interactions.' + index + '.correct_responses';
            },
            interactionsNCorrectResponsesMPattern: function (index1, index2) {
                /// <param name="index1" type="Number">Index (0-based) of the interaction.</param>
                /// <param name="index2" type="Number">Index (0-based) of the pattern.</param>
                return 'cmi.interactions.' + index1 + '.correct_responses.' + index2 + '.pattern';
            },
            launchData: 'cmi.launch_data',
            learnerId: 'cmi.learner_id',
            learnerName: 'cmi.learner_name',
            learnerPreference: 'cmi.learner_preference',
            learnerPreferenceAudioLevel: 'cmi.learner_preference.audio_level',
            learnerPreferenceLanguage: 'cmi.learner_preference.language',
            learnerPreferenceDeliverySpeed: 'cmi.learner_preference.delivery_speed',
            learnerPreferenceAudioCaptioning: 'cmi.learner_preference.audio_captioning',
            location: 'cmi.location',
            maximumTimeAllowed: 'cmi.max_time_allowed',
            mode: 'cmi.mode',
            objectives: 'cmi.objectives',
            objectivesNId: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.id';
            },
            objectivesNScore: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.score';
            },
            objectivesNScoreScaled: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.score.scaled';
            },
            objectivesNScoreRaw: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.score.raw';
            },
            objectivesNScoreMin: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.score.min';
            },
            objectivesNScoreMax: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.score.max';
            },
            objectivesNSuccessStatus: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.success_status';
            },
            objectivesNCompletionStatus: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.completion_status';
            },
            objectivesNProgressMeasure: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.progress_measure';
            },
            objectivesNDescription: function (index) {
                /// <param name="index" type="Number">Index (0-based) of the objective.</param>
                return 'cmi.objectives.' + index + '.description';
            },
            progressMeasure: 'cmi.progress_measure',
            scaledPassingScore: 'cmi.scaled_passing_score',
            score: 'cmi.score',
            scoreScaled: 'cmi.score.scaled',
            scoreRaw: 'cmi.score.raw',
            scoreMax: 'cmi.score.max',
            scoreMin: 'cmi.score.min',
            sessionTime: 'cmi.session_time',
            successStatus: 'cmi.success_status',
            suspendData: 'cmi.suspend_data',
            timeLimitAction: 'cmi.time_limit_action',
            totalTime: 'cmi.total_time',
            lessonStatus: ''
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
    return function () {
        _aiccUrl = decodeURIComponent((new RegExp('[?|&]AICC_URL=' + '([^&;]+?)(&|#|;|$)', 'i').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
        _aiccSid = decodeURIComponent((new RegExp('[?|&]AICC_SID=' + '([^&;]+?)(&|#|;|$)', 'i').exec(location.search) || [, ''])[1].replace(/\+/g, '%20')) || null;
        _defaultopener = decodeURIComponent((new RegExp('[?|&]defaultopener=' + '([^&;]+?)(&|#|;|$)', 'i').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
        _xdomain = false;
        if (_aiccUrl){
            _handle = win.API;
            if (/:\/\/([^\/]+)/.exec(_aiccUrl)) {
                xdomain = (/:\/\/([^\/]+)/.exec(window.location.href)[1]) != (/:\/\/([^\/]+)/.exec(_aiccUrl)[1]);
            }
            MessageLog.addMessage('Using AICC HAPC API.', MessageLogLevel.Information);
            return _api;
        }else{
            MessageLog.addMessage('Error finding AICC_URL URL parameter.', MessageLogLevel.Warning);
            return null;
        }
    };
};});
