package com.nvpacademy.Phucacademy.service;

import com.nvpacademy.Phucacademy.model.Cart;
import com.nvpacademy.Phucacademy.model.CartId;
import com.nvpacademy.Phucacademy.model.Courses;
import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.reponsitory.CartReponsitory;
import com.nvpacademy.Phucacademy.reponsitory.CourseRepository;
import com.nvpacademy.Phucacademy.reponsitory.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    PersonRepository personRepository;
    @Autowired
    CourseRepository courseRepository;
    @Autowired
    CartReponsitory cartReponsitory;

    public List<Object> findCartsByPersonId(int personId) {
        Optional<Person> findPerson = personRepository.findById(personId);
        if (!findPerson.isPresent()) {
            return null;
        }
        List<Object> listCart = cartReponsitory.findCartWithCourseByPersonID(personId);
        return listCart;
    }

    public Object findCartByPersonIdAndCourseID(int personId, int courseId) {
        Optional<Object> optionalCart = cartReponsitory.findCartWithCourseByPersonIDAndCourseID(personId, courseId);
        if (optionalCart.isPresent()) {
            return optionalCart.get();
        }

        return null;
    }

    public boolean insertNewCart(Cart newCart) {
        Optional<Courses> findCourse = courseRepository.findById(newCart.getCartId().getCourseId());
        Optional<Person> findPerson = personRepository.findById(newCart.getCartId().getPersonId());
        if (!findCourse.isPresent() || !findPerson.isPresent()) {
            return false;
        } else {
            CartId newCartId = new CartId(newCart.getCartId().getPersonId(), newCart.getCartId().getCourseId());
            Cart saveCart = new Cart(newCartId);
            cartReponsitory.save(saveCart);
            return true;
        }
    }

    public List<Object> findCartsByPersonIdPageable(int personId, int pageNumber) {
        Optional<Person> findPerson = personRepository.findById(personId);
        if (!findPerson.isPresent()) {
            return null;
        }
        Pageable pageable = PageRequest.of(pageNumber, 5);
        Page<Object> page = cartReponsitory.findCartWithCourseByPersonIDPageable(personId, pageable);
        return page.getContent();
    }

    public boolean removeCartByPersonIdAndCourseId(int personId, int courseId) {
        CartId deletedId = new CartId(personId, courseId);
        System.out.println("debug" + deletedId);
        Optional<Cart> findCart = cartReponsitory.findById(deletedId);

        if (!findCart.isPresent()) {
            return false;
        }
        cartReponsitory.deleteById(deletedId);
        return true;

    }

    @Transactional
    public boolean removeListCartSelected(int personId, List<Integer> courseIds) {
        cartReponsitory.removeListCartSelected(personId, courseIds);
        return true;

    }

    @Transactional
    public boolean removeAllCartsByPersonId(int personId) {
        cartReponsitory.removeAllCartsByPersonId(personId);
        return true;

    }
}
