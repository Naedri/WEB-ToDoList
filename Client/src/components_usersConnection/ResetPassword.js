import React, { useState } from "react";
import { Ripple } from 'react-spinners-css';
import { resetPwdUserApi } from '../api.js';
import '../css/styleUser.css';


const ResetPassword = (props) => {

    const [form, setValues] = useState({
        password1: '',
        password2: '',
        isLoadingPwd: '',
        isUpdatePwd: '',

    });
    const [errors, setErrors] = useState({
        password1: '',
        password2: '',
    });

    // eslint-disable-next-line
    const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

    const validateForm_pwd = (errors) => {
        return errors.password1==='' && errors.password2==='';
    }

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

    const try_updating_password = async (e) => {
        e.preventDefault();
        if (validateForm_pwd(errors)) {
            try {
                startLoading('pwd');

                let statusUpdate = await resetPwdUserApi(form.password2);
                if(statusUpdate.password2==='updated') {
                    setValues({
                        ...form,
                        isUpdatePwd: 'updated',
                        isLoadingPwd: '',
                        password1:'',
                        password2:'',
                    });

                    let url = "/login";
                    setTimeout(() => {
                        history.push(url);
                        }, 1500);

                } else {
                    setValues({
                        ...form,
                        isUpdatePwd: 'not updated',
                        isLoadingPwd: '',
                        password1:'',
                        password2:'',
                    });
                }
            } catch (err) {
                //setErrors(err.message);
                console.log(err);
                setValues({
                    ...form,
                    isUpdatePwd: 'not updated',
                    isLoadingPwd: '',
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
        if (name === 'password1' || name === 'password2') {
            setValues({
                ...form,
                [name]: value,
                isUpdatePwd: '',
                isLoadingPwd: '',
            });
        }
    };

    const checkSubmitDisabled = (name) => {
        let disabled = true;
        switch (name){
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
                    <form onSubmit={try_updating_password}>
                        <div className="form-group">
                            <h3>Mot de passe</h3>
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
                                Réinitialiser le mot de passe
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

export default ResetPassword;