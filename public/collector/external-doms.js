
if (itemCollectorExternal === undefined) {
    var itemCollectorExternal = (function(){

        function setupOcs(){
            let currentUrl = window.location.href;
            if(currentUrl.includes("shop-by-brand")){
                brandsSetup();
            }
        }

        function brandsSetup(){

            let brandsContent = document.getElementById("shopify-section-en-brands")
            let brandsCount = brandsContent.querySelector(".js-brands-search-count");
            brandsCount.id = "collector_brands_count"

            let brandsContainer = brandsContent.querySelector(".brands.container");

            let brandsResults = brandsContainer.querySelector(".brands__results");
            brandsResults.id = "collector_brands_results";
            let buttonContent = document.createElement("div");
            buttonContent.classList.add("ocs-button-content")
            let button = document.createElement("button");
            button.innerText = "Import Brands";
            button.addEventListener("click", importBrands);


            buttonContent.appendChild(button);
            brandsContainer.insertBefore(buttonContent, brandsResults);
        }

        function importBrands(event){
            event.target.disabled = true;
            
            let brandsCount = document
                .getElementById("collector_brands_count").innerText;
            let brandsResults =  document
                .getElementById("collector_brands_results");

            let brandsLinks = brandsResults.querySelectorAll(".letter__result a");

            let brands = {
                'BrandsList': []
            };
            brandsLinks.forEach(brandLink => {
                let link = brandLink.href;
                brands['BrandsList'].push({
                    "BrandId": link.split("/").pop(),
                    "BrandName": brandLink.innerHTML,
                    'Link': link,
                });
            });

            chrome.runtime.sendMessage(
                {
                    action: "import",
                    resource: "brands",
                    data: brands
                },
                function(response) {
                    console.log(response);
            });
        }

        return {
            setupOcs: setupOcs,
        };
    })();
}