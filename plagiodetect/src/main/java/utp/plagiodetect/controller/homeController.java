package utp.plagiodetect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class homeController {

    @GetMapping("/inicio")
    public String inicio() {
        return "fragments/index";
    }

}