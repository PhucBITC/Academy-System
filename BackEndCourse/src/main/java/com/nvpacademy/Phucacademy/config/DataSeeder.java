package com.nvpacademy.Phucacademy.config;

import com.nvpacademy.Phucacademy.model.Roles;
import com.nvpacademy.Phucacademy.reponsitory.RolesRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

    @Bean
    public CommandLineRunner initDatabase(RolesRepository rolesRepository) {
        return args -> {
            if (rolesRepository.getByRoleName("STUDENT") == null) {
                Roles studentRole = new Roles();
                studentRole.setRoleName("STUDENT");
                rolesRepository.save(studentRole);
                System.out.println("✅ Inserted missing role: STUDENT");
            }

            if (rolesRepository.getByRoleName("ADMIN") == null) {
                Roles adminRole = new Roles();
                adminRole.setRoleName("ADMIN");
                rolesRepository.save(adminRole);
                System.out.println("✅ Inserted missing role: ADMIN");
            }
        };
    }
}
