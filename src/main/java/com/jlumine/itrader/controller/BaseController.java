package com.jlumine.itrader.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class BaseController {
    @RequestMapping("/")
    public String index() {
        return "signin";
    }

    @RequestMapping("/signup")
    public String signUp() {
        return "signup";
    }
}
