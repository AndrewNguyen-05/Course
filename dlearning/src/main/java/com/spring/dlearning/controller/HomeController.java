package com.spring.dlearning.controller;


import com.spring.dlearning.utils.SecurityUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Optional;

@Controller
public class HomeController {

    @GetMapping(value = {"/", "/home"})
    public String homeDefault(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated User: " + authentication.getName());
        return "home/index";
    }

    @GetMapping("/profile")
    public String viewProfile(){
        return "profile/profile";
    }

    @GetMapping("/login")
    public String formLogin() {
        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        if (currentUserLogin.isPresent() && !"anonymousUser".equals(currentUserLogin.get())) {
            System.out.println("Người dùng đang đăng nhập: " + currentUserLogin.get());
            return "home/index";
        }
        return "authentication/login";
    }

    @GetMapping("/register")
    public String formRegister(){
        return "authentication/register";
    }

    @GetMapping("/create-password")
    public String formCreatePassword(){
        return "authentication/create-password";
    }

    @GetMapping("/authenticate")
    public String processLogin(){
        return "authentication/process-login";
    }

    @GetMapping("/authenticate-fb")
    public String processLoginFb(){
        return "authentication/process-login-fb";
    }



    @GetMapping("/about")
    public String about(){
        return "about";
    }

    @GetMapping("/courses")
    public String courses(){
        return "course";
    }

    @GetMapping("/course-detail")
    public String courseDetail(){
        return "detail";
    }

    @GetMapping("/our-feature")
    public String ourFeature(){
        return "feature";
    }

    @GetMapping("/instructor")
    public String instructor(){
        return "team";
    }

    @GetMapping("/testimonial")
    public String testimonial(){
        return "testimonial";
    }

    @GetMapping("/contact")
    public String contact(){
        return "contact";
    }

    @GetMapping("/admin")
    public String homeAdmin(){
        return "admin-home";
    }

}
