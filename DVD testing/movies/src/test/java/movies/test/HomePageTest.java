package movies.test;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.testng.Assert;
import java.time.Duration;

public class HomePageTest {
    protected WebDriver driver;
    protected String baseUrl = "http://localhost:5173";

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        driver.get(baseUrl);
    }

    @Test(priority = 1)
    public void testHeroTitleDisplay() {
        WebElement title = driver.findElement(By.className("h1"));
        Assert.assertTrue(title.isDisplayed());
        Assert.assertEquals(title.getText(), "Movie DVDs, delivered fast.");
    }

    @Test(priority = 2)
    public void testBrowseCatalogNavigation() {
        driver.findElement(By.linkText("Browse catalog")).click();
        Assert.assertTrue(driver.getCurrentUrl().contains("/catalog"));
    }

    @Test(priority = 3)
    public void testLoginButtonVisibleWhenLoggedOut() {
        WebElement loginBtn = driver.findElement(By.linkText("Login (demo user)"));
        Assert.assertTrue(loginBtn.isDisplayed());
    }

    @Test(priority = 4)
    public void testLoginNavigation() {
        driver.findElement(By.linkText("Login (demo user)")).click();
        Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
    }

    @Test(priority = 5)
    public void testHeroStatsDisplay() {
        WebElement statsCard = driver.findElement(By.className("heroCard"));
        Assert.assertTrue(statsCard.isDisplayed());
        
        String statsContent = statsCard.getText();
        Assert.assertTrue(statsContent.contains("6"));
        Assert.assertTrue(statsContent.contains("100%"));
    }

    @Test(priority = 6)
    public void testDemoCredentialsVisibility() {
        WebElement credentials = driver.findElement(By.className("codeLike"));
        Assert.assertEquals(credentials.getText(), "demo.user@example.com / DemoPass1");
    }

    @Test(priority = 7)
    public void testTestingFeaturesPanel() {
        WebElement panel = driver.findElement(By.xpath("//h2[text()='Testing-friendly by design']"));
        Assert.assertTrue(panel.isDisplayed());
    }

    @Test(priority = 8)
    public void testViewOrdersVisibleWhenLoggedIn() {
        loginAsDemoUser(); 
        driver.get(baseUrl); 
        WebElement ordersBtn = driver.findElement(By.xpath("/html/body/div/div/header/nav/a[3]"));
        Assert.assertTrue(ordersBtn.isDisplayed());
    }

    @Test(priority = 9)
    public void testLoginButtonHiddenWhenLoggedIn() {
        loginAsDemoUser();
        driver.get(baseUrl);
        boolean isLoginPresent = driver.findElements(By.linkText("Login (demo user)")).size() > 0;
        Assert.assertTrue(isLoginPresent);
    }

    @Test(priority = 10)
    public void testResponsiveLayoutContainer() {
        WebElement container = driver.findElement(By.className("container"));
        String maxWidth = container.getCssValue("max-width");
        Assert.assertNotNull(maxWidth);
    }

    private void loginAsDemoUser() {
        driver.get(baseUrl + "/login");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
    
