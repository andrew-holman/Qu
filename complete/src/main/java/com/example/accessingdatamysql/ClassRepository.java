package com.example.accessingdatamysql;

//import com.example.accessingdatamysql.User;
import org.springframework.data.repository.CrudRepository;
import java.util.*;

// This will be AUTO IMPLEMENTED by Spring into a Bean called userRepository
// CRUD refers Create, Read, Update, Delete

public interface ClassRepository extends CrudRepository<Class, Integer> {
    List<Class> findByCreatorUserName(String creatorUserName);
}