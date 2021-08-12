package com.jlumine.itrader.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class AppController {
    @RequestMapping({"/"})
    public String loadUI() {
        return "forward:/index.html";
    }
}