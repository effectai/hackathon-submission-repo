const templateContent = `

    <style>
        p{
                font-size: 13px;
                color: gray;
                font-family: Arial;
                opacity: 0.7;
        }
        label{
                font-family: Arial;
                font-size: 15px;
                line-height: 22px;
                color: #464646;
        }
        button{
            opacity:0;
        }
        .task-content{
            border-left: 6px solid #e3e3e3;
            padding: 15px;
            padding-left: 25px;
            background: #f5f5f5;
        }
    </style>
    <div class='task-content'>
        <label id='content'>` + '${content}' + ` </label>
    </div>
    <p> Please check instructions for the voice command </p>

    <input type='hidden' name='answer' id='answer'/>
    <button id="submit" type="submit">Submit</button> 

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script>

        if('webkitSpeechRecognition' in window) {

       
            var speechRecognizer = new webkitSpeechRecognition();
            speechRecognizer.continuous = true;
            speechRecognizer.interimResults = true;
            speechRecognizer.lang = 'en-US';
            speechRecognizer.start();

            speechRecognizer.onresult = function(event) {
                var interimTranscripts = '';
                for(var i = event.resultIndex; i < event.results.length; i++){
                    var transcript = event.results[i][0].transcript;
                    transcript = $.trim(transcript).toLowerCase();		
                    switch(transcript){
                        
                        case "repeat" : 
                        case "begin" : 
                            var message = new SpeechSynthesisUtterance($("#content").text());
                            var voices = speechSynthesis.getVoices();
                            speechSynthesis.speak(message);
                            return true;
                            break;

                        case "positive" : 
                            $("#answer").val('positive');
                            $("#submit").click();
                            return true;
                            break;

                        case "negative" : 
                            $("#answer").val('negative');
                            $("#submit").click();
                            return true;
                            break;

                        case "neutral" : 
                            $("#answer").val('neutral');
                            $("#submit").click();
                            return true;
                            break;
                    }
                    
                }
            };
            speechRecognizer.onerror = function (event) {};
        }
        else {
            alert("Your browser does not support this feature, please use latest Chrome browser");            
        }	

    </script>
             
`;