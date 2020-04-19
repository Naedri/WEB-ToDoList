DROP TABLE IF EXISTS USERS;
CREATE TABLE USERS (
  ID SERIAL PRIMARY KEY,
  username VARCHAR(25),
  firstname VARCHAR(25),
  lastname VARCHAR(25),
  email VARCHAR(50)  CONSTRAINT NN_email NOT NULL,
  encrypted_password VARCHAR(60) CONSTRAINT NN_password NOT NULL,
  created_at timestamp default current_timestamp
);

ALTER TABLE USERS ADD CONSTRAINT U_MailUser UNIQUE (email) ;

INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
    VALUES ('toto','Bernard','Dublanc','bernard@wanadoo.fr','blablabla');
INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
    VALUES ('Gilbert','Dublanc','Bernard-Arneau','bernard2@wanadoo.fr','blablabla');
INSERT INTO USERS (email, encrypted_password)
    VALUES ('jean@mail.com','blablabla');
INSERT INTO USERS (email, encrypted_password)
    VALUES ('a@mail.com','aqwzsxed');


DROP TABLE IF EXISTS LISTE CASCADE;
CREATE TABLE LISTE(
    ID SERIAL PRIMARY KEY,
    username VARCHAR(25), -- Nom de l'utilisateur à qui appartient la liste de tâches
    titre VARCHAR(60),
    created_at timestamp default current_timestamp
    --je mets le jour de création c'est gratuit
);

INSERT INTO LISTE (username, titre) VALUES ('toto', 'Plan pour battre PtitChibrax');
INSERT INTO LISTE (username, titre) VALUES ('Gilbert', 'Terminer le projet');

DROP TABLE IF EXISTS TACHE CASCADE;
CREATE TABLE TACHE(
    ID SERIAL PRIMARY KEY,
    idListe INTEGER REFERENCES LISTE(ID) ON DELETE CASCADE,
    titre VARCHAR(60), 
    echeance DATE, -- Date d'échéance de la tâche
    note VARCHAR(300), -- Texte de description de la tâche
    fait BOOLEAN, -- La tâche est-elle terminée ?
    created_at timestamp default current_timestamp
);

INSERT INTO TACHE (idListe, titre, echeance, note, fait) 
VALUES (1, 'Battre PtitChibrax', '2020-05-18','Entrainer sa brute tous les jours', FALSE);

INSERT INTO TACHE (idListe, titre, echeance, note, fait) 
VALUES (1, 'Battre PtitChibrax 1', '2020-05-18','Entrainer sa brute tous les jours', FALSE);


INSERT INTO TACHE (idListe, titre, echeance, note, fait) 
VALUES (2, 'Battre PtitChibrax2', '2020-05-18','Entrainer sa brute tous les jours2', FALSE);

DROP TABLE IF EXISTS SOUSTACHE CASCADE;
CREATE TABLE SOUSTACHE(
    ID SERIAL PRIMARY KEY,
    idTache INTEGER REFERENCES TACHE(ID) ON DELETE CASCADE,
    titre VARCHAR(60),
    fait BOOLEAN, 
    created_at timestamp default current_timestamp
);

INSERT INTO SOUSTACHE (idTache, titre, fait) 
VALUES (1, 'Rythme1', FALSE);
INSERT INTO SOUSTACHE (idTache, titre, fait) 
VALUES (1, 'Tactique1', FALSE);
INSERT INTO SOUSTACHE (idTache, titre, fait) 
VALUES (2, 'Tactique2', FALSE);