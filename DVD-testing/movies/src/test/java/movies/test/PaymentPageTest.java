package movies.test;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;


public class PaymentPageTest {
    WebDriver driver;

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
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/label[1]/input")).sendKeys("123 Tech Park");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/label[2]/input")).sendKeys("Bengaluru");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/div/label[1]/input")).sendKeys("Karnataka");
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/div/label[2]/input")).sendKeys("560001");

        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/form/button")).click();

        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("/payment/ORD-000001"));
    }
    }

    @Test
    public void testSuccessfulCardPayment() {
        Select methodSelect = new Select(driver.findElement(By.xpath("//select[@data-testid='payment-method']")));
        methodSelect.selectByValue("card");

        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).clear();
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).sendKeys("4111111111111111");
        
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/button")).click();

        Assert.assertTrue(driver.getCurrentUrl().contains("/orders/ORD-000001"));
    }

    @Test
    public void testFailedCardPaymentDeclined() {
        Select methodSelect = new Select(driver.findElement(By.xpath("//select[@data-testid='payment-method']")));
        methodSelect.selectByValue("card");

         driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).clear();
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).sendKeys("4111111111110000");
        
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/button")).click();

        WebElement errorMsg = driver.findElement(By.xpath("//div[@data-testid='payment-error']"));
        Assert.assertEquals(errorMsg.getText(), "Card declined (simulated).");
    }

    @Test
    public void testSuccessfulUPIPayment() {
        Select methodSelect = new Select(driver.findElement(By.xpath("//select[@data-testid='payment-method']")));
        methodSelect.selectByValue("upi");

        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).clear();
        driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input")).sendKeys("qa.user@bank");

        driver.findElement(By.xpath("//button[@data-testid='payment-pay']")).click();

        Assert.assertTrue(driver.getCurrentUrl().contains("/orders/ORD-000001"));
    }

    @Test
    public void testInvalidUPIIdValidation() {
        Select methodSelect = new Select(driver.findElement(By.xpath("//select[@data-testid='payment-method']")));
        methodSelect.selectByValue("upi");

        WebElement upiInput = driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/form/label[2]/input"));
        upiInput.clear();
        upiInput.sendKeys("invalid-id-no-at-sign");

        driver.findElement(By.xpath("//button[@data-testid='payment-pay']")).click();

        WebElement errorMsg = driver.findElement(By.xpath("//div[@data-testid='payment-error']"));
        Assert.assertEquals(errorMsg.getText(), "UPI ID must contain @.");
    }

    @Test
    public void testCashOnDeliverySelection() {
        Select methodSelect = new Select(driver.findElement(By.xpath("//select[@data-testid='payment-method']")));
        methodSelect.selectByValue("cod");

        driver.findElement(By.xpath("//button[@data-testid='payment-pay']")).click();

        Assert.assertTrue(driver.getCurrentUrl().contains("/orders/ORD-000001"));
    }

    @AfterMethod
    public void teardown() {
        driver.quit();
    }
}
