
DROP TABLE IF EXISTS USERS;

CREATE TABLE USERS (
  ID SERIAL PRIMARY KEY,
  username VARCHAR(25),
  firstname VARCHAR(25),
  lastname VARCHAR(25),
  email VARCHAR(50),
  encrypted_password VARCHAR(60),
  created_at timestamp default current_timestamp
);

INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
VALUES ('toto','Dublanc','Bernard','bernard@wanadoo.fr','blabla');
INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
VALUES ('Gilbert','Dublanc','Bernard','bernard@wanadoo.fr','blabla');



DROP TABLE IF EXISTS LISTE;

CREATE TABLE LISTE(
    ID SERIAL PRIMARY KEY,
    username VARCHAR(25), -- Nom de l'utilisateur à qui appartient la liste de tâches
    titre VARCHAR(60),
    created_at timestamp default current_timestamp
    --je mets le jour de création c'est gratuit
);



INSERT INTO LISTE (username, titre) VALUES ('toto', 'Plan pour battre GrosChibrax7');
INSERT INTO LISTE (username, titre) VALUES ('Gilbert', 'Terminer le projet');


DROP TABLE IF EXISTS TACHE;

CREATE TABLE TACHE(
    ID SERIAL PRIMARY KEY,
    idListe INTEGER REFERENCES LISTE(ID),
    titre VARCHAR(60), 
    echeance DATE, -- Date d'échéance de la tâche
    note VARCHAR(300), -- Texte de description de la tâche
    fait BOOLEAN, -- La tâche est-elle terminée ?
    created_at timestamp default current_timestamp
);


INSERT INTO TACHE (idListe,titre, echeance, note,fait) 
VALUES (1,'Entrainement brute','2020-04-20','Ouvrir firefox tous les jours',FALSE);
/*

DROP TABLE IF EXISTS SOUSTACHE;


CREATE TABLE SOUSTACHE(
    ID SERIAL PRIMARY KEY,
    idTache REFERENCES TACHE(ID),
    titre VARCHAR(60),
    note VARCHAR(300), --La sous-tâche a-t-elle des notes ?
    fait BOOLEAN, 
    created_at timestamp default current_timestamp
);


INSERT INTO SOUSTACHE (idTache, titre, note, fait) 
VALUES (0, 'Rythme','Faire les trois matchs par jour', FALSE);
INSERT INTO SOUSTACHE (idTache, titre, note, fait) 
VALUES (0, 'Tactique','Choisir les adversaires les plus faibles', FALSE);


*/


