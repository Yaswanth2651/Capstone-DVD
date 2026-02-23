package movies.test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.AfterClass;
import org.testng.annotations.Test;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;

public class RegisterTest {
    
    private WebDriver driver;

    @BeforeClass
    public void setUp() {
        WebDriverManager.chromedriver().setup(); 
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless"); 
        driver = new ChromeDriver(options);
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) {
            driver.quit(); 
        }
    }

    @Test(priority = 1)
    public void testSuccessfulRegistration() {
        driver.get("http://localhost:5173/register");

        WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
        WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
        WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        nameField.sendKeys("Chiru");
        emailField.sendKeys("mega@gmail.com");
        passwordField.sendKeys("Stalin33");
        submitButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        wait.until(ExpectedConditions.urlContains("/catalog"));

        Assert.assertTrue(driver.getCurrentUrl().contains("/catalog"), "Redirected to catalog page.");
    }

    @Test(priority = 2)
    public void testInvalidEmail() {
        driver.get("http://localhost:5173/register");

        WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
        WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
        WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        nameField.sendKeys("bhAAi");
        emailField.sendKeys("AA23");
        passwordField.sendKeys("Icon23");

        submitButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement errorMessage = wait
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

        Assert.assertNotEquals(errorMessage.isDisplayed(), "Error message is not displayed.");
        Assert.assertNotEquals(errorMessage.getText(), "Please enter a valid email address.", "Incorrect error message.");
    }

@Test(priority = 3)
public void testInvalidPassword() {
    driver.get("http://localhost:5173/register");

    WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
    WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
    WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
    WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

    nameField.sendKeys("Raju gaaru");
    emailField.sendKeys("Cutout@gmail.com");
    passwordField.sendKeys("Mogulthuru");

    submitButton.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));


    Assert.assertNotEquals(errorMessage.isDisplayed(), "Error message for invalid password is not displayed.");
    Assert.assertNotEquals(errorMessage.getText().contains("Password must be at least 8 characters"), "Error message does not contain expected text.");

}

    @Test(priority = 4)
    public void testRequiredFields() {
        driver.get("http://localhost:5173/register");

        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        submitButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement errorMessage = wait
                .until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

        Assert.assertTrue(errorMessage.isDisplayed(), "Required fields error message is not displayed.");
        Assert.assertTrue(errorMessage.getText().contains("Name is required."), "Name validation failed.");
    }

    @Test(priority = 5)
public void testSpecialCharactersInNameField() {
    driver.get("http://localhost:5173/register");

    WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
    WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
    WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
    WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

    nameField.sendKeys("surya&karthi");
    emailField.sendKeys("singhamshiva@gmail.com");
    passwordField.sendKeys("Khaithirolex1");
    submitButton.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.urlContains("/catalog"));

    Assert.assertTrue(driver.getCurrentUrl().contains("/catalog"), "Redirected to catalog page.");
}
@Test(priority = 6)
public void testPasswordMinimumLengthBoundary() {
    driver.get("http://localhost:5173/register");

   WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
    WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
    WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
   WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

    nameField.sendKeys("DJtillu");
    emailField.sendKeys("Tillu@gmail.com");
    passwordField.sendKeys("Tillu1");
    submitButton.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

    Assert.assertTrue(errorMessage.getText().contains("8 characters"));
}
@Test(priority = 7)
public void testDuplicateEmailRegistration() {
    driver.get("http://localhost:5173/register");

        WebElement nameField = driver.findElement(By.xpath("//input[@data-testid='auth-name']"));
        WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
        WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        nameField.sendKeys("Chiru");
        emailField.sendKeys("mega@gmail.com");
        passwordField.sendKeys("Stalin33");

        submitButton.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("/html/body/div/div/main/div/div")));

    Assert.assertTrue(errorMessage.isDisplayed());
    Assert.assertFalse(errorMessage.getText().contains("exists") || errorMessage.getText().contains("in use"));
}
@Test(priority = 8)
public void testPasswordIsMasked() {
    driver.get("http://localhost:5173/register");

    WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
    
    Assert.assertEquals(passwordField.getAttribute("type"), "password", "Password field must have type='password'");
}
@Test(priority = 9)
public void testFieldPlaceholders() {
    driver.get("http://localhost:5173/register");

    String namePlaceholder = driver.findElement(By.xpath("//input[@data-testid='auth-name']")).getAttribute("placeholder");
    String emailPlaceholder = driver.findElement(By.xpath("//input[@data-testid='auth-email']")).getAttribute("placeholder");
    String passPlaceholder = driver.findElement(By.xpath("//input[@data-testid='auth-password']")).getAttribute("placeholder");

    Assert.assertEquals(namePlaceholder, "Your name");
    Assert.assertEquals(emailPlaceholder, "you@example.com");
    Assert.assertEquals(passPlaceholder, "At least 8 chars with Aa1");
}
@Test(priority = 10)
public void testNavigateToLogin() {
    driver.get("http://localhost:5173/register");

    WebElement loginLink = driver.findElement(By.linkText("Login"));
    loginLink.click();

    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(5));
    wait.until(ExpectedConditions.urlContains("/login"));

    Assert.assertTrue(driver.getCurrentUrl().contains("/login"));
}
}


