
// message listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(request.action == "import"){
            importResource(request.resource, request.data, sendResponse);
        }
        return true;
    }
);


async function importResource(resourceType, data, sendResponse){
    let response;
    if(resourceType == "brands"){
        response = await importBrandsList(data)
    }else if (resourceType == "products"){
        response = await importProduct(data)
    }

    // return results
    sendResponse({
        status: response.status,
        responseText: response.responseText,
    });
}


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
