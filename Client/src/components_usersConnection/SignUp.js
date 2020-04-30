import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import { Ripple } from 'react-spinners-css';
import { isFreeUserApi, createUserApi } from '../api.js';
import '../css/styleUser.css';


const SignUp = (props) => {

    const [form, setValues] = useState({
        email: '',
        password: '',
        password2: '',
        isLoading: '',
        isCreate: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
        password2: '',
    });

    // eslint-disable-next-line
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }

    const endLoading = () => {
        setValues({
            ...form,
            isLoading: '',
        });
    };

    const startLoading = () => {
        setValues({
            ...form,
            isLoading: 'Chargement...',
            isCreate: '',
        });
    };

    let history = useHistory();

    const try_signup = async (e) => {
        e.preventDefault();

        if (validateForm(errors)) {
            try {
                startLoading();

                let statusFree = await isFreeUserApi(form.email);
                if (statusFree) {
                    try {
                        await createUserApi(form.email, form.password);
                        setValues({
                            ...form,
                            isCreate: 'created',
                            isLoading: '',
                        });

                        let url = "/login";
                        setTimeout(() => {
                            history.push(url);
                            }, 1000);
                    }
                    catch (err) {
                        //setErrors(err.message);
                        console.log(err);
                        setErrors({
                            ...errors,
                            isCreate: 'not created',
                        });
                        endLoading();
                    }
                } else {
                    setErrors({
                        ...errors,
                        email: 'Cette adresse e-mail est déjà utilisée',
                    });
                    endLoading();
                }
            }
            catch (err) {
                //setErrors(err.message);
                console.log(err);
                setErrors({
                    ...errors,
                    isCreate: 'not created',
                });
                endLoading();
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
                            : value.length > 25 ? 'Elle doit contenir moins de 25 caractères'
                                : '';
                setErrors({
                    ...errors,
                    [name]: err,
                });
                break;
            case 'password':
                err =
                    !value ? "Veuillez renseigner un mot de passe"
                        : value.length < 8 ? 'Il doit contenir au moins 8 caractères'
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : '';
                if (form.password2!==''){
                    if (err===''){
                        err = 
                            value!==form.password2 ?  'Les mots de passe ne correspondent pas'
                                : '';
                        setErrors({
                            ...errors,
                            password: '',
                            password2: err,
                        });
                    } else {
                        if (value !== form.password2){
                            setErrors({
                                ...errors,
                                [name]: err,
                            });
                        } else {
                            setErrors({
                                ...errors,
                                password: err,
                                password2: '',
                            });
                        }
                    }
                } else {
                    setErrors({
                        ...errors,
                        [name]: err,
                    });
                }
                break;
            case 'password2':
                err =
                    value === form.password ? ''
                        : 'Les mots de passe ne correspondent pas';
                setErrors({
                    ...errors,
                    [name]: err,
                });
                break;
            default:
                break;
        }
        if (name === 'email' || name === 'password' || name === 'password2') {
            setValues({
                ...form,
                [name]: value,
                isCreate: '',
                isLoading: '',
            });
        }
    };

    const checkSubmitDisabled = () => {
        return ((!validateForm(errors)) || form.isLoading || form.email === '' || form.password === '' || form.password2 === '' || form.password !== form.password2 || form.isCreate !== '');
    }

    return (
        <div className="container">
            <div className="row justify-content-center py-5 my-5">
                <div className="col-sm col-md-6 col-lg-4">
                    <form onSubmit={try_signup}>
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
                            <label htmlFor="password2">
                                Répétez le mot de passe
                            </label>

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
                        <div className="form-group">
                            <button type="submit"
                                disabled={checkSubmitDisabled()}
                                className="btn btn-primary btn-lg btn-block">
                                Inscription
                          </button>
                            {form.isLoading !== '' &&
                                <div className="loadingSpinner" >
                                    <Ripple
                                        color={'#fd7e14'}
                                        size={50}
                                    />
                                </div>
                            }
                            {form.isCreate === 'created' &&
                                <small
                                    id="isCreate"
                                    name="isCreate"
                                    className='form-text text-valide'>
                                    Un email de confirmation vous a été envoyé !
                                </small>
                            }
                            {form.isCreate === 'not created' &&
                                <small
                                    id="isCreate"
                                    name="isCreate"
                                    className='form-text text-error'>
                                    Une erreur est survenue !                                    
                                </small>
                            }
                        </div>
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