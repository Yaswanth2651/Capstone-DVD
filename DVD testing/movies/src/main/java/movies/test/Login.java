package movies.test;

public class Login {
    public String login(String username, String password) {
        if  (username.equals("user") && password.equals("password")) {
            return "Login Succesfull";
        }
            return "Login failed";
    }
}
