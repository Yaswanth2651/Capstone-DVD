package movies.test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;
import java.util.List;

public class CatalogPage {
    private WebDriver driver;

    private By searchInput = By.cssSelector("input[data-testid='catalog-search']");
    private By genreSelect = By.cssSelector("select[data-testid='catalog-genre']");
    private By sortSelect = By.cssSelector("select[data-testid='catalog-sort']");
    private By productCards = By.className("card");
    private By productTitles = By.className("title");
    private By prices = By.className("price");
    private By toastMessage = By.className("toast");
    private By viewLinks = By.linkText("View");
    private By ratingContainer = By.className("rating");
    private By outOfStockPill = By.className("pillBad");

    public CatalogPage(WebDriver driver) {
        this.driver = driver;
    }

    public void enterSearchQuery(String text) {
        WebElement input = driver.findElement(searchInput);
        input.clear();
        input.sendKeys(text);
    }

    public void selectGenre(String genreName) {
        new Select(driver.findElement(genreSelect)).selectByVisibleText(genreName);
    }

    public void selectSortByValue(String value) {
        new Select(driver.findElement(sortSelect)).selectByValue(value);
    }

    public int getVisibleProductCount() {
        return driver.findElements(productCards).size();
    }

    public String getFirstProductTitle() {
        return driver.findElement(productTitles).getText();
    }

    public String getFirstProductPrice() {
        return driver.findElement(prices).getText();
    }

    public void clickAddToCart(String productId) {
        driver.findElement(By.cssSelector("[data-testid='add-to-cart-" + productId + "']")).click();
    }

    public void clickLoginToAdd(String productId) {
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
    }

    public void clickViewDetails() {
        driver.findElement(viewLinks).click();
    }

    public String getToastText() {
        return driver.findElement(toastMessage).getText();
    }

    public boolean isRatingDisplayed() {
        return driver.findElement(ratingContainer).isDisplayed();
    }

    public boolean isFirstProductOutOfStock() {
        List<WebElement> pills = driver.findElements(outOfStockPill);
        return !pills.isEmpty() && pills.get(0).getText().contains("Out of stock");
    }
}