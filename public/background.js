
// message listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // check the action to determine the function to run
        // all functions take in resource, data and responseCallback
        if(request.action == "import"){ // import action
            importResource(request.resource, request.data, sendResponse);
        }
        return true;
    }
);

// import resource function
// used to import resources to an API
async function importResource(resourceType, data, sendResponse){
    // determine the resource to import
    let response; 
    if(resourceType == "brands"){ // import brands list
        response = await importBrandsList(data)
    }else if (resourceType == "products"){ // import products
        response = await importProduct(data) // import single product
    }

    // return results
    sendResponse({
        status: response.status,
        responseText: response.responseText,
    });
}

// import brands list function
// used to send brands data to and API to import
async function importBrandsList(resourceData){
    // make the request to create the resource
    return new Promise(function (resolve, reject) {
        // url and params setup
        const url = `https://localhost:44303/api/brands/list`

        // create request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-type", "application/json");
        
        // call back for successfull request
        xhr.onloadend = function () {
            resolve(xhr);
        };
        // error call back
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(resourceData)); // send request
    }).catch(err => console.log(err));
}

// import single product function
// used to send single product data to an API to import
async function importProduct(resourceData){
    // make the request to create the resource
    return new Promise(function (resolve, reject) {
        // url and params setup
        const url = `https://localhost:44303/api/products`

        // create request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url);
        xhr.setRequestHeader("Content-type", "application/json");
        
        // call back for successfull request
        xhr.onloadend = function () {
            resolve(xhr);
        };
        // error call back
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(JSON.stringify(resourceData)); // send request
    }).catch(err => console.log(err));
}
