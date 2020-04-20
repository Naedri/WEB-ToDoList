DROP TABLE IF EXISTS USERS;
CREATE TABLE USERS (
  IdUser SERIAL,
  email VARCHAR(50)  CONSTRAINT NN_email NOT NULL,
  encrypted_password VARCHAR(60) CONSTRAINT NN_password NOT NULL,
  created_at timestamp
);
ALTER TABLE USERS ADD CONSTRAINT PK_IdUser PRIMARY KEY (IdUser) ;
ALTER TABLE USERS ADD CONSTRAINT U_MailUser UNIQUE (email) ;
ALTER TABLE USERS ALTER created_at SET DEFAULT current_timestamp ;  

INSERT INTO USERS (email, encrypted_password)
    VALUES ('a@mail.com','aqwzsxed');

SELECT * FROM USERS ;

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

/*HISTORIQUE_EMAIL*/

DROP TABLE IF EXISTS HISTORIQUE_EMAIL;
CREATE TABLE HISTORIQUE_EMAIL (
	H_Id_email SERIAL,
	H_IdUser INTEGER CONSTRAINT NN_iduser NOT NULL,
	update_at timestamp,
	NEW_EMAIL VARCHAR(50) CONSTRAINT NN_NEW_EMAIL NOT NULL,
	OLD_EMAIL VARCHAR(50) CONSTRAINT NN_OLD_EMAIL NOT NULL
	);

ALTER TABLE HISTORIQUE_EMAIL ADD CONSTRAINT PK_H_Id_email PRIMARY KEY (H_Id_email) ;
ALTER TABLE HISTORIQUE_EMAIL ALTER update_at SET DEFAULT current_timestamp ;  


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
		
		userId = IdUser ;
		pwdNew = NEW.encrypted_password ;
		pwdOld = OLD.encrypted_password ;
		
		INSERT INTO HISTORIQUE_PWD (H_IdUser, NEW_PWD, OLD_PWD) 
			VALUES ( userId, pwdNew, pwdOld );
	END;
$F_USERS_PWD_UPDATE$ LANGUAGE plpgsql ;

CREATE TRIGGER T_HISTORIQUE_PWD
	BEFORE UPDATE OF encrypted_password ON USERS
	FOR EACH ROW
	WHEN (OLD.encrypted_password IS DISTINCT FROM NEW.encrypted_password)
	EXECUTE PROCEDURE F_USERS_PWD_UPDATE();


/*test*/
SELECT * FROM HISTORIQUE_PWD ;
SELECT * FROM USERS ;

UPDATE USERS SET encrypted_password = 'nouveaucestmoi' WHERE IdUser = '1' ;
SELECT * FROM USERS ;
SELECT * FROM HISTORIQUE_PWD ;

/*GET DETAILS*/

/*procedure get email from id*/
CREATE OR REPLACE FUNCTION P_USERS_GET_EMAIL(userId INTEGER)
	LANGUAGE SQL
	AS $$
	INSERT INTO HISTORIQUE_PWD (H_IdUser, NEW_PWD, OLD_PWD) 
			VALUES ( userId, pwdNew, pwdOld );
	$$;

/*UPDATE DETAILS */

/*procedure updating of pwd*/
CREATE OR REPLACE PROCEDURE P_USERS_PWD_UPDATE (userId INTEGER, pwdNew TEXT)
	LANGUAGE SQL
	AS $$
	UPDATE USERS SET encrypted_password = pwdNew WHERE IdUser = userId ;
	$$;
	
SELECT * FROM USERS ;
CALL P_USERS_PWD_UPDATE(1, 'badaboupm') ;
SELECT * FROM USERS ;