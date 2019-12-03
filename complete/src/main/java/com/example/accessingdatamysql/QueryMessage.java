package com.example.accessingdatamysql.webSockets;

public class QueryMessage {

    private String name;
    private String type;
    private String message;

    public QueryMessage() {
    }

    public QueryMessage(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMessage(){
        return message;
    }
    public void setMessage(String message){
        this.message = message;
    }

}