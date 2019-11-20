package com.example.accessingdatamysql;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.*;
import java.util.*;
import java.sql.Timestamp;

@Entity
public class VerificationToken {
    private static final int EXPIRATION = 60 * 24;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String token;

    private Integer userId;

    private Date expiryDate;

    public VerificationToken(){
        this.expiryDate = null;
        this.userId = -1;
        this.token = "Default";
    }
    public VerificationToken(String token, Integer userId){
        this.expiryDate = null;
        this.userId = userId;
        this.token = token;
    }

    private Date calculateExpiryDate(int expiryTimeInMinutes) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Timestamp(cal.getTime().getTime()));
        cal.add(Calendar.MINUTE, expiryTimeInMinutes);
        return new Date(cal.getTime().getTime());
    }

    public Long getId(){
        return id;
    }
    public void setId(Long id){
        this.id = id;
    }
    public Integer getUserId(){
        return userId;
    }
    public void setUserId(Integer userId){
        this.userId = userId;
    }
    public String getToken(){
        return token;
    }
    public void setToken(String token){
        this.token = token;
    }
    public Date getExpiryDate(){
        return expiryDate;
    }
    public void setExiryData(){
        this.expiryDate = expiryDate;
    }
}
