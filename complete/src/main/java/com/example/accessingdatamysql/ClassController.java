package com.example.accessingdatamysql;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod.*;
import java.util.*;

@Controller    // This means that this class is a Controller
@RequestMapping(path="/class") // This means URL's start with /demo (after Application path)
public class ClassController {
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private ClassRepository classRepository;
    @Autowired // This means to get the bean called userRepository
    // Which is auto-generated by Spring, we will use it to handle the data
    private QueryRepository queryRepository;

    //@ResponseHeaders(Access-Control-Allow-Origin=true)
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/all", method=RequestMethod.GET, produces = "application/json")
    public @ResponseBody Iterable<Class> getAllClasses() {
        // This returns a JSON or XML with the users
        return classRepository.findAll();
    }
    //@ResponseHeaders(Access-Control-Allow-Origin=true)
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/get/id", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody Class getClassById(@RequestParam Integer classId) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        Class classInstance = new Class();
        try{
            classInstance = classRepository.findById(classId).get();
        } catch(Exception err){
            classInstance.setDisplayName("Class doesn't exist");
            classInstance.setCreatorUserName("");
            classRepository.save(classInstance);
        }

        return classInstance;
    }
    //@ResponseHeaders(Access-Control-Allow-Origin=true)
    @CrossOrigin(origins = "http://localhost:63342")
    @RequestMapping(path="/get/creatorUserName", method=RequestMethod.POST, produces = "application/json") // Map ONLY POST Requests
    public @ResponseBody Class getClassByCreatorUserName(@RequestParam String creatorUserName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        Class classInstance = new Class();
        try{
            classInstance = classRepository.findByCreatorUserName(creatorUserName).get(0);
        } catch(Exception err){
            classInstance.setDisplayName("Class doesn't exist");
            classInstance.setCreatorUserName("");
            classInstance.setClassId(-1);
        }

        return classInstance;
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/add") // Map ONLY POST Requests
    public @ResponseBody Class addNewClass (@RequestParam String creatorUserName, @RequestParam String displayName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Class n = new Class();
        try{
            n.setDisplayName(displayName);
            n.setCreatorUserName(creatorUserName);
            classRepository.save(n);
        } catch(Exception e){
            n.setDisplayName("Failed to create class");
            return n;
        }

        return n;
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/delete/id") // Map ONLY POST Requests
    public @ResponseBody String deleteClass (@RequestParam int classId) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Integer idInt = new Integer(classId);
        try{
            classRepository.deleteById(idInt);
        } catch(Exception err){
            return "No such class in database";
        }
        return "Class deleted";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/delete/creatorUserName") // Map ONLY POST Requests
    public @ResponseBody String deleteClass (@RequestParam String creatorUserName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request

        try{
            Class classInstance = classRepository.findByCreatorUserName(creatorUserName).get(0);
            classRepository.deleteById(classInstance.getClassId());
        } catch(Exception err){
            return "No such class in database";
        }
        return "Class deleted";
    }
    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/query/add") // Map ONLY POST Requests
    public @ResponseBody Query addNewQuery (@RequestParam int classId, @RequestParam String queryString, @RequestParam String queryType, @RequestParam String userName, @RequestParam String displayName) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Query query = new Query();
        try{
            Class classInstance = classRepository.findById(classId).get();
            query.setQueryString(queryString);
            query.setQueryType(queryType);
            query.setUserName(userName);
            query.setDisplayName(displayName);
            query.setNextQueryId(classInstance.getFirstQueryId());
            queryRepository.save(query);
            classInstance.setFirstQueryId(query.getQueryId());
            classRepository.save(classInstance);
        } catch(Exception e){
            return new Query();
        }

        return query;
    }

    @CrossOrigin(origins = "http://localhost:63342")
    @PostMapping(path="/query/view") // Map ONLY POST Requests
    public @ResponseBody Iterable<Query> viewQueries (@RequestParam int classId) {
        // @ResponseBody means the returned String is the response, not a view name
        // @RequestParam means it is a parameter from the GET or POST request
        Class classInstance = new Class();
        ArrayList<Query> queryList = new ArrayList<Query>();
        try{
            classInstance = classRepository.findById(classId).get();
            Query query = queryRepository.findById(classInstance.getFirstQueryId()).get();
            while(query != null){
                queryList.add(query);
                query = queryRepository.findById(query.getNextQueryId()).get();
            }
        } catch(Exception e){
            return queryList;
        }

        return null;
    }

}
