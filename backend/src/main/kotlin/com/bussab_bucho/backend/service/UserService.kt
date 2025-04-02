package com.bussab_bucho.backend.service;

import com.bussab_bucho.backend.controllers.UserDTO
import com.bussab_bucho.backend.repository.UserRepository
import com.bussab_bucho.backend.entities.User
import org.springframework.stereotype.Service

@Service 
class UserService {

    var userRepository : UserRepository? = null;
    
    constructor(userRepository : UserRepository) {
        this.userRepository = userRepository;
    }

    fun createUser(dto : UserDTO) : String? {
        var u : User = User(dto.nusp, dto.username, dto.password);

        userRepository?.save(u);
        return u.getNusp();
    }
}
