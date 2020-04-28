import React, { useState } from "react";
import { Ripple } from 'react-spinners-css';
import { isFreeUserApi, updateEmailUserApi, updatePwdUserApi } from '../api.js';
import '../css/styleUser.css';


const UpdatingDetails = (props) => {

    let userCurrentEmail = 'a@mail.com';                
    //let userCurrentEmail = JSON.parse(localStorage.getItem('user'))

    const [form, setValues] = useState({
        email1: '',
        email2: '',
        password: '',
        password1: '',
        password2: '',
        isLoadingMail: '',
        isLoadingPwd: '',
        isUpdateMail: '',
        isUpdatePwd: '',

    });
    const [errors, setErrors] = useState({
        email1: '',
        email2: '',
        password: '',
        password1: '',
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
            isLoadingPwd: '',
            isLoadingMail: '',
        });
    };

    const startLoading = (name) => {
        switch (name){
            case 'mail' :
                setValues({
                    ...form,
                    isLoadingMail: 'Chargement...',
                    isUpdateMail: '',
                });
                break;
            case 'pwd' :
                setValues({
                    ...form,
                    isLoadingPwd: 'Chargement...',
                    isUpdatePwd: '',
                });
                break;
            default:
                break;
        }
    };

    const try_updating_email = async (e) => {
        e.preventDefault();

        if (validateForm(errors)) {
            try {
                startLoading('mail');

                let statusFree = await isFreeUserApi(form.email1);
                if (statusFree) {
                    try {
                        let statusUpdate = await updateEmailUserApi(userCurrentEmail, form.email2);
                        if(statusUpdate.email1Found==='found'){
                            setValues({
                                ...form,
                                isUpdateMail: 'Un email de confirmation vous a été envoyé',
                                isLoadingMail: '',
                                email1: '',
                                email2: '',
                            });
                        } else {
                            setErrors({
                                ...errors,
                                email1: "Problème d'envoie de l'email d'origine !",
                            });
                            endLoading();
                        }
                    }
                    catch (err) {
                        console.log(err);
                        setErrors(err.message);
                        endLoading();
                    }
                } else {
                    setErrors({
                        ...errors,
                        email1: 'Cette adresse e-mail est déjà utilisée',
                    });
                    endLoading();
                }
            } catch (err) {
                console.log(err);
                setErrors(err.message);
                endLoading();
            }
        }
    };

    const try_updating_password = async (e) => {
        e.preventDefault();
        if (validateForm(errors)) {
            startLoading('pwd');
            try {
                let statusUpdate = await updatePwdUserApi(userCurrentEmail, form.password, form.password2 );
                if (statusUpdate.password==='valide') {
                    if(statusUpdate.password2==='updated') {
                        setValues({
                            ...form,
                            isUpdatePwd: 'Votre mot de passe a été mis à jour',
                            isLoadingPwd: '',
                            password:'',
                            password1:'',
                            password2:'',
                        });
                    } else {
                        setErrors({
                            ...errors,
                            password1: "Problème de mise à jour du mot de passe !",
                        });
                        endLoading();
                    }
                } else {
                    setErrors({
                        ...errors,
                        password: "Problème d'indentifiants !",
                    });
                    endLoading();   
                }
            } catch (err) {
                console.log(err);
                setErrors(err.message);
                endLoading();
            }
        }
    };

    const handleChange = e => {
        const { name, value } = e.target;
        let err = errors;
        switch (name) {
            case 'email1':
                err =
                    !value.trim() ? 'Veuillez renseigner une adresse e-mail'
                        : !validEmailRegex.test(value) ? 'L adresse e-mail n est pas valide'
                            : value.length > 48 ? 'Elle doit contenir moins de 50 caractères'
                                : value === userCurrentEmail ? 'La nouvelle adresse doit être nouvelle'
                                    : '';
                break;
            case 'email2':
                    err =
                        value !== form.email1 ? ''
                            : 'Les adresse mail ne correspondent pas';
                break;
            case 'password':
                    err =
                        !value ? "Veuillez renseigner votre mot de passe"
                                    : '';
                break;
            case 'password1':
                err =
                    !value ? "Veuillez renseigner un mot de passe"
                        : value.length < 8 ? 'Il doit contenir au moins 8 caractères'
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : value === form.password ? 'Le nouveau mot de passe doit être nouveau'
                                    : '';
                break;
            case 'password2':
                err =
                    value === form.password1 ? ''
                        : 'Les mots de passe ne correspondent pas';
                break;
            default:
                break;
        }
        if (name === 'email1' || name ==='email2' || name === 'password' || name === 'password1' || name === 'password2') {
            setValues({
                ...form,
                [name]: value,
                isUpdateMail: '',
                isUpdatePwd: '',
                isLoadingMail: '',
                isLoadingPwd: '',
            });
            setErrors({
                ...errors,
                [name]: err,
            });
        }
    };

    const checkSubmitDisabled = (name) => {
        let disabled = true;
        switch (name){
            case 'mail' :
                disabled = (form.isLoadingMail || form.email1 === '' || form.email2 === '' || form.email1 !== form.email2);
                break;
            case 'pwd' :
                disabled = (form.isLoadingPwd || form.password === '' || form.password1 === '' || form.password2 === '' || form.password1 !== form.password2);
                break;
            default :
                break;
        }
        return disabled ;
    }

    return (
        <div className="container">
            <div className="row justify-content-center py-5 my-5">
                <div className="col-sm col-md-6 col-lg-4">
                    <form onSubmit={try_updating_email}>
                        <div className="form-group">
                            <h2>Adresse e-mail</h2>
                            <label htmlFor="email1">
                                Nouvelle adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"
                                value={form.email1}
                                id="email1"
                                name="email1"
                                onChange={handleChange}
                            />
                            {errors.email1 &&
                                <small
                                    className='form-text text-error'>
                                    {errors.email1}
                                </small>
                            }
                            <label htmlFor="email2">
                                Confirmer l'adresse e-mail
                                </label>
                            <input
                                type="mail"
                                className="form-control"
                                placeholder="mail@provider"
                                value={form.email2}
                                id="email2"
                                name="email2"
                                onChange={handleChange}
                            />
                            {errors.email2 &&
                                <small
                                    id="mailNull"
                                    className='form-text text-error'>
                                    {errors.email2}
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <button type="submit"
                                disabled={checkSubmitDisabled('mail')}
                                className="btn btn-primary btn-lg btn-block">
                                Modifier l'adresse e-mail
                          </button>
                            {form.isLoadingMail !== '' &&
                                <div className="loadingSpinner" >
                                    <Ripple
                                        color={'#fd7e14'}
                                        size={50}
                                    />
                                </div>
                            }
                            {form.isUpdateMail !== '' &&
                                <small
                                    id="isUpdateMail"
                                    name="isUpdateMail"
                                    className='form-text text-valide'>
                                    {form.isUpdateMail}
                                </small>
                            }
                        </div>
                    </form>
                    <form onSubmit={try_updating_password}>
                        <div className="form-group">
                            <h2>Mot de passe</h2>
                            <label htmlFor="password">
                                Mot de passe actuel
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
                                    className='form-text text-error'>
                                    {errors.password}
                                </small>
                            }
                            <label htmlFor="password1">
                                Nouveau mot de passe
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"

                                value={form.password1}
                                id="password1"
                                name="password1"
                                onChange={handleChange}
                            />
                            {errors.password1 &&
                                <small
                                    className='form-text text-error'>
                                    {errors.password1}
                                </small>
                            }
                            <label htmlFor="password2">
                                Confirmer le nouveau mot de passe
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
                                    className='form-text text-error'>
                                    {errors.password2}
                                </small>
                            }
                        </div>
                        <div className="form-group">
                            <button type="submit"
                                disabled={checkSubmitDisabled('pwd')}
                                className="btn btn-primary btn-lg btn-block">
                                Modifier le mot de passe
                          </button>
                            {form.isLoadingPwd !== '' &&
                                <div className="loadingSpinner" >
                                    <Ripple
                                        color={'#fd7e14'}
                                        size={50}
                                    />
                                </div>
                            }
                            {form.isUpdatePwd !== '' &&
                                <small
                                    id="isUpdatePwd"
                                    name="isUpdatePwd"
                                    className='form-text text-valide'>
                                    {form.isUpdatePwd}
                                </small>
                            }
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdatingDetails;