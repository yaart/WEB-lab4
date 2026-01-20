package yaart.s468198.labe4.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = {"/", "/login", "/main"})
    public String redirectToIndex() {
        return "forward:/index.html";
    }
}