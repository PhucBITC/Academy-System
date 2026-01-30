package com.nvpacademy.Phucacademy.reponsitory;

import com.nvpacademy.Phucacademy.model.Cart;
import com.nvpacademy.Phucacademy.model.CartId;
import com.nvpacademy.Phucacademy.model.Ratings;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartReponsitory extends JpaRepository<Cart, CartId> {

        @Query("SELECT ca, co " +
                        "FROM Cart ca LEFT JOIN Courses co ON ca.cartId.courseId = co.courseId " +
                        "WHERE ca.cartId.personId = :personId " +
                        "ORDER BY ca.createdAt DESC")
        List<Object> findCartWithCourseByPersonID(@Param("personId") int personId);

        @Query("SELECT ca, co " +
                        "FROM Cart ca LEFT JOIN Courses co ON ca.cartId.courseId = co.courseId " +
                        "WHERE ca.cartId.personId = :personId AND ca.cartId.courseId = :courseId")
        Optional<Object> findCartWithCourseByPersonIDAndCourseID(int personId, int courseId);

        @Query("SELECT ca, co " +
                        "FROM Cart ca LEFT JOIN Courses co ON ca.cartId.courseId = co.courseId " +
                        "WHERE ca.cartId.personId = :personId " +
                        "ORDER BY ca.createdAt DESC")
        Page<Object> findCartWithCourseByPersonIDPageable(@Param("personId") int personId, Pageable pageable);

        @Modifying
        @Query("DELETE FROM Cart ca WHERE ca.cartId.personId = :personId AND ca.cartId.courseId IN :courseIds")
        void removeListCartSelected(@Param("personId") int personId, @Param("courseIds") List<Integer> courseIds);

        @Modifying
        @Query("DELETE FROM Cart ca WHERE ca.cartId.personId = :personId")
        void removeAllCartsByPersonId(@Param("personId") int personId);

}
