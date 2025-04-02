package com.bussab_bucho.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import com.bussab_bucho.backend.entities.User
 
@Repository
interface UserRepository : JpaRepository<User, String>{

}
