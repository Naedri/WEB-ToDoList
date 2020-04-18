import React, { useState } from "react";
import '../css/styleUser.css' ;

const LogIn = (props) => {

    const [form, setValues] = useState({
        username: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        username: false,
        password: false
    });

    // eslint-disable-next-line 
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const printValues = e => {
        e.preventDefault();
        if (validateForm(errors))
            console.log(form.username, form.password);
        
    };

    const handleChange = e => {
        const { name, value } = e.target; //e objet prend la cible de l evenement donc l objet sur lequel l evenement s est declecnhé (avec un name definie dans le html et une value définie par l'évènements)
        let err = errors;
        switch (name) {
            case 'username':
                err =
                    !value.trim()
                        ? 'Veuillez renseigner une adresse e-mail'
                        : !validEmailRegex.test(value) ? 'L adresse e-mail n est pas valide'
                            : value.length > 48 ? 'Elle doit contenir moins de 50 caractères'
                                : '' ;
                break;
            case 'password':
                err =
                    !value ? "Veuillez renseigner un mot de passe"
                         : value.length < 8 ? 'Il doit contenir au moins 8 caractères'
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : '';
                break;
            default:
                break;
        }

        setValues({
            ...form,
            [name]: value //name est soit password, soit username (name) et l un des deux prendra comme valeur (value) err
        });
        setErrors({
            ...errors,
            [name]: err //name est soit password, soit username (name) et l un des deux prendra comme valeur (value) err
        });
    };

    return (
        <div className="container">
            <div className="row"> 

                <div className="auth-wrapper mt-2">

                    <form onSubmit={printValues}>

                        <div className="form-group">
                            <label htmlFor="username"> 
                                Adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"
                                
                                value={form.username}
                                id="username"
                                name="username"
                                onChange={handleChange}
                            />
                            {errors.username &&
                                <small 
                                    id="mailNull"
                                    className='form-text text-error'>
                                        {errors.username}
                                </small>
                            }
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"

                                value={form.password}
                                id="password"
                                name="password"
                                onChange={handleChange}
                            />
                            {errors.password &&
                                <small 
                                    id="passwordNull"
                                    className='form-text text-error'>
                                        {errors.password}
                                </small>
                            }
                        </div>

                        <div className="form-group">
                            <button type="submit" disabled={form.username==="" || form.password==="" } className="btn btn-primary btn-lg btn-block">
                                Connnexion
                            </button>
                        </div>

                        <div className="form-group">
                            <a href="forgetpassword" className="form-text form-text--alt">J'ai oublié mon mot de passe</a>
                            <a href="signup" className="form-text form-text--alt">Pas encore de compte ? Inscrivez-vous !</a>
                        </div>


                    </form>
                </div>

            </div>
        </div>

    );
}

export default LogIn;