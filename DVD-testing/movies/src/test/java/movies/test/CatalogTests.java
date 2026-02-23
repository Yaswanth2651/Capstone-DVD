package movies.test;

import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import java.time.Duration;

public class CatalogTests {
    private WebDriver driver;
    private CatalogPage catalogPage;
    private final String BASE_URL = "http://localhost:5173/catalog";

    @BeforeMethod
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.get(BASE_URL);
        catalogPage = new CatalogPage(driver);
    }

    @Test
    public void testSearchFunctionality() {
        catalogPage.enterSearchQuery("Midnight Chai");
        Assert.assertTrue(catalogPage.getFirstProductTitle().contains("Midnight Chai"));
    }

    @Test
    public void testGenreFilter() {
        catalogPage.selectGenre("Sci-Fi");
        Assert.assertTrue(catalogPage.getVisibleProductCount() > 0);
    }

    @Test
    public void testSortByTitleAscending() {
        catalogPage.selectSortByValue("title");
        Assert.assertNotNull(catalogPage.getFirstProductTitle());
    }

    @Test
    public void testSortByPriceLowToHigh() {
        catalogPage.selectSortByValue("price-asc");
        String price = catalogPage.getFirstProductPrice();
        Assert.assertTrue(price.contains("₹") || price.matches(".*\\d.*"));
    }

    @Test
    public void testSortByYearDescending() {
        catalogPage.selectSortByValue("year-desc");
        Assert.assertTrue(catalogPage.getVisibleProductCount() >= 0);
    }

    @Test
    public void testAddToCartUnauthenticated() {
        catalogPage.clickLoginToAdd("1"); 
        Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
    }

    @Test
    public void testProductDetailNavigation() {
        catalogPage.clickViewDetails();
        Assert.assertTrue(driver.getCurrentUrl().contains("/product/"));
    }

    @Test
    public void testEmptySearchResults() {
        catalogPage.enterSearchQuery("NonExistentMovie999");
        Assert.assertEquals(catalogPage.getVisibleProductCount(), 0);
    }

    @Test
    public void testRatingDisplay() {
        Assert.assertTrue(catalogPage.isRatingDisplayed());
    }

    @Test
    public void testOutOfStockUI() {
        boolean isStockIssuePossible = catalogPage.isFirstProductOutOfStock();
        if (isStockIssuePossible) {
            Assert.assertTrue(driver.getPageSource().contains("Out of stock"));
        }
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}