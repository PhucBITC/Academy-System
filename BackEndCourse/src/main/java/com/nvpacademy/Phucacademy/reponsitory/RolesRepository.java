package com.nvpacademy.Phucacademy.reponsitory;

import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.model.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RolesRepository extends JpaRepository<Roles, Integer> {

    Roles getByRoleName(String roleName);
}
