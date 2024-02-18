import React, { ReactElement, useContext, useEffect, useState } from 'react';
import styles from './Login.module.scss';
import useLogin from 'action/useLogin';
import { UserContext } from 'context/userProfile';
import useReactOperations from 'hooks/useReactOperations.hook';
import TextField from 'components/TextField';
import Button from 'components/Button';
import Layout from 'Base';
import Logo from 'images/logo.svg';
function Login(): ReactElement {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [verify, setVerify] = useState<boolean>(false);
	const [error, setError] = useState<string>('')

  const verified = () => {
    setVerify(true);
    if (!username) return false;
    if (!password) return false;

    return true;
  };

  const { navigateToHomePage, navigateToRegistrationPage } = useReactOperations();

  const userContext = useContext(UserContext);

  const { login } = useLogin();
  const localLogin = async () => {
    if (!verified()) return;
    const error = await login(username, password);
		console.log(error)
		setError(error || '')
  };

  useEffect(() => {
    if (!userContext.user) return;
    navigateToHomePage();
  }, [userContext.user]);

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.details}>
          <img src={Logo} alt="Logo" />
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
						<Button className={styles.submitButton} label={'Login'} onClick={localLogin} />
						<div className={styles.createAccount} onClick={navigateToRegistrationPage}>Create Account</div>
					</div>
					{error && <div className={styles.error}>{error}</div>}
        </div>
      </div>
    </Layout>
  );
}

export default Login;
