package com.nvpacademy.Phucacademy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableJpaRepositories("com.nvpacademy.Phucacademy.reponsitory")
@EntityScan("com.nvpacademy.Phucacademy.model")
@EnableJpaAuditing(auditorAwareRef = "auditAwareImpl")
@EnableScheduling
@SpringBootApplication
public class LeHerryAcademyApplication {

	public static void main(String[] args) {
		SpringApplication.run(LeHerryAcademyApplication.class, args);
	}

}
