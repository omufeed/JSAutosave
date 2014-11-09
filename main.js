/*
 *  Autosave v1.0 - by Omid Mufeed
 *  Examples/Docs: www.omidmufeed.com
 *  Date: 01 April 2014
 *  
 *  Open Source
 *  Reference: typewatch code piece by Christian C. Salvadó (http://codingspot.com/)
 */
 
var typewatch = (function () {
    var timer = 0;
    return function (callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
})();
$(document).ready(function () {
    Initialise();
});

//Initialises the autosave in the input containers
function Initialise() {
 $(".InputContainer").each(function () {
        var objInputContainer = $(this);

        //Initilise the word count
        UpdateWordCount(objInputContainer);

        var timer = $.timer(function () {
            if (timer.isActive) {
                timer.stop();
                $("#IsActive").html(timer.isActive);
            }
        });

        //Save every 20 seconds
        timer.set({ time: 20000, autostart: false });

        //Activate on keyup
        objInputContainer.find(".InputBody").keyup(function () {
            if (!timer.isActive) {
                //Add some delay before starting to save again. This would help the save trigger very often.
                setTimeout(function () {
                    objInputContainer.find(".InputState_Saved").fadeOut(10);
                    timer.play();
                    $("#IsActive").html(timer.isActive);
                }, 500);
            }

            typewatch(function () {
                //executed only 2s after the last keyup event.
                if (timer.isActive) {
                    timer.stop();
                    $("#IsActive").html(timer.isActive);
                    Save(objInputContainer);
                }
            }, 2000);

            //Update word count on keyup
            UpdateWordCount(objInputContainer);
        });

        //Deactivate
        objInputContainer.find(".InputBody").blur(function () {
            timer.stop();
            $("#IsActive").html(timer.isActive);
        });

        //Save on change
        objInputContainer.find(".InputBody").change(function () {
            if (timer.isActive) {
                timer.stop();
                $("#IsActive").html(timer.isActive);
                Save(objInputContainer);
            }
        });

        //Execute autosave before leaving the page
        $(window).unload(function () {
            timer.stop();
            Save(objInputContainer);
        });
    });
}

// The magic happens here...
function Save(objInputContainer) {
    var blnReturn = false;
    if (objInputContainer) {
        Saving(objInputContainer);

        //Save the text here
        var fnSave = new Function("return " + objInputContainer.find("#SaveFunction").val());
        //If the save fails, try it 3 times.
        var intAttemptCount = 0;
        while (!blnReturn && intAttemptCount < 3)
        {
            if (fnSave()) blnReturn = true;
            else intAttemptCount++;
        }

        if (blnReturn)
		{
			UpdateLog(objInputContainer);
			
            Saved(objInputContainer);
		}
        else {
            Error(objInputContainer);
        }
    }
    return blnReturn;
}
function UpdateLog(objInputContainer){
	//Update the log
	var dtmSaved = new Date();
	$("#AutosaveLog").append("<p>" + objInputContainer.attr("id") + " saved at " + dtmSaved.getHours() + ":" + dtmSaved.getMinutes() + ":" + dtmSaved.getSeconds() + "<br />");
	$("#AutosaveLog").append(objInputContainer.find(".InputBody").val() + "</p><hr />");
}


var regex = /\s+/gi;
function UpdateWordCount(objInputContainer) {
	objInputContainer.find(".WordCount").html(objInputContainer.find(".InputBody").val().length > 0 ? objInputContainer.find(".InputBody").val().trim().replace(regex, ' ').split(' ').length : 0);
}

function Saving(objInputContainer) {
    objInputContainer.find(".InputState_Error").hide();
    objInputContainer.find(".InputState_Saved").hide();    
    objInputContainer.find(".InputState_Saving").fadeIn(5).delay(1000);
}
function Saved(objInputContainer) {
    objInputContainer.find(".InputState_Error").hide();
    objInputContainer.find(".InputState_Saving").fadeOut(5);
    objInputContainer.find(".InputState_Saved").delay(2000).fadeIn(5);
}
function Error(objInputContainer) {
    objInputContainer.find(".InputState_Saved").hide();
    objInputContainer.find(".InputState_Saving").fadeOut(5);
    objInputContainer.find(".InputState_Error").delay(2000).fadeIn(5);
}

function SaveTitle(){
	//TODO make you ajax calls here
	
	//Return 1 if the save operations is successful and 0 if failed.
	return 1;
}
function SaveBody()
{
	//TODO make you ajax calls here
	
	//Return 1 if the save operations is successful and 0 if failed.
	return 1;
}