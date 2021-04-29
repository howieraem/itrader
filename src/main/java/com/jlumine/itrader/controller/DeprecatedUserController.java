package com.jlumine.itrader.controller;

import com.jlumine.itrader.model.User;
import com.jlumine.itrader.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("user")
public class DeprecatedUserController {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "signin", method = RequestMethod.POST)
    @ResponseBody
    public String signIn(User user){
        try {
            return userService.signIn(user).toString();
        } catch (RuntimeException re) {
            return re.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal Error: " + e.getMessage();
        }
    }

    @RequestMapping(value = "signup", method = RequestMethod.POST)
    @ResponseBody
    public String signUp(User user){
        try {
            userService.signUp(user);
            return "Sign up successful! You are given an initial $5000 fund to start with.";
        } catch (RuntimeException re) {
            return re.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal Error: " + e.getMessage();
        }
    }
}
