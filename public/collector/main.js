
if(itemCollector === undefined) { // main function not defined

    // create main controller
    // used to manage all actions on page starup
    var itemCollector = (function (){

        // function that runs every time the page loads
        // used to setup and buttons and query for any data to display
        function onPageLoad(){
            // determine page setup function
            let setupFunction; 

            // check url to determine setup function
            let currentUrl = window.location.href;
            if(currentUrl.includes('ocs.ca')){ // check for Ontario Cannabis Store
                setupFunction = ocsSetup; // set starup fuction
            }
            else { // doesnt setups for websites 
                return
            }

            // run setup function
            let isSetup = setupFunction(); // returns if it was able to setup the page or not
            if(!isSetup){ // failed to setup the page
                // delay time to give the page more time to load
                setTimeout(function(){
                    setupFunction(); // run the function one last time
                }, 2500);
            }
        }

        // ocs setup page setup function
        // used to setup ocs page for item actions
        function ocsSetup(){
            return itemCollectorExternal.setupOcs(); // return setup function
        }

        return {
            onPageLoad: onPageLoad,
        };
    })();
}

// run item collector starup
// delay time to give the page time to load 
setTimeout(function(){
    itemCollector.onPageLoad(); // run everytime page loads
}, 2000);
