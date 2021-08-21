
if (itemCollectorExternal === undefined) { // external item collector not defined
    var itemCollectorExternal = (function(){ // create external item collector

        // ocs page setup function
        // used to setup import actions for each type of page on ocs
        function setupOcs(){
            // check url to determine import type
            let currentUrl = window.location.href;
            if(currentUrl.includes("shop-by-brand")){ // brands
                brandsSetup();
            }else if(currentUrl.includes("/products/")){ // products
                productSetup();
            }

            return true
        }

        // brands page setup
        // used to setup the brands page for importing all brands
        function brandsSetup(){

            // find the brands count DOM and place and Id for later reference
            let brandsContent = document.getElementById("shopify-section-en-brands")
            let brandsCount = brandsContent.querySelector(".js-brands-search-count");
            brandsCount.id = "collector_brands_count"

            // find the DOM with all the brands listed in them
            let brandsContainer = brandsContent.querySelector(".brands.container");

            // add an Id to the brands list
            let brandsResults = brandsContainer.querySelector(".brands__results");
            brandsResults.id = "collector_brands_results";

            // create page button for importing the items
            let buttonContent = document.createElement("div");
            buttonContent.classList.add("ocs-button-content")
            let button = document.createElement("button");
            button.innerText = "Import Brands";
            button.addEventListener("click", importBrands); // add import function to button

            // add button DOM to page
            buttonContent.appendChild(button);
            brandsContainer.insertBefore(buttonContent, brandsResults);
        }

        // product page setup
        // used to setup product page for importing items
        function productSetup(){
            // fetch existng productinfo
            chrome.runtime.sendMessage( // send message to chrome background.js to run the POST request
                // message data
                {
                    action: "get", // determines the message action
                    resource: "products", // determines the resource
                    data: getProductData() // API data
                },
                // callback function
                function(response){
                    if(response.status === 404){ // product not found
                        importProduct()
                    }
                });
        }

        // import brands function
        // used to import a list of brands from ocs brands page
        function importBrands(event){
            event.target.disabled = true; // disable import button to prevent double import
            
            // get brand info DOM references
            let brandsCount = document
                .getElementById("collector_brands_count").innerText; // brands count
            let brandsResults =  document
                .getElementById("collector_brands_results"); // brands list DOM

            // get all brands from brands list DOM
            let brandsLinks = brandsResults.querySelectorAll(".letter__result a");

            // place each brand DOM element into a list for API POST
            let brands = {
                'Brands': []
            };
            brandsLinks.forEach(brandLink => {
                let link = brandLink.href;
                brands['Brands'].push({
                    "BrandId": link.split("/").pop(),
                    "BrandName": brandLink.innerHTML,
                    'Link': link,
                });
            });

            // send message to chrome background.js to run the POST request
            chrome.runtime.sendMessage(
                // message data
                {
                    action: "import", // determines the message action
                    resource: "brands", // determines the resource
                    data: brands // API data
                },
                // callback function
                function(response) { 
            });
        }

        // import products function
        // used to import a single product from ocs product page
        function importProduct(){
            // send message to chrome background.js to run the POST request
            chrome.runtime.sendMessage(
                // message data
                {
                    action: "import", // determines the message action
                    resource: "products", // determines the resource
                    data: getProductData() // API data
                },
                // callback function
                (response) => {
            });
        }

        // get all product doms and return their data
        // used turn product DOMS into a usable object
        const getProductData = () => {
            // get product info
            let productTitle = document.querySelector(".product__title")
                .innerText.trim(); // title

            // category/type
            let productTypeInfo = document.querySelector(".breadcrumbs")
                .querySelectorAll("span");
            let productCategory = productTypeInfo[0].innerText; // category
            let productType = productTypeInfo[1].innerText; // type

             // description
            let productInfoDom = document
                .querySelector(".product__description");
            let description = productInfoDom.querySelector(".content").innerText;  

            // properties DOM
            let productProps = document
                .getElementById("product__properties-table")
                .querySelectorAll("tr");

            // take propeties DOM and turn it into usable data
            let productInfo = {}; // list of properties
            productProps.forEach(element => {
                let content = element.querySelectorAll("td"); // each list element

                // trim values
                let propName = content[0].textContent.trim()
                    .replace(" ", '').toLowerCase();
                let propValue = content[1].textContent.trim();

                productInfo[[propName]] = propValue; // add to properties list
            });

            // return product data
            return {
                brandName: productInfo.brand, // each product has a brand property
                productName: productTitle,
                category: productCategory,
                type: productType,
                description: description,
                link: window.location.href
            }
        }

        // only return function to be public
        return {
            setupOcs: setupOcs, // setups ocs page for importing
        };
    })();
}
