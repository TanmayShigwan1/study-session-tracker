package com.tanmay.study_session_tracker;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class StudySessionController {
        StudySessionManager manager=new StudySessionManager();
        @GetMapping("/sessions")
        public List<StudySession> getSession(){
           return  manager.getSessions();
        }


}
