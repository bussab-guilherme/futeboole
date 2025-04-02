package com.bussab_bucho.backend.controllers

import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.http.ResponseEntity
import com.bussab_bucho.backend.entities.User
import com.bussab_bucho.backend.controllers.UserDTO
import com.bussab_bucho.backend.service.UserService
import java.net.URI

@RestController
@RequestMapping("/api/users")
class UserController {

    private var userService : UserService? = null;

    constructor(userService : UserService) {
        this.userService = userService;
    }

    @PostMapping
    fun createUser(@RequestBody dto : UserDTO): ResponseEntity<User>? {
        var nusp : String? = userService?.createUser(dto);

        return ResponseEntity.created(URI.create("/api/users/" + nusp)).build();
    }

    @GetMapping("/{nusp}")
    fun getUserById(@PathVariable("nusp") nusp : String): ResponseEntity<User>? {
        return null;
    }
}