package com.bussab_bucho.backend.entities

import jakarta.persistence.Entity
import jakarta.persistence.Table
import jakarta.persistence.Id
import java.util.UUID

@Entity
@Table(name = "USERS")
class User {

    @Id
    private var nusp: String? = null
    private var name: String? = null
    private var password: String? = null
    private var score: Int? = null

    constructor() {

    }

    constructor(nusp: String, name: String, password: String) {
        this.nusp = nusp
        this.name = name
        this.password = password
        this.score = 0
    }

    public fun getNusp(): String? {
        return nusp
    }

    public fun setNusp(nusp: String?) {
        this.nusp = nusp
    }

    public fun getName(): String? {
        return name
    }

    public fun setName(name: String?) {
        this.name = name
    }

    public fun getPassword(): String? {
        return password
    }

    public fun setPassword(password: String?) {
        this.password = password
    }

    public fun getScore(): Int? {
        return score
    }

    public fun setScore(score: Int?) {
        this.score = score
    }
}