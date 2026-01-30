package com.nvpacademy.Phucacademy.rest;

import com.nvpacademy.Phucacademy.model.Cart;
import com.nvpacademy.Phucacademy.model.Person;
import com.nvpacademy.Phucacademy.service.CartService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(path = "/api/cart", produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
public class CartRestController {
    @Autowired
    CartService cartService;

    @GetMapping("/auth/getCartByPersonId")
    public List<Object> getCartByPersonId(@RequestParam int personId) {
        return cartService.findCartsByPersonId(personId);
    }

    @PostMapping("/auth/insertCart")
    public ResponseEntity<Boolean> insertCart(@RequestBody Cart newCart) {
        boolean checkSuccess = cartService.insertNewCart(newCart);
        return ResponseEntity.status(HttpStatus.OK).body(checkSuccess);

    }

    @PostMapping("/auth/getCartByPsAndCourseId")
    public Object getCartByPsAndCourseId(@RequestBody Cart cart) {
        if (cartService.findCartByPersonIdAndCourseID(cart.getCartId().getPersonId(),
                cart.getCartId().getCourseId()) == null) {
            return 0;
        }
        return cartService.findCartByPersonIdAndCourseID(cart.getCartId().getPersonId(),
                cart.getCartId().getCourseId());

    }

    @GetMapping("/auth/getCartByPersonIdPage")
    public List<Object> getCartByPersonIdPage(@RequestParam int personId, @RequestParam int page) {
        return cartService.findCartsByPersonIdPageable(personId, page);
    }

    @PostMapping("/auth/deleteCartByPersonAndCourseId")
    public ResponseEntity<Boolean> deleteCartByPersonAndCourseId(@RequestBody Cart cart) {
        Boolean check = cartService.removeCartByPersonIdAndCourseId(cart.getCartId().getPersonId(),
                cart.getCartId().getCourseId());
        return ResponseEntity.status(200).body(check);
    }

    @DeleteMapping("/auth/removeListCartSelected")
    public ResponseEntity<Boolean> removeListCartSelected(@RequestParam("personId") int personId,
            @RequestParam("courseIds") List<Integer> courseIds) {
        boolean check = cartService.removeListCartSelected(personId, courseIds);
        return ResponseEntity.status(HttpStatus.OK).body(check);
    }

    @DeleteMapping("/auth/removeAllCartsByPersonId")
    public ResponseEntity<Boolean> removeAllCartsByPersonId(@RequestParam("personId") int personId) {
        boolean check = cartService.removeAllCartsByPersonId(personId);
        return ResponseEntity.status(HttpStatus.OK).body(check);
    }
}
