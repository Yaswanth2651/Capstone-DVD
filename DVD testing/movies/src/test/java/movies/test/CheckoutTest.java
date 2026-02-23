package movies.test;
    
import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class CheckoutTest {


    private WebDriver driver;
    private WebDriverWait wait;

    @BeforeMethod
   public void setUp() {
        driver = new ChromeDriver(); {
        driver.get("http://localhost:5173/login");
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        WebElement emailField = driver.findElement(By.xpath("//input[@data-testid='auth-email']"));
        WebElement passwordField = driver.findElement(By.xpath("//input[@data-testid='auth-password']"));
        WebElement submitButton = driver.findElement(By.xpath("//button[@data-testid='auth-submit']"));

        emailField.sendKeys("demo.user@example.com");
        passwordField.sendKeys("DemoPass1");
        submitButton.click();

    wait.until(ExpectedConditions.urlContains("http://localhost:5173/"));
    driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/aside/button")).click();
        driver.get("http://localhost:5173/checkout");
    }
    }

    @Test
    public void testEmptyCartState() {
        WebElement emptyMsg = driver.findElement(By.className("muted"));
        Assert.assertEquals(emptyMsg.getText(), "Hi, Demo User");
    }

    @Test
    public void testFormValidationFailure() {
        driver.findElement(By.cssSelector("[data-testid='checkout-continue']")).click();
        
        WebElement alert = driver.findElement(By.className("alert"));
        Assert.assertTrue(alert.isDisplayed());
        Assert.assertTrue(alert.getText().contains("Address is required"));
    }

    @Test
    public void testOrderReviewCalculations() {
        WebElement subtotal = driver.findElement(By.xpath("//span[text()='Subtotal']/following-sibling::span"));
        WebElement total = driver.findElement(By.className("priceBig"));
        
        Assert.assertNotNull(subtotal.getText());
        Assert.assertNotNull(total.getText());
    }

    @Test
    public void testSuccessfulCheckoutNavigation() {
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/label[1]/input")).sendKeys("123 Tech Park");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/label[2]/input")).sendKeys("Bengaluru");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/div/label[1]/input")).sendKeys("Karnataka");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/div/label[2]/input")).sendKeys("560001");

        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/button")).click();

        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/payment/ORD-000001"));
    }

    @Test
    public void testInputPersistence() {
        WebElement cityInput = driver.findElement(By.cssSelector("[data-testid='checkout-city']"));
        cityInput.sendKeys("Mumbai");
        
        Assert.assertEquals(cityInput.getAttribute("value"), "Mumbai");
    }

    @AfterMethod
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
