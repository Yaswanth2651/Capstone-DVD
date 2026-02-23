package movies.test;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;
import org.testng.Assert;
import org.testng.annotations.*;

public class LoginTest {
    WebDriver driver;
    WebDriverWait wait;

    By emailField = By.cssSelector("[data-testid='auth-email']");
    By passwordField = By.cssSelector("[data-testid='auth-password']");
    By loginButton = By.cssSelector("[data-testid='auth-submit']");
    By errorAlert = By.cssSelector("[data-testid='auth-error']");
    By demoButton = By.xpath("//button[text()='Use demo']");
    By registerLink = By.linkText("Register");

    @BeforeMethod
    public void setUp() {
        WebDriverManager.chromedriver().setup();
        driver = new ChromeDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.get("http://localhost:5173/login");
        driver.manage().window().maximize();
    }

    @Test
    public void testDemoUserFunctionality() {
        driver.findElement(demoButton).click();
        Assert.assertFalse(driver.findElement(emailField).getAttribute("value").isEmpty());
        Assert.assertFalse(driver.findElement(passwordField).getAttribute("value").isEmpty());
    }

    @Test
    public void testErrorMessageVisibility() {
        driver.findElement(emailField).sendKeys("invalid@test.com");
        driver.findElement(passwordField).sendKeys("wrongpass");
        driver.findElement(loginButton).click();
        WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(errorAlert));
        Assert.assertTrue(error.isDisplayed());
    }

    @Test
    public void testNavigationToRegister() {
        driver.findElement(registerLink).click();
        wait.until(ExpectedConditions.urlContains("/register"));
        Assert.assertTrue(driver.getCurrentUrl().contains("/register"));
    }

    @Test
    public void testPasswordMasking() {
        Assert.assertEquals(driver.findElement(passwordField).getAttribute("type"), "password");
    }

    @Test
    public void testEnterKeySubmission() {
        driver.findElement(demoButton).click();
        driver.findElement(passwordField).sendKeys(Keys.ENTER);
        wait.until(ExpectedConditions.not(ExpectedConditions.urlContains("/login")));
        Assert.assertFalse(driver.getCurrentUrl().contains("/login"));
    }

    @Test
    public void testEmptyLoginAttempt() {
        driver.findElement(loginButton).click();
        WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(errorAlert));
        Assert.assertNotNull(error.getText());
    }

    @Test
    public void testEmailAutocompleteAttribute() {
        Assert.assertEquals(driver.findElement(emailField).getAttribute("autoComplete"), "email");
    }

    @Test
    public void testInputPersistenceBeforeSubmit() {
        String input = "stay@here.com";
        driver.findElement(emailField).sendKeys(input);
        driver.navigate().refresh();
        Assert.assertEquals(driver.findElement(emailField).getAttribute("value"), "");
    }

    @Test
    public void testLoginButtonState() {
        Assert.assertTrue(driver.findElement(loginButton).isEnabled());
        Assert.assertEquals(driver.findElement(loginButton).getAttribute("type"), "submit");
    }

    @Test
    public void testPlaceholderText() {
        Assert.assertEquals(driver.findElement(emailField).getAttribute("placeholder"), "you@example.com");
        Assert.assertEquals(driver.findElement(passwordField).getAttribute("placeholder"), "Your password");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}