
if(itemCollector === undefined) {

    function onPageLoad(){
        let setupFunction;
        let currentUrl = window.location.href;
        if(currentUrl.includes('ocs.ca')){
            setupFunction = ocsSetup;
        }

        let isSetup = setupFunction();
        if(isSetup == false){
            setTimeout(function(){
                setupFunction();
            }, 2500);
        }
    }

    function ocsSetup(){
        return itemCollectorExternal.setupOcs();
    }


    var itemCollector = (function (){

        return {
            onPageLoad: onPageLoad,
        };
    })();
}

setTimeout(function(){
    itemCollector.onPageLoad(); // run everytime page loads
}, 2000);
