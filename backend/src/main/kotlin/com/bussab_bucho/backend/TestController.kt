package com.bussab_bucho.backend

import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.GetMapping

@RestController
class TestController {

    @GetMapping("/api/generateData")
    fun generateData(): String {
        return "Dados gerados no backend!"
    }
}