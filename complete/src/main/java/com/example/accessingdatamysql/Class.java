package com.example.accessingdatamysql;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
@Entity
public class Class {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer classId;
    private String creatorUserName;

    private String displayName;
    private Integer firstQueryId;

    public Integer getClassId(){
        return classId;
    }
    public void setClassId(Integer classId){
        this.classId = classId;
    }
    public String getCreatorUserName(){
        return creatorUserName;
    }
    public void setCreatorUserName(String creatorUserName){
        this.creatorUserName = creatorUserName;
    }
    public String getDisplayName(){
        return displayName;
    }
    public void setDisplayName(String displayName){
        this.displayName = displayName;
    }
    public Integer getFirstQueryId(){
        return firstQueryId;
    }
    public void setFirstQueryId(Integer firstQueryId){
        this.firstQueryId = firstQueryId;
    }


}
