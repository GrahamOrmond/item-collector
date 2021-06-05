
if (itemCollectorExternal === undefined) {
    var itemCollectorExternal = (function(){

        function setupOcs(){
            let currentUrl = window.location.href;
            if(currentUrl.includes("shop-by-brand")){
                brandsSetup();
            }else if(currentUrl.includes("/products/")){
                productSetup();
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

        function productSetup(){
            let mainContent = document.getElementById("main");
            let menuButton = document.createElement("div");
            menuButton.classList.add("menu-display")

            let button = document.createElement("button");
            button.classList.add("menu-button")
            button.addEventListener("click", importProduct);
            menuButton.appendChild(button);
            mainContent.appendChild(menuButton);
        }


        function importBrands(event){
            event.target.disabled = true;
            
            let brandsCount = document
                .getElementById("collector_brands_count").innerText;
            let brandsResults =  document
                .getElementById("collector_brands_results");

            let brandsLinks = brandsResults.querySelectorAll(".letter__result a");

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

            chrome.runtime.sendMessage(
                {
                    action: "import",
                    resource: "brands",
                    data: brands
                },
                function(response) {
                    event.target.disabled = false;
                    console.log(response);
            });
        }

        function importProduct(){
            let productTitle = document.querySelector(".product__title")
                .innerText.trim();

            let productTypeInfo = document.querySelector(".breadcrumbs")
                .querySelectorAll("span");

            let productCategory = productTypeInfo[0].innerText;
            let productType = productTypeInfo[1].innerText;

            let productInfoDom = document
                .querySelector(".product__description");

            let description = productInfoDom.querySelector(".content").innerText;

            let productProps = document
                .getElementById("product__properties-table")
                .querySelectorAll("tr");

            let productInfo = {};
            productProps.forEach(element => {
                let content = element.querySelectorAll("td");

                let propName = content[0].textContent.trim()
                    .replace(" ", '').toLowerCase();
                let propValue = content[1].textContent.trim();

                productInfo[[propName]] = propValue;
            });
            console.log(productInfo);
            let importData = {
                brandName: productInfo.brand,
                productName: productTitle,
                category: productCategory,
                type: productType,
                description: description,
                link: window.location.href
            }

            chrome.runtime.sendMessage(
                {
                    action: "import",
                    resource: "products",
                    data: importData
                },
                function(response) {
                    event.target.disabled = false;
                    console.log(response);
            });
        }

        return {
            setupOcs: setupOcs,
        };
    })();
}
