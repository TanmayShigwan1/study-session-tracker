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

    public StudySession findSession(String find_id){
        for(int i=0;i<sessions.size();i++){
            if(find_id.equals(sessions.get(i).getId())){
                //so like we will jus print that
                return sessions.get(i);
            }
        }return null;
    }


    public StudySession updateSession(String id, String subject, int duration, String status){
        StudySession session = findSession(id);

        if (session == null) {
            return null;
        }

        session.setSubject(subject);
        session.setDuration(duration);
        session.setStatus(status);

        return  session;

    }


    public boolean  deleteSession(String id){
        StudySession session=findSession(id);

        if(session==null){
            return false;
        }

        sessions.remove(session);
        return true;
    }


    public int  getTotalDuration(){
        int total=0;
        for(int i=0;i<sessions.size();i++){
            total=sessions.get(i).getDuration()+total;
        }return  total;
    }


}