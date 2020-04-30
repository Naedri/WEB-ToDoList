import React, { useState } from "react";
import { Ripple } from 'react-spinners-css';
import { isFreeUserApi, updateEmailUserApi, updatePwdUserApi } from '../api.js';
import '../css/styleUser.css';


const UpdatingDetails = (props) => {

    let userCurrentEmail = props.mail;

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

    /*
    const validateForm = (errors) => {
        let valid = Object.values(errors).every(
            (val) => val.length === 0
        );
        return valid;
    }
    */
    const validateForm_mail= (errors) => {
        return errors.email1 === '' && errors.email2==='';
    }
    const validateForm_pwd = (errors) => {
        return errors.password === '' && errors.password1==='' && errors.password2==='';
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

        if (validateForm_mail(errors)) {
            try {
                startLoading('mail');

                let newMail = form.email1;
                let statusFree = await isFreeUserApi(newMail);
                if (statusFree) {
                    try {
                        let statusUpdate = await updateEmailUserApi(userCurrentEmail, newMail);
                        if(statusUpdate.state==='updated' && statusUpdate.inbox==='sent'){
                            props.updateMail(newMail);
                            setValues({
                                ...form,
                                isUpdateMail: 'updated',
                                isLoadingMail: '',
                                email1: '',
                                email2: '',
                            });
                        } else {
                            setValues({
                                ...form,
                                isUpdateMail: 'not updated',
                                isLoadingMail: '',
                                email1: '',
                                email2: '',
                            });
                        }
                    }
                    catch (err) {
                        //setErrors(err.message);
                        console.log(err);
                        setValues({
                            ...form,
                            isUpdateMail: 'not updated',
                            isLoadingMail: '',
                            email1: '',
                            email2: '',
                        });
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
                //setErrors(err.message);
                console.log(err);
                setValues({
                    ...form,
                    isUpdateMail: 'not updated',
                    isLoadingMail: '',
                    email1: '',
                    email2: '',
                });
                endLoading();
            }
        }
    };

    const try_updating_password = async (e) => {
        e.preventDefault();
        if (validateForm_pwd(errors)) {
            try {
                startLoading('pwd');

                let statusUpdate = await updatePwdUserApi(userCurrentEmail, form.password, form.password2 );
                if (statusUpdate.password==='valide') {
                    if(statusUpdate.password2==='updated') {
                        setValues({
                            ...form,
                            isUpdatePwd: 'updated',
                            isLoadingPwd: '',
                            password:'',
                            password1:'',
                            password2:'',
                        });
                    } else {
                        setValues({
                            ...form,
                            isUpdatePwd: 'not updated',
                            isLoadingPwd: '',
                            password:'',
                            password1:'',
                            password2:'',
                        });
                    }
                } else {
                    setErrors({
                        ...errors,
                        password: "Problème d'indentifiants !",
                    });
                    endLoading();   
                }
            } catch (err) {
                //setErrors(err.message);
                console.log(err);
                setValues({
                    ...form,
                    isUpdatePwd: 'not updated',
                    isLoadingPwd: '',
                    password:'',
                    password1:'',
                    password2:'',
                });
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
                            : value.length > 25 ? 'Elle doit contenir moins de 25 caractères'
                                : value === userCurrentEmail ? 'La nouvelle adresse doit être nouvelle'
                                    : '';
                if (form.email2!==''){
                    if (err===''){
                        err = 
                            value!==form.email2 ?  'Les adresses e-mail ne correspondent pas'
                                : '';
                        setErrors({
                            ...errors,
                            email1: '',
                            email2: err,
                        });
                    } else {
                        if (value !== form.email2){
                            setErrors({
                                ...errors,
                                [name]: err,
                            });
                        } else {
                            setErrors({
                                ...errors,
                                email: err,
                                email1: '',
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
            case 'email2':
                err =
                    value === form.email1 ? ''
                        : 'Les adresse e-mail ne correspondent pas';
                setErrors({
                    ...errors,
                    [name]: err,
                });
                break;
            case 'password':
                err =
                    !value ? "Veuillez renseigner votre mot de passe"
                                : '';
                let err2 = 
                    value === form.password1 ? 'Le nouveau mot de passe doit être nouveau'
                        : '';
                setErrors({
                    ...errors,
                    password: err,
                    password1:err2,
                });
                break;
            case 'password1':
                err =
                    !value ? "Veuillez renseigner un mot de passe"
                        : value.length < 8 ? 'Il doit contenir au moins 8 caractères'
                            : value.length > 15 ? 'Il doit contenir moins de 16 caractères'
                                : value === form.password ? 'Le nouveau mot de passe doit être nouveau'
                                    : '';
                if (form.password2!==''){
                    if (err===''){
                        err = 
                            value!==form.password2 ?  'Les mots de passe ne correspondent pas'
                                : '';
                        setErrors({
                            ...errors,
                            password1: '',
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
                                password1: err,
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
                    value === form.password1 ? ''
                        : 'Les mots de passe ne correspondent pas';
                setErrors({
                    ...errors,
                    [name]: err,
                });
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
        }
    };

    const checkSubmitDisabled = (name) => {
        let disabled = true;
        switch (name){
            case 'mail' :
                disabled = ( (!validateForm_mail(errors)) || form.isLoadingMail || form.email1 === '' || form.email2 === '' || form.email1 !== form.email2 || form.isUpdateMail !=='');
                break;
            case 'pwd' :
                disabled = ( (!validateForm_pwd(errors)) || form.isLoadingPwd || form.password === '' || form.password1 === '' || form.password2 === '' || form.password1 !== form.password2 || form.isUpdatePwd !=='');
                break;
            default :
                break;
        }
        return disabled ;
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm col-md-8 col-lg-8">
                    <form onSubmit={try_updating_email}>
                        <div className="form-group">
                            <h3>Adresse e-mail</h3>
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
                            {form.isUpdateMail === 'updated' &&
                                <small
                                    id="isUpdateMail"
                                    name="isUpdateMail"
                                    className='form-text text-valide'>
                                    Un email de confirmation vous a été envoyé !
                                </small>
                            }
                            {form.isUpdateMail === 'not updated' &&
                                <small
                                    id="isUpdateMail"
                                    name="isUpdateMail"
                                    className='form-text text-error'>
                                    Une erreur est survenue !
                                </small>
                            }
                        </div>
                    </form>
                    <form onSubmit={try_updating_password}>
                        <div className="form-group">
                            <h3>Mot de passe</h3>
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
                            {form.isUpdatePwd === 'updated' &&
                                <small
                                    id="isUpdatePwd"
                                    name="isUpdatePwd"
                                    className='form-text text-valide'>
                                    Votre mot de passe a été mis à jour
                                </small>
                            }
                            {form.isUpdatePwd === 'not updated' &&
                                <small
                                    id="isUpdatePwd"
                                    name="isUpdatePwd"
                                    className='form-text text-error'>
                                    Une erreur est survenue !
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