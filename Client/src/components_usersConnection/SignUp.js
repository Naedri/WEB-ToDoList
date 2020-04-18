import React, { useState } from "react";
import '../css/styleUser.css' ;
import { isFreeUserApi } from '../api.js';


const SignUp = (props) => {

    const [form, setValues] = useState({
        email: "",
        password: "",
        password2: "",
        emailBusy:""
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        password2: "",
        emailBusy: ""
    });

    // eslint-disable-next-line
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0 
        );
        return valid;
    }

    const try_signup = async (e) =>  {
        e.preventDefault();
        if (validateForm(errors)){
            try {
                let status = await isFreeUserApi(form.email) ;
                console.log(status);
                if (status){
                    setErrors({
                        ...errors,
                        emailBusy: 'coucou c est ok'
                    });
                } else {
                    setErrors({
                        ...errors,
                        emailBusy: 'Cette adresse e-mail est déjà utilisée'
                    });
                }
            }
            catch (err) {
                console.log(err);
                setErrors(err.message);
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        let err = errors;
        switch (name) {
            case 'email':
                err =
                    !value.trim() ? 'Veuillez renseigner une adresse e-mail'
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
            case 'password2':
                err =
                    value===form.password ? ''
                        : 'Les mots de passe ne correspondent pas';
                break;
            default:
                break;
        }

        setValues({
            ...form,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: err
        });
    };
/*
    if (isLoading)
    return (<p>Loading ...</p>)
*/

    return (
        <div className="container">
            <div className="row"> 
​
                <div className="auth-wrapper mt-2">
​
                    <form onSubmit={try_signup}>
​
                        <div className="form-group">
                            <label htmlFor="email"> 
                                Adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"
                                
                                value={form.email}
                                id="email"
                                name="email"
                                onChange={handleChange}
                            />
                            {errors.email &&
                                <small 
                                    id="mailNull"
                                    className='form-text text-error'>
                                        {errors.email}
                                </small>
                            }
                            {errors.emailBusy &&
                                <small 
                                    id="mailUsed" 
                                    className="form-text text-error ">
                                       {errors.emailBusy}
                                </small>
                            }
                        </div>
​
                        <div className="form-group">
                            <label htmlFor="password">
                                Mot de passe
                            </label>
​
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
​
                        
                        <div className="form-group">
                            <label htmlFor="password2">
                                Répétez le mot de passe
                            </label>
​
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"

                                value={form.password2}
                                id="password2"
                                name="password2"
                                onChange={handleChange}
                            />
                            {errors.password2 &&
                                <small 
                                    id="passwordDifferent"
                                    className='form-text text-error'>
                                        {errors.password2}
                                </small>
                            }
                        </div>

                        <button type="submit" 
                            disabled={ form.email==="" || form.password==="" || form.password2==="" || form.password!==form.password2 } 
                            className="btn btn-primary btn-lg btn-block">
                                Inscription
                        </button>

                        <div className="form-group">
                            <a href="login" className="form-text form-text--alt">
                                Vous avez déjà un compte ?<br></br>Connectez-vous !</a>
                        </div>

                    </form>
                </div>

            </div>
        </div>

    );
}

export default SignUp;