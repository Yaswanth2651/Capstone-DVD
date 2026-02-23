package movies.test;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;

public class Register {

    public static WebDriver driver;

    public static void main(String[] args) {
        setUp();
        testSuccessfulRegistration();
        testInvalidEmail();
        testInvalidPassword();
        testRequiredFields();
        tearDown();
    }

    public static void setUp() {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless");
        driver = new ChromeDriver(options);
    }

    public static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    public static void testSuccessfulRegistration() {
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

        if (driver.getCurrentUrl().contains("/catalog")) {
            System.out.println("testSuccessfulRegistration PASSED");
        } else {
            System.out.println("testSuccessfulRegistration FAILED");
        }
    }

    public static void testInvalidEmail() {
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
        WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

        if (errorMessage.isDisplayed() && errorMessage.getText().contains("Please enter a valid email address.")) {
            System.out.println("testInvalidEmail PASSED");
        } else {
            System.out.println("testInvalidEmail FAILED");
        }
    }

    public static void testInvalidPassword() {
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

        if (errorMessage.isDisplayed() && errorMessage.getText().contains("Password must be at least 8 characters.")) {
            System.out.println("testInvalidPassword PASSED");
        } else {
            System.out.println("testInvalidPassword FAILED");
        }
    }

    public static void testRequiredFields() {
        driver.get("http://localhost:5173/register");

        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        submitButton.click();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        WebElement errorMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//div[@role='alert']")));

        if (errorMessage.isDisplayed() && errorMessage.getText().contains("Name is required.")) {
            System.out.println("testRequiredFields PASSED");
        } else {
            System.out.println("testRequiredFields FAILED");
        }
    }
}

    
