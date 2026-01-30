package com.nvpacademy.Phucacademy.reponse;

import com.nvpacademy.Phucacademy.model.Person;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PersonsReponse {
    private int totalPages;
    private List<Person> content;
}
