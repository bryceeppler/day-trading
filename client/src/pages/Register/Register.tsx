import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Register.module.scss';
import useLogin from 'action/useLogin';
import { UserContext } from 'context/userProfile';
import useReactOperations from 'hooks/useReactOperations.hook';
import TextField from 'components/TextField';
import Button from 'components/Button';
import Layout from 'Base';
import Logo from 'images/logo.svg';
function Register(): ReactElement {
  const [username, setUsername] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verify, setVerify] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successful, setSuccessful] = useState<boolean>(false);

  const verified = () => {
    setVerify(true);
    if (!username) return false;
    if (!password) return false;
    if (!name) return false;

    return true;
  };

  const { navigateToLoginPage } = useReactOperations();

  const userContext = useContext(UserContext);

  const { register } = useLogin();
  const localRegister = async () => {
    if (!verified()) return;
    const error = await register(name, username, password);
    console.log(error);
    setSuccessful(!error);
    if (error) {
      setError(error);
      return;
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.details}>
          <img src={Logo} alt="Logo" />

          {!successful ? (
            <>
              <TextField className={styles.text} setValue={setName} value={name} label={'Name'} verify={verify} />
              <TextField
                className={styles.text}
                setValue={setUsername}
                value={username}
                label={'Username'}
                verify={verify}
              />
              <TextField
                className={styles.text}
                setValue={setPassword}
                value={password}
                label={'Password'}
                type={'password'}
                verify={verify}
              />
              <div className={styles.actions}>
                <Button className={styles.submitButton} label={'Register'} onClick={localRegister} />
                <div className={styles.subAction} onClick={navigateToLoginPage}>
                  Return to login
                </div>
              </div>

              {error && <div className={styles.error}>{error}</div>}
            </>
          ) : (
            <div>
              <div className={styles.regSuccessful}>Registration Successful!</div>
              <Button className={styles.submitButton} label={'Return to Login'} onClick={navigateToLoginPage} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default Register;
