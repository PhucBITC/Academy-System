package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.model.Roles;
import com.nvpacademy.Phucacademy.reponsitory.PersonRepository;
import com.nvpacademy.Phucacademy.reponsitory.RolesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.Optional;

@Service
public class PersonService {
    @Autowired
    private PersonRepository personRepository;

    @Autowired
    private RolesRepository rolesRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Page<Person> getPersonsPage(int page, int size, String sortField, String sortDirection) {
        Sort sort = sortDirection.equalsIgnoreCase(Sort.Direction.ASC.name()) ? Sort.by(sortField).ascending()
                : Sort.by(sortField).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return personRepository.findAll(pageable);
    }

    public boolean createPersonFromSystem(Person person) {
        Optional<Person> personOptional = personRepository.readByEmailAndAccountFrom(person.getEmail(), "APP_LOG");
        System.out.println("ton tai" + personOptional.isPresent());
        if (personOptional.isPresent()) {
            return false;
        } else {
            Person newPerson = new Person();
            newPerson.setName(person.getName());
            newPerson.setEmail(person.getEmail());
            String encodedPassword = passwordEncoder.encode(person.getPwd());
            newPerson.setPwd(encodedPassword);
            newPerson.setAccountFrom("APP_LOG");

            try {
                Roles role = rolesRepository.getByRoleName("STUDENT");
                if (role == null) {
                    System.out.println("ERROR: Role STUDENT not found in database!");
                    return false;
                }
                newPerson.setRoles(role);
                newPerson.setUrlAvt("https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg");

                personRepository.save(newPerson);
            } catch (Exception e) {
                System.out.println("ERROR creating person: " + e.getMessage());
                e.printStackTrace();
                return false;
            }
        }
        return true;
    }

}
