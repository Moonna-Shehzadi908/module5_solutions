(function (global) {
  var dc = {};

  var homeHtmlUrl = "snippets/home-snippet.html";
  var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

  function insertHtml(selector, html) {
    document.querySelector(selector).innerHTML = html;
  }

  function insertProperty(string, propName, propValue) {
    var propToReplace = "{{" + propName + "}}";
    return string.replace(new RegExp(propToReplace, "g"), propValue);
  }

  function chooseRandomCategory(categories) {
    var randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }

  dc.loadMenuItems = function (shortName) {
    var categoryItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/" + shortName + ".json";

    fetch(categoryItemsUrl)
      .then(response => response.json())
      .then(data => {
        var titleHtml = "<h2 class='title'>" + data.category.name + " Menu</h2><div class='menu-items'>";
        var itemsHtml = "";

        data.menu_items.forEach(item => {
          itemsHtml += `
            <div class='menu-item'>
              <h3>${item.name} (${item.short_name})</h3>
              <p>${item.description}</p>
            </div>
          `;
        });

        var finalHtml = titleHtml + itemsHtml + "</div>";
        insertHtml("#main-content", finalHtml);
      });
  };

  document.addEventListener("DOMContentLoaded", function () {
    fetch(allCategoriesUrl)
      .then(response => response.json())
      .then(categories => {
        var randomCategory = chooseRandomCategory(categories);

        fetch(homeHtmlUrl)
          .then(response => response.text())
          .then(homeHtml => {
            var finalHtml = insertProperty(homeHtml, "randomCategoryShortName", randomCategory.short_name);
            insertHtml("#main-content", finalHtml);
          });
      });
  });

  global.$dc = dc;
})(window);
