package com.example.accessingdatamysql.webSockets;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.*;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;

@Configuration
@EnableWebSocket
public class WebSocketConfiguration implements WebSocketConfigurer {

    ArrayList<WebSocketSession> sessionsList = new ArrayList<WebSocketSession>();
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(new TextWebSocketHandler(){
            @Override
            protected void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
                if(!sessionsList.contains(session))
                    sessionsList.add(session);
                if(message.getPayload().equals("")){
                    System.out.println("User registers");
                    return;
                }
                for(int i=0; i<sessionsList.size(); i++){
                    sessionsList.get(i).sendMessage(message);
                }
            }
        }, "/socket").setAllowedOrigins("*");
    }

}