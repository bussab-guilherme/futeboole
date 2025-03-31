package com.bussab_bucho.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.boot.SpringApplication

@SpringBootApplication
class BackendApplication

fun main(args: Array<String>) {
	SpringApplication.run(BackendApplication::class.java, *args)
}
