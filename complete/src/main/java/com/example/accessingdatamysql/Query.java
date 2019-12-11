package com.example.accessingdatamysql;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
@Entity
public class Query {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Integer queryId;
    private String userName;
    private String displayName;

    private String queryString;
    private String queryType;
    private Integer nextQueryId;

    public Integer getQueryId(){
        return queryId;
    }
    public void setQueryId(Integer queryId){
        this.queryId = queryId;
    }
    public String getUserName(){
        return userName;
    }
    public void setUserName(String userName){
        this.userName = userName;
    }
    public String getQueryString(){
        return queryString;
    }
    public void setQueryString(String queryString){
        this.queryString = queryString;
    }
    public Integer getNextQueryId(){
        return nextQueryId;
    }
    public void setNextQueryId(Integer nextQueryId){
        this.nextQueryId = nextQueryId;
    }

    public String getQueryType(){
        return queryType;
    }
    public void setQueryType(String queryType){
        this.queryType = queryType;
    }
    public String getDisplayName(){return displayName;}
    public void setDisplayName(String displayName){this.displayName = displayName;}


}
