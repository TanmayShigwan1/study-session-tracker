package com.tanmay.study_session_tracker;

import java.util.ArrayList;
import java.util.List;



public class StudySessionManager {

    private List<StudySession> sessions;
    int nextId=5;
    public StudySessionManager() {

        sessions = new ArrayList<>();

        sessions.add(new StudySession(
                "1",
                "Java",
                60,
                "COMPLETED"
        ));

        sessions.add(new StudySession(
                "2",
                "DSA",
                45,
                "IN_PROGRESS"
        ));

        sessions.add(new StudySession(
                "3",
                "Spring Boot",
                90,
                "COMPLETED"
        ));

        sessions.add(new StudySession(
                "4",
                "Git",
                30,
                "TODO"
        ));


    }

    public List<StudySession> getSessions() {
        return sessions;
    }

    public  void addSession(String subject, int duration, String status){
        sessions.add(new StudySession(
                String.valueOf(nextId),
                subject,
                duration,
                status
                ));
        nextId++;
    }
}