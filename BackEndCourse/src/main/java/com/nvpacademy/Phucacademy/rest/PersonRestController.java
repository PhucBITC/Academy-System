package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.reponsitory.PersonRepository;
import com.nvpacademy.Phucacademy.request.PersonRequest;
import com.nvpacademy.Phucacademy.service.PersonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping(path = "/api/person", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public class PersonRestController {
    @Autowired
    PersonRepository personRepository;

    @Autowired
    PersonService personService;

    @GetMapping("/auth/getPerson")
    public Person getPerson(@RequestParam String email, @RequestParam String accountFrom) {
        Optional<Person> user = personRepository.readByEmailAndAccountFrom(email, accountFrom);
        if (user.isPresent()) {
            return user.get();
        }
        return null;

    }

    @PostMapping("/public/createPerson")
    public ResponseEntity<Boolean> createPerson(@RequestBody PersonRequest person) {
        Person newPerson = new Person();
        newPerson.setName(person.getName());
        newPerson.setEmail(person.getEmail());
        newPerson.setPwd(person.getPwd());
        Boolean check = personService.createPersonFromSystem(newPerson);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(check);
    }
}
