package com.example.accessingdatamysql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod.*;
import java.util.*;

@Controller    // This means that this class is a Controller
@RequestMapping(path="/demo") // This means URL's start with /demo (after Application path)
public class UserController {
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private MessageSource messages;

    @Autowired
    private JavaMailSender mailSender;

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/user/add") // Map ONLY POST Requests
    public @ResponseBody String addNewUser (@RequestParam String userName, @RequestParam String displayName, @RequestParam String userPassword) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        try{
            User user = userRepository.findByUserName(userName).get(0);
            return "User Already Exists";
        } catch(Exception e){

        }
        try{
            User n = new User();
            n.setDisplayName(displayName);
            n.setUserName(userName);
            n.setUserPassword(userPassword);
            n.setClassId(-1);
            userRepository.save(n);
        } catch(Exception e){
            return "Failure";
        }
        return "Success";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/get/id", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody User getUserById(@RequestParam String id) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        Integer idInt = Integer.parseInt(id);
        return userRepository.findById(idInt).get();
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/get/userName", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody User getUserByUserName(@RequestParam String userName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            User rtrnUser = new User();
            Integer errId = new Integer(-1);
            rtrnUser.setUserId(errId);
            rtrnUser.setClassId(errId);
            rtrnUser.setDisplayName("User doesn't exist");
            return rtrnUser;
        }

        return user;
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/delete/id", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody String deleteUserById(@RequestParam String id) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Integer idInt = Integer.parseInt(id);
        try{
            userRepository.deleteById(idInt);
        } catch(Exception err){
            return "No such user in database";
        }
        return "User deleted";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/delete/userName", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody String deleteUserByUserName(@RequestParam String userName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        User user = userRepository.findByUserName(userName).get(0);
        Integer idInt = user.getUserId();
        try{
            userRepository.deleteById(idInt);
        } catch(Exception err){
            return "No such user in database";
        }
        return "User deleted";
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/login", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody User userLogin(@RequestParam String userName, @RequestParam String userPassword) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            User rtrnUser = new User();
            Integer errId = new Integer(-1);
            rtrnUser.setUserId(errId);
            rtrnUser.setClassId(errId);
            rtrnUser.setDisplayName("Username not in database");
            return rtrnUser;
        }
        if(!user.getEnabled()){
            User rtrnUser = new User();
            Integer errId = new Integer(-2);
            rtrnUser.setUserId(errId);
            rtrnUser.setClassId(errId);
            rtrnUser.setDisplayName("User hasn't verified their account");
            return rtrnUser;
        }
        if(!user.getUserPassword().equals(userPassword)){
            User rtrnUser = new User();
            Integer errId = new Integer(-1);
            rtrnUser.setUserId(errId);
            rtrnUser.setClassId(errId);
            rtrnUser.setDisplayName("Passwords don't match");
            return rtrnUser;
        }
        System.out.println(user);
        return user;
    }

    //@ResponseHeaders(Access-Control-Allow-Origin=true)
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/all", method=RequestMethod.GET, produces = "application/json")
    public @ResponseBody Iterable<User> getAllUsers() {
        // This returns a JSON or XML with the users
        return userRepository.findAll();
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/token/all", method=RequestMethod.GET, produces = "application/json")
    public @ResponseBody Iterable<VerificationToken> getAllTokens() {
        // This returns a JSON or XML with the users
        return tokenRepository.findAll();
    }


    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/set/classId", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String setClassIdByUserName(@RequestParam String userName, @RequestParam int classId) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Integer classIdInt = new Integer(classId);
        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            return "No such user in database";
        }
        user.setClassId(classIdInt);
        userRepository.save(user);
        return "Id changed";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/set/displayName", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String setDisplayNameByUserName(@RequestParam String userName, @RequestParam String displayName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            return "No such user in database";
        }
        user.setDisplayName(displayName);
        userRepository.save(user);
        return "Display name changed";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/set/userPassword", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String setUserPasswordByUserName(@RequestParam String userName, @RequestParam String userPassword) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            return "No such user in database";
        }
        user.setUserPassword(userPassword);
        userRepository.save(user);
        return "Password changed";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/set/userName", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String setUserNameByUserName(@RequestParam String userName, @RequestParam String newUserName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        User user;
        try{
            user = userRepository.findByUserName(userName).get(0);
        } catch(Exception err){
            return "No such user in database";
        }
        user.setUserName(newUserName);
        userRepository.save(user);
        return "Username changed";
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/sendConfirmation", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String sendConfirmationEmail(@RequestParam String userName){
        User user = getUserByUserName(userName);
        String token = UUID.randomUUID().toString();
        final VerificationToken myToken = new VerificationToken(token, user.getUserId());
        tokenRepository.save(myToken);

        String recipientAddress = user.getUserName();
        String subject = "Qu Account Registration Confirmation";
//        String confirmationUrl = event.getAppUrl() + "/regitrationConfirm.html?token=" + token;
//        MessageSource messages = new MessageSource();
        //       String message = messages.getMessage("message.regSucc", null, event.getLocale());

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);

        email.setSubject(subject);
        email.setText("Hello,\n It seems you recently tried to create an account for Qu. Your confirmation code is:\n\n" + token);
        mailSender.send(email);
        return "Success";
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/checkConfirmation", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String verifyConfirmationCode(@RequestParam String userName, @RequestParam String code){
        try {
            User user = getUserByUserName(userName);
            VerificationToken token = tokenRepository.findByUserId(user.getUserId());
            System.out.println("Token on Repo: " + token.getToken());
            System.out.println("Given token: " + code);
            if (token.getToken().equals(code)) {
                user.setEnabled(true);
                userRepository.save(user);
                tokenRepository.delete(token);
                return "Success";
            }
            else
                return "Failure";
        } catch(Exception e) {
            return "Error: " + e;
        }
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/resetPassword", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String sendResetPassword(@RequestParam String userName){
        User user = getUserByUserName(userName);
        String token = UUID.randomUUID().toString();
        final VerificationToken myToken = new VerificationToken(token, user.getUserId());
        tokenRepository.save(myToken);

        String recipientAddress = user.getUserName();
        String subject = "Qu Account Password Reset";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);

        email.setSubject(subject);
        email.setText("Hello,\n It seems you recently tried to reset your password for Qu. Your confirmation code is:\n\n" + token);
        mailSender.send(email);
        return "Success";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/user/checkPasswordReset", method=RequestMethod.POST) // Map ONLY POST Requests
    public @ResponseBody String verifyPasswordResetCode(@RequestParam String userName, @RequestParam String newPassword, @RequestParam String code){
        try {
            User user = getUserByUserName(userName);
            VerificationToken token = tokenRepository.findByUserId(user.getUserId());
            System.out.println("Token on Repo: " + token.getToken());
            System.out.println("Given token: " + code);
            if (token.getToken().equals(code)) {
                user.setUserPassword(newPassword);
                userRepository.save(user);
                tokenRepository.delete(token);
                return "Success";
            }
            else
                return "Failure";
        } catch(Exception e) {
            return "Error: " + e;
        }
    }
}
