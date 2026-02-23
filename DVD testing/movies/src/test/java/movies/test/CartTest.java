package movies.test;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.testng.Assert;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;
import org.openqa.selenium.chrome.ChromeDriver;

public class CartTest {

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

    }
}

    @Test(priority = 1)
    public void testCartPageLoad() {    
    driver.get("http://localhost:5173/cart");
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));

    WebElement cartHeader = wait.until(ExpectedConditions.visibilityOfElementLocated(By.tagName("h1")));
    Assert.assertEquals(cartHeader.getText(), "Cart", "Cart page didn't load correctly.");
    }

   @Test(priority = 2)
    public void testCatalogRedirection() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        driver.findElement(By.xpath("//button[text()='Clear cart']")).click();
        driver.findElement(By.linkText("Go to catalog")).click();
        Assert.assertTrue(driver.getCurrentUrl().contains("/catalog"));
    }
    @Test(priority = 3)
    public void testProductsInCart() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement productTitle = driver.findElement(By.cssSelector(".tableRow .title"));
        Assert.assertTrue(productTitle.isDisplayed(), "Product title is not visible in cart.");
    }

    @Test(priority = 4)
    public void testUpdateProductQuantity() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement quantityInput = driver.findElement(By.cssSelector(".inputSmall"));
        String initialQuantity = quantityInput.getAttribute("value");
        quantityInput.clear();
        quantityInput.sendKeys("2");
        Assert.assertEquals(quantityInput.getAttribute("value"), "2", "Product quantity was not updated correctly.");
    }

    @Test(priority = 5)
    public void testRemoveProductFromCart() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement removeButton = driver.findElement(By.xpath("/html/body/div/div/main/div/div[2]/section/div/div[2]/div[4]/button"));
        removeButton.click();
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        WebElement emptyCartMessage = wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".panel .muted")));
        Assert.assertEquals(emptyCartMessage.getText(), "Your cart is empty.", "Product was not removed from cart.");
    }

    @Test(priority = 6)
    public void testSubtotalCalculation() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement subtotalText = driver.findElement(By.xpath("//span[contains(text(),'Subtotal')]//following-sibling::span"));
        String subtotalValue = subtotalText.getText();
        Assert.assertFalse(subtotalValue.isEmpty(), "Subtotal is not displayed correctly.");
    }

    @Test(priority = 7)
    public void testProceedToCheckoutButton() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement checkoutButton = driver.findElement(By.cssSelector("button[data-testid='cart-checkout']"));
        checkoutButton.click();
        Assert.assertTrue(driver.getCurrentUrl().contains("/checkout"), "User was not redirected to checkout.");
    }

    @Test(priority = 8)
    public void testShippingDisplay() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement shippingText = driver.findElement(By.xpath("//span[contains(text(),'Shipping')]//following-sibling::span"));
        Assert.assertTrue(shippingText.isDisplayed(), "Shipping info is not displayed correctly.");
    }

    @Test(priority = 9)
    public void testTotalAmountDisplay() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement totalText = driver.findElement(By.xpath("//span[contains(text(),'Total')]//following-sibling::span"));
        String totalValue = totalText.getText();
        Assert.assertFalse(totalValue.isEmpty(), "Total value is not displayed correctly.");
    }

    @Test(priority = 10)
    public void testFreeShippingPrice() {
        driver.get("http://localhost:5173/catalog");
        driver.findElement(By.xpath("/html/body/div/div/main/div/section[2]/article[2]/div[2]/div[3]/button")).click();
        driver.get("http://localhost:5173/cart");
        WebElement shippingText = driver.findElement(By.xpath("//span[contains(text(),'Shipping')]//following-sibling::span"));
        String shippingValue = shippingText.getText();
        Assert.assertEquals(shippingValue, "₹99.00", "Shipping is not displayed as Free when it should be.");
    }

    @AfterMethod
    public void tearDown() {
        driver.quit();
    }
}