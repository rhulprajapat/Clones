const searchBox = document.querySelector('.searchBox');
const searchBtn = document.querySelector('.searchBtn');
const prodContainer = document.querySelector('.prod-container');
const prodDetailsContent = document.querySelector('.prod-details-content')
const closeBtn = document.querySelector('.close-btn')


// Get Fashion API Data
const fetchFashionData = async (query) => {
    prodContainer.innerHTML = "<h2>Searching...</h2>";

    
        const data = await fetch(`https://dummyjson.com/products/search?q=${query}`);
        const response = await data.json();

        if (response.products.length === 0) {
            prodContainer.innerHTML = "<h2>No results found. Please try again.</h2>";
            return;
        }

        //clear the container before oppending new result
        prodContainer.innerHTML = "";

        response.products.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('prod');
            itemDiv.innerHTML = `
            <img src="${item.thumbnail}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p>Price: ₹${item.price}</p>
            <p>Brand: ${item.brand}</p>
            <p>Category: ${item.category}</p>
            `;

            const button = document.createElement('button')
            button.textContent = "View Description"
            //add button to the product div
            itemDiv.appendChild(button) 
            
            //click event listener to open popup
            button.addEventListener('click', () => {
                openProdPopup(item)
            });

            prodContainer.appendChild(itemDiv);
        });
    
    
};

//open the popup 
const openProdPopup = (item) => {
    prodDetailsContent.innerHTML = `
    <h3>Description:</h3>
    <p class="prodInstruction">${item.description}</p>`
    prodDetailsContent.parentElement.style.display = "block"
}

//close the popup
closeBtn.addEventListener('click', () => {
    prodDetailsContent.parentElement.style.display = "none"
})

//search button click event
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        prodContainer.innerHTML = "<h2>Please enter a search term.</h2>";
        return;
    }
    fetchFashionData(searchInput);
});
