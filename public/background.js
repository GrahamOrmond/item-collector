
// message listener
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // check the action to determine the function to run
        // all functions take in resource, data and responseCallback
        let results;
        if(request.action == "import"){ // import action
            results = importResource(request.resource, request.data, sendResponse);
        }else if (request.action == "get") { // get action
            results = getResource(request.resource, request.data, sendResponse);
        }
        return true // return true to indicate sendResponse as async callback function
    }
);

// import resource function
// used to import resources to an API
async function importResource(resourceType, data, sendResponse){
    // determine the resource to import
    let url; 
    if(resourceType == "brands"){ // import brands list
        url = `/api/brands/list`;
    }else if (resourceType == "products"){ // import products
        url = `/api/products`;
    }

    // import resource and return results
    const response = await client.post(url, data)
    sendResponse({
        status: response.status,
        responseText: response.responseText,
    });
}

// import resource function
// used to import resources to an API
async function getResource(resourceType, data, sendResponse){
    // determine the resource to import
    let url; 
    if(resourceType == "brands"){ // import brands list
        url = `/api/brands/count`;
    }else if (resourceType == "products"){ // import products
        url = `/api/products/existing/${data.brandName}/${data.productName}`;
    }

    const results = await client.get(url)
    sendResponse(results);
}

// http client to help making request to an API
// used to simplify sending request to an API
async function client(endpoint, method, body) {
    // make the request to create the resource
    return new Promise(function (resolve, reject) {
        // url and params setup
        const url = `https://localhost:44303${endpoint}`

        // create request
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader("Content-type", "application/json");
        
        // call back for successfull request
        xhr.onloadend = function () {
            resolve({
                status: xhr.status,
                responseText: xhr.responseText,
            });
        };
        // error call back
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };

        if(method === "POST"){
            xhr.send(JSON.stringify(body)); // send request
        }else{
            xhr.send(); // send request no data
        }
    }).catch(err => console.log(err));
  }
  
  client.get = async function (url, customConfig = {}) {
    let results = await client(url, method = 'GET');
    return results;
  }
  
  client.post = async function (url, body) {
    return await client(url, method = 'POST', body)
  }