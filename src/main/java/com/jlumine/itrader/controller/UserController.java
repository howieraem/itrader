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
public class UserController {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "signin", method = RequestMethod.POST)
    @ResponseBody
    public User sign_in(User user){
        return userService.sign_in(user);
    }

    @RequestMapping(value = "signup", method = RequestMethod.POST)
    @ResponseBody
    public String sign_up(User user){
        userService.sign_up(user);
        return "Sign up successful!";
    }
}
