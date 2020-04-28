DROP TABLE IF EXISTS USERS ;
CREATE TABLE USERS (
  IdUser SERIAL PRIMARY KEY,
  username VARCHAR(25),
  firstname VARCHAR(25),
  lastname VARCHAR(25),
  email VARCHAR(50)  CONSTRAINT NN_email NOT NULL,
  encrypted_password VARCHAR(60) CONSTRAINT NN_password NOT NULL,
  created_at timestamp default current_timestamp
);

ALTER TABLE USERS ADD CONSTRAINT U_MailUser UNIQUE (email) ;

INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
    VALUES ('toto','Bernard','Dublanc','toto@yopmail.com','blablabla');
INSERT INTO USERS (username, firstname, lastname, email, encrypted_password)
    VALUES ('Gilbert','Dublanc','Bernard-Arneau','ba@yopmail.com','blablabla');
INSERT INTO USERS (email, encrypted_password)
    VALUES ('jean@yopmail.com','blablabla');
INSERT INTO USERS (email, encrypted_password)
    VALUES ('a@yopmail.com','aqwzsxed');

DROP TABLE IF EXISTS LISTE CASCADE;
CREATE TABLE LISTE(
    ID SERIAL PRIMARY KEY,
    email VARCHAR(25), -- Nom de l'utilisateur à qui appartient la liste de tâches
    titre VARCHAR(60),
    created_at timestamp default current_timestamp
    --je mets le jour de création c'est gratuit
);

INSERT INTO LISTE (email, titre) VALUES ('a@mail.com', 'Plan pour battre PtitChibrax');
INSERT INTO LISTE (email, titre) VALUES ('jean@mail.com', 'Terminer le projet');

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




/*LIMIT_MAX de la capcité des tables*/

DROP TABLE IF EXISTS LIMIT_MAX ;
CREATE TABLE LIMIT_MAX (
  IdLimit_max SERIAL,
  name VARCHAR(25) CONSTRAINT NN_Name NOT NULL,
  capacity INTEGER CONSTRAINT NN_Capacity NOT NULL,
  created_at timestamp
	);

ALTER TABLE LIMIT_MAX ADD CONSTRAINT PK_IdLimit_max PRIMARY KEY (IdLimit_max) ;
ALTER TABLE LIMIT_MAX ALTER created_at SET DEFAULT current_timestamp ;  

INSERT INTO LIMIT_MAX (name, capacity)
    VALUES ('NB_Users',30);
INSERT INTO LIMIT_MAX (name, capacity)
    VALUES ('NB_List_By_Users',10);
INSERT INTO LIMIT_MAX (name, capacity)
    VALUES ('NB_Task_By_List',8);

SELECT * FROM LIMIT_MAX ;

/*HISTORIQUE_PWD*/

DROP TABLE IF EXISTS HISTORIQUE_PWD;
CREATE TABLE HISTORIQUE_PWD (
	H_Id_pwd SERIAL,
	H_IdUser INTEGER CONSTRAINT NN_iduser_h NOT NULL,
	update_at timestamp,
	NEW_PWD VARCHAR(60) CONSTRAINT NN_NEW_PWD NOT NULL,
	OLD_PWD VARCHAR(60) CONSTRAINT NN_OLD_PWD NOT NULL
	);
ALTER TABLE HISTORIQUE_PWD ADD CONSTRAINT PK_H_Id_pwd PRIMARY KEY (H_Id_pwd) ;
ALTER TABLE HISTORIQUE_PWD ALTER update_at SET DEFAULT current_timestamp ;  

/*T_HISTORIQUE_PWD*/
DROP TRIGGER IF EXISTS T_HISTORIQUE_PWD ON USERS ;

CREATE OR REPLACE FUNCTION F_USERS_PWD_UPDATE() RETURNS TRIGGER
AS  $F_USERS_PWD_UPDATE$
	DECLARE
		userId 	INTEGER;
		pwdNew 	TEXT; 
		pwdOld 	TEXT;
	BEGIN
		-- pwdNew can not be null
		IF NEW.encrypted_password IS NULL THEN
			RAISE EXCEPTION 'new encrypted_password cannot be null';
		END IF;
		-- pwd old and new should be different can not be null
		IF OLD.encrypted_password = NEW.encrypted_password THEN
			RAISE EXCEPTION  'old and new encrypted_password should be different';
		END IF;

		SELECT NEW.IdUser INTO userId FROM USERS ;
		pwdNew = NEW.encrypted_password ;
		pwdOld = OLD.encrypted_password ;
		
		INSERT INTO HISTORIQUE_PWD (H_IdUser, NEW_PWD, OLD_PWD) 
			VALUES ( userId, pwdNew, pwdOld );
		RETURN NULL;
	END;
$F_USERS_PWD_UPDATE$ LANGUAGE plpgsql ;

CREATE TRIGGER T_HISTORIQUE_PWD
	AFTER UPDATE OF encrypted_password ON USERS
	FOR EACH ROW
	WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
	EXECUTE FUNCTION F_USERS_PWD_UPDATE();

/*procedure updating of pwd*/
CREATE OR REPLACE PROCEDURE P_USERS_PWD_UPDATE (userId INTEGER, pwdNew TEXT)
	LANGUAGE plpgsql
	AS $$
	DECLARE
		pwdOld 	TEXT;
	BEGIN
		SELECT encrypted_password INTO pwdOld FROM USERS WHERE IdUser = userId ;
		IF pwdOld <> pwdNew THEN 
			UPDATE USERS SET encrypted_password = pwdNew WHERE IdUser = userId ;
		END IF; 
	END ;
	$$;

/*procedure get pwd from id*/
CREATE OR REPLACE FUNCTION P_USERS_GET_PWD (userId INTEGER) RETURNS TEXT
	AS $$
	DECLARE 
		pwd	TEXT ;
	BEGIN
		SELECT encrypted_password INTO pwd FROM USERS WHERE IdUser = userId ;
		RETURN pwd ;
	END ;
	$$ 	LANGUAGE plpgsql ;


/*test*/
SELECT * FROM HISTORIQUE_PWD ;
SELECT * FROM USERS ;

CALL P_USERS_PWD_UPDATE( 1 , 'azertyuiop');

SELECT * FROM USERS ;
SELECT * FROM HISTORIQUE_PWD ;






/*HISTORIQUE_MAIL*/

DROP TABLE IF EXISTS HISTORIQUE_MAIL;
CREATE TABLE HISTORIQUE_MAIL (
	H_Id_mail SERIAL,
	H_IdUser INTEGER CONSTRAINT NN_iduser_h NOT NULL,
	update_at timestamp,
	NEW_MAIL VARCHAR(60) CONSTRAINT NN_NEW_MAIL NOT NULL,
	OLD_MAIL VARCHAR(60) CONSTRAINT NN_OLD_MAIL NOT NULL
	);
ALTER TABLE HISTORIQUE_MAIL ADD CONSTRAINT PK_H_Id_mail PRIMARY KEY (H_Id_mail) ;
ALTER TABLE HISTORIQUE_MAIL ALTER update_at SET DEFAULT current_timestamp ;  

/*T_HISTORIQUE_MAIL*/
DROP TRIGGER IF EXISTS T_HISTORIQUE_MAIL ON USERS ;

CREATE OR REPLACE FUNCTION F_USERS_MAIL_UPDATE() RETURNS TRIGGER
AS  $F_USERS_MAIL_UPDATE$
	DECLARE
		userId 	INTEGER;
		mailNew 	TEXT; 
		mailOld 	TEXT;
	BEGIN
		-- mailNew can not be null
		IF NEW.email IS NULL THEN
			RAISE EXCEPTION 'new email cannot be null';
		END IF;
		-- mail old and new should be different can not be null
		IF OLD.email = NEW.email THEN
			RAISE EXCEPTION  'old and new email should be different';
		END IF;

		SELECT NEW.IdUser INTO userId FROM USERS ;
		mailNew = NEW.email ;
		mailOld = OLD.email ;
		
		--audit action
		INSERT INTO HISTORIQUE_MAIL (H_IdUser, NEW_MAIL, OLD_MAIL) 
			VALUES ( userId, mailNew, mailOld );
		--updating list data
		UPDATE LISTE SET email = mailNew WHERE email = mailOld ;

		RETURN NULL;
	END;
$F_USERS_MAIL_UPDATE$ LANGUAGE plpgsql ;

CREATE TRIGGER T_HISTORIQUE_MAIL
	AFTER UPDATE OF email ON USERS
	FOR EACH ROW
	WHEN (OLD.email IS DISTINCT FROM NEW.email)
	EXECUTE FUNCTION F_USERS_MAIL_UPDATE();

/*procedure updating of mail*/
CREATE OR REPLACE PROCEDURE P_USERS_MAIL_UPDATE (userId INTEGER, mailNew TEXT)
	LANGUAGE plpgsql
	AS $$
	DECLARE
		mailOld 	TEXT;
	BEGIN
		SELECT email INTO mailOld FROM USERS WHERE IdUser = userId ;
		IF mailOld <> mailNew THEN 
			UPDATE USERS SET email = mailNew WHERE IdUser = userId ;
		END IF; 
	END ;
	$$;

/*procedure get mail from id*/
CREATE OR REPLACE FUNCTION P_USERS_GET_MAIL (userId INTEGER) RETURNS TEXT
	AS $$
	DECLARE
		mail 	TEXT;
	BEGIN
		SELECT email INTO mail FROM USERS WHERE IdUser = userId ;
		RETURN mail ;
	END ;
	$$ 	LANGUAGE plpgsql;

/*procedure get id from email*/
CREATE OR REPLACE FUNCTION P_USERS_GET_ID (emailTarget TEXT) RETURNS INTEGER
	AS $$
	DECLARE
		id 		INTEGER;
	BEGIN
		SELECT IdUser INTO id FROM USERS WHERE email = emailTarget ;
		RETURN id ;
	END ;
	$$ 	LANGUAGE plpgsql;


/*test*/
SELECT * FROM HISTORIQUE_MAIL ;
SELECT * FROM USERS ;

CALL P_USERS_MAIL_UPDATE( 1 , 'lapincnfd@mail.com');

SELECT * FROM HISTORIQUE_MAIL ;
SELECT * FROM USERS ;

