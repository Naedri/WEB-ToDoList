import React, { useState } from "react";
import { Redirect } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';
import { authenticateUserApi } from '../api.js';
import '../css/styleUser.css' ;

const LogIn = (props) => {

    const [form, setValues] = useState({
        email: '',
        password: '',
        isLoading: '',
        isConnected: '',
        identifiers: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const [redirect, setRedirect] = useState(false);
    // eslint-disable-next-line 
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const startLoading = () => {
        setValues({
            ...form,
            isLoading: 'Chargement...',
            isConnected: '',
        });
    }

    const try_login = async (e) => {
        e.preventDefault();

        if (validateForm(errors)) {
            try {
                startLoading();

                let data = await authenticateUserApi(form.email, form.password);
                if (data.state){
                    setValues({
                        ...form,
                        isConnected: `Bienvenue user ${data.userId} !`,
                        isLoading: '',
                    });
                    localStorage.setItem('user', JSON.stringify(data.email));
                    localStorage.setItem('token', JSON.stringify(data.token));
                    /*let url = `/home/${data.userId}`;*/
                    //let url = "/home";
                    //history.push(url);
                    setTimeout(() => {
                        setRedirect(true);
                        }, 1000);
                } else {
                    setValues({
                        ...form,
                        identifiers: 'Identifiants incorrects',
                        isLoading: '',
                    });
                }
            }
            catch (err) {
                setErrors(err.message);
                setValues({
                    ...form,
                    identifiers: 'Identifiants incorrects',
                    isLoading: '',
                });            }
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
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : '';
                break;
            default:
                break;
        }
        if (name === 'email' || name === 'password') {
            setValues({
                ...form,
                [name]: value,
                isConnected: '',
                isLoading: '',
                identifiers: '',
            });
            setErrors({
                ...errors,
                [name]: err,
            });
        }
    };

    
    const checkSubmitDisabled = () => {
        return (form.isLoading || form.email === '' || form.password === '');
    }
    if (redirect)
        return <Redirect  to="/"/>;

    return (
        <div className="container">
            <div className="row justify-content-center py-5 my-5">
                <div className="col-sm col-md-6 col-lg-4">
                    <form onSubmit={try_login}>
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
                            {form.identifiers !== '' &&
                                <div
                                    id="identifiers"
                                    name="identifiers"
                                    className='form-text text-error'>
                                    {form.identifiers}
                                </div>
                            }
                            {form.isConnected !== '' &&
                                <div
                                    id="isConnected"
                                    name="isConnected"
                                    className='form-text text-valide'>
                                    {form.isConnected}
                                </div>
                            }
                            <button type="submit" 
                                disabled={checkSubmitDisabled()} 
                                className="btn btn-primary btn-lg btn-block">
                                Connnexion
                            </button>
                            {form.isLoading !== '' &&
                                <div className="loadingSpinner" >
                                    <Ripple
                                        color={'#fd7e14'}
                                        size={50}
                                    />
                                </div>
                            }
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