'use client'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from 'react';
import '@/styles/login.css'
import { useRouter } from 'next/navigation';
import React, { useRef } from "react";




interface IProp {
  showModalLogin: boolean;
  setShowModalLogin: (v: boolean) => void;
  showModalSignUp: boolean;
  setShowModalSignUp: (v: boolean) => void;
}

function LoginModal(props: IProp) {
  const { showModalLogin, setShowModalLogin, showModalSignUp, setShowModalSignUp } = props;

  const [userGoogle, setUserGoogle] = useState<IUser | null>(null)
  const router = useRouter();


  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [pwd, setPwd] = useState<string>("")
  const [rePwd, setRePwd] = useState<string>("")
  const [otp, setOTP] = useState<string>("")
  const [levelPwd, setLevelPwd] = useState<number>(0);
  const { data: session } = useSession();
  // const userContext = useContext(UserContext);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<{ [key: string]: boolean }>({
    name: false,
    email: false,
    pwd: false,
    rePwd: false,
    otp: false
  })


  // Ref
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const pwdRef = useRef<HTMLInputElement>(null);
  const rePwdRef = useRef<HTMLInputElement>(null);
  const otpRef = useRef<HTMLInputElement>(null);


  const LoginWithGoogle = async () => {
    localStorage.setItem('provider', 'GOOGLE_LOG');
    localStorage.setItem('checkRemember', 'true');
    localStorage.removeItem('authToken');
    signIn("google")
  }
  const LoginWithFaceBook = async () => {
    localStorage.setItem('provider', 'FACEBOOK_LOG');
    localStorage.setItem('checkRemember', 'true');
    localStorage.removeItem('authToken');
    signIn("facebook");
  }
  const LoginWithGitHub = async () => {
    localStorage.setItem('provider', 'GITHUB_LOG');
    localStorage.setItem('checkRemember', 'true');
    localStorage.removeItem('authToken');
    signIn("github");
  };




  const handleSubmit = async () => {
    const newRequestLogin = {
      email: email,
      pwd: pwd,
      checkedRememberMe: rememberMe
    }
    localStorage.setItem('emailUser', email)
    localStorage.setItem('checkRemember', rememberMe ? 'true' : 'false');

    try {
      const response = await fetch('http://localhost:8080/apiAuthen/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newRequestLogin),
          credentials: 'include'
        });

      if (response.ok) {
        const data = await response.json();
        var token = data.token;
        var refreshToken = data.refreshToken;
        console.log(data.token);
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('provider', 'APP_LOG');
        handeCloseModel();
        window.location.reload();
      } else {
        toast.error('Login Failed');
      }
    } catch (error) {
      toast.error('Login Failed');
    }
  };
  const handleRegisUser = async () => {
    if (checkInputNotEmpty()) {
      return;
    } else {
      if (validateEmail() || validatePwd()) {
        return;
      }
      if (validateRePwd()) {
        return;
      }
      const isOTPValid = await fetchCheckOTPValid();
      if (isOTPValid) {
        const isCreated = await fetchCreatePerson();
        if (isCreated) {
          resetInformation()
          toast.success('Create Account Success')
        }
        else {
          toast.error('Create Account Unsuccess')
        }
      } else {
        toast.error('OTP is invalid');
      }
    }
  };


  const handeCloseModel = () => {
    setEmail("")
    setPwd("")
    setShowModalLogin(false)
  }


  const checkInputNotEmpty = (): boolean => {
    const newError: { [key: string]: boolean } = {
      name: name === "",
      email: email === "",
      pwd: pwd === "",
      rePwd: rePwd === "",
      otp: otp === ""
    };

    setError(newError);

    if (newError.name) {
      nameRef.current?.focus();
    } else if (newError.email) {
      emailRef.current?.focus();
    } else if (newError.pwd) {
      pwdRef.current?.focus();
    } else if (newError.rePwd) {
      rePwdRef.current?.focus();
    } else if (newError.otp) {
      otpRef.current?.focus();
    }

    const hasError = Object.values(newError).some((error) => error);

    if (hasError) {
      toast.error("Please enter complete information");
    }

    return hasError;
  };

  const checkEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmail = (): boolean => {
    if (!checkEmail(email)) {
      setError((prev) => ({ ...prev, email: true }));
      toast.error("Invalid email format");
      emailRef.current?.focus();
      return true
    }
    return false;
  };

  const changeLevelPassword = (password: string) => {
    const commonPasswords = [
      "12345", "123456", "12345678", "password", "abcde", "qwerty",
      "1234", "abcd", "111111", "123123", "letmein", "welcome"
    ];
    if (password.length == 0) {
      setLevelPwd(0)
    }
    else {
      if (!commonPasswords.includes(password) || (password.length >= 1 && password.length < 7)) {
        setLevelPwd(1)
        if (/^[A-Z]/.test(password) && password.length >= 7) {
          setLevelPwd(2)
          if (/\d/.test(password)) {
            setLevelPwd(3)
            if (/[@$!%*?&#]/.test(password)) {
              setLevelPwd(4)
            };
          };
        }
      };
    }

  };
  const validatePwd = (): boolean => {
    if (levelPwd == 1) {
      setError((prev) => ({ ...prev, pwd: true }));

      toast.error("Your password is too easy, please capitalize the first letter")
      pwdRef.current?.focus();
      return true
    }
    else if (levelPwd == 2) {
      setError((prev) => ({ ...prev, pwd: true }));

      toast.error("Your password must contain 1 number character")
      pwdRef.current?.focus();

      return true
    }
    return false;
  };

  const validateRePwd = (): boolean => {
    if (pwd !== rePwd) {
      setError((prev) => ({ ...prev, rePwd: true }));

      toast.error("Re-entered password does not match password")
      rePwdRef.current?.focus();
      return true
    }

    return false;
  };

  const checkEmailNotEmpty = (): boolean => {
    if (email === "" || validateEmail() == true) {
      setError((prev) => ({ ...prev, email: true }));
      return false
    }
    return true
  }
  const sendOTP = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (checkEmailNotEmpty()) {
      fetchSendOTPEmail()
      toast.success("OTP has been sent successfully");
    } else {
      emailRef.current?.focus();
      toast.error("Please enter a valid email");
    }
  };
  const fetchCheckOTPValid = async (): Promise<boolean> => {
    let newCheck = {
      email: email,
      otpValue: otp,
    };
    try {
      const response = await fetch('http://localhost:8080/api/email/public/checkOTPValid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCheck),
      });

      if (response.ok) {
        const data = await response.json();
        return data === true;
      }
    } catch (error) {
      toast.error('OTP Value is invalid');
    }
    return false;
  };



  const fetchCreatePerson = async (): Promise<boolean> => {
    let newPerson = {
      name: name,
      email: email,
      pwd: pwd
    }
    try {
      const response = await fetch('http://localhost:8080/api/person/public/createPerson',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPerson),
        });

      if (response.ok) {
        const data = await response.json();
        return data === true;
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('OTP Value is invalid');
    }
    return false
  }

  const fetchSendOTPEmail = async () => {
    let newEmail = {
      emailSend: email,
      subject: "LeHerry Academy OTP"
    }
    try {
      const response = await fetch('http://localhost:8080/api/email/public/sendEmailOTP',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEmail),
        });

      if (response.ok) {
        const data = await response.text();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Send OTP Failed');
    }
  }
  const resetInformation = () => {
    setName("")
    setEmail("")
    setLevelPwd(0)
    setOTP("")
    setRePwd("")
    setPwd("")
    setError({
      name: false,
      email: false,
      pwd: false,
      rePwd: false,
      otp: false
    });
    setShowModalSignUp(false)
  }




  useEffect(() => {
    const handleSessionLogin = async () => {
      if (session && !localStorage.getItem('authToken')) {
        const provider = localStorage.getItem('provider');

        const newRequestLogin = {
          name: session.user?.name,
          email: session.user?.email,
          accountFrom: provider,
          urlAvt: session.user?.image
        };
        localStorage.setItem('emailUser', session.user?.email!)

        try {
          const response = await fetch('http://localhost:8080/apiAuthen/loginWithService', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRequestLogin),
            credentials: 'include'
          });

          if (response.ok) {
            const dataService = await response.json();
            localStorage.setItem('authToken', dataService.token);
            handeCloseModel();
            router.refresh()

          } else {
            toast.error('Login Failed');
          }
        } catch (error) {
          toast.error('Login Failed');
        }
      }
    };


    handleSessionLogin();
    if (showModalSignUp) {
      setName("");
      setEmail("")
      setPwd("");
      setRePwd("");
      setOTP("")
      if (emailRef.current) emailRef.current.value = "";
      if (pwdRef.current) pwdRef.current.value = "";
      if (rePwdRef.current) rePwdRef.current.value = "";
      if (nameRef.current) nameRef.current.value = "";
      if (otpRef.current) otpRef.current.value = "";

    }


  }, [session, showModalSignUp]);


  return (
    <>

      <Modal style={{ top: '1%' }}
        show={showModalLogin}
        onHide={handeCloseModel}
        backdrop={true}
        keyboard={false}
        className='modalLogAndRegis'
      >

        <Modal.Body>
          {showModalSignUp ? (
            <Form className='formLogin_Layout--left full'>
              <img src="/img/Logo_web.png" alt="" className="formlogoWeb" />
              <h3 className="form-login_title">
                Sign Up LeHerry Academy
              </h3>
              <p className="warning">
                Each person should use their own account, accounts shared by multiple people will be locked.
              </p>
              <Form.Group className={`mb-1 login_input ${error.name ? "input--error" : ""}`} >
                <label htmlFor="">Your name?</label>
                <Form.Control type="text" placeholder="Please enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  ref={nameRef}
                />
              </Form.Group>
              <Form.Group className={`mb-2 login_input ${error.email ? "input--error" : ""}`}>
                <label htmlFor="">Your email?</label>
                <Form.Control type="text" placeholder="Please enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailRef}

                />
              </Form.Group>
              <Form.Group className={`mb-3 login_input ${error.pwd ? "input--error" : ""}`}>
                <label htmlFor="">Your password?</label>
                <Form.Control type="password" placeholder="Please enter password"
                  value={pwd}
                  autoComplete='new-password'
                  onChange={(e) => {
                    setPwd(e.target.value)
                    changeLevelPassword(e.target.value)
                  }}
                  ref={pwdRef}

                />
                <div>
                  <div className="valuePassLevel">
                    <div className={`level_item ${(levelPwd == 1) ? "level_item--1" :
                      (levelPwd == 2) ? "level_item--2" :
                        (levelPwd == 3) ? "level_item--3" :
                          (levelPwd == 4) ? "level_item--4" : ""}`}></div>
                    <div className={`level_item ${(levelPwd == 2) ? "level_item--2" :
                      (levelPwd == 3) ? "level_item--3" :
                        (levelPwd == 4) ? "level_item--4" : ""}`}>

                    </div>
                    <div className={
                      `level_item ${(levelPwd == 3) ? "level_item--3" :
                        (levelPwd == 4) ? "level_item--4" : ""}`
                    }></div>
                    <div className={
                      `level_item ${(levelPwd == 4) ? "level_item--4" : ""}`
                    }></div>
                  </div>

                  <label htmlFor="" className="PassLevelInfo">{(levelPwd == 1 || levelPwd == 2) ? "Weak Password" :
                    (levelPwd == 3) ? "Average Password" : (levelPwd == 4) ? "Strong Password" : ""
                  }</label>
                </div>
              </Form.Group>

              <Form.Group className={`mb-2 login_input ${error.rePwd ? "input--error" : ""}`}>
                <Form.Control type="password" placeholder="Please re-enter password"
                  value={rePwd}
                  onChange={(e) => setRePwd(e.target.value)}
                  ref={rePwdRef}
                />
              </Form.Group>
              <Form.Group className={`mb-4 login_input ${error.otp ? "input--error" : ""}`}>
                <div className='group_sendcode'>

                  <Form.Control type="text" placeholder="Enter confirmation code"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    ref={otpRef}
                  />
                  <button
                    onClick={(e) => sendOTP(e)}
                  >Send Code</button>
                </div>

              </Form.Group>

              <Button className='btn_primary' style={{
                width: '100%'
              }} onClick={() => handleRegisUser()}>
                Register
              </Button>
              <div className="BackLog">
                <h3>Do you have account?</h3>
                <h4 onClick={() => resetInformation()}>Sign In</h4>
              </div>
              <a href="" className="forgotPass">Forgot Password?</a>
              <h6>
                By continuing to use this website, you agree to <a href="">our terms of use</a>
              </h6>



            </Form>
          ) : (
            <div className='formLogin_layout'>
              <Form className='formLogin_Layout--left full'>
                <img src="/img/Logo_web.png" alt="" className="formlogoWeb" />
                <h3 className="form-login_title">
                  Sign In LeHerry Academy
                </h3>
                <div className="form-login_service">
                  <div className="login-service_item" onClick={() => LoginWithFaceBook()}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                      <path d="M25,3C12.85,3,3,12.85,3,25c0,11.03,8.125,20.137,18.712,21.728V30.831h-5.443v-5.783h5.443v-3.848 c0-6.371,3.104-9.168,8.399-9.168c2.536,0,3.877,0.188,4.512,0.274v5.048h-3.612c-2.248,0-3.033,2.131-3.033,4.533v3.161h6.588 l-0.894,5.783h-5.694v15.944C38.716,45.318,47,36.137,47,25C47,12.85,37.15,3,25,3z"></path>
                    </svg>
                  </div>
                  <div className="login-service_item" onClick={() => LoginWithGoogle()}>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50">
                      <path d="M 25.996094 48 C 13.3125 48 2.992188 37.683594 2.992188 25 C 2.992188 12.316406 13.3125 2 25.996094 2 C 31.742188 2 37.242188 4.128906 41.488281 7.996094 L 42.261719 8.703125 L 34.675781 16.289063 L 33.972656 15.6875 C 31.746094 13.78125 28.914063 12.730469 25.996094 12.730469 C 19.230469 12.730469 13.722656 18.234375 13.722656 25 C 13.722656 31.765625 19.230469 37.269531 25.996094 37.269531 C 30.875 37.269531 34.730469 34.777344 36.546875 30.53125 L 24.996094 30.53125 L 24.996094 20.175781 L 47.546875 20.207031 L 47.714844 21 C 48.890625 26.582031 47.949219 34.792969 43.183594 40.667969 C 39.238281 45.53125 33.457031 48 25.996094 48 Z"></path>
                    </svg>
                  </div>
                  <div className="login-service_item">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 50 50" onClick={() => LoginWithGitHub()}>
                      <path d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"></path>
                    </svg>
                  </div>
                </div>
                <span style={{
                  marginBottom: '10px',
                  fontSize: '1.2rem'
                }}>or use your account</span>
                <Form.Group className="mb-3 login_input">
                  <Form.Control type="email" placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3 login_input">
                  <Form.Control type="password" placeholder="Password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                </Form.Group>
                <div className="login--remAndForgot">
                  <div className="remember">
                    <Form.Check
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </div>
                  <a href="">Forgot your password</a>
                </div>
                <Button className='btn_primary' onClick={() => handleSubmit()}>Login</Button>
                <Button className='btn_sencond' onClick={() => setShowModalSignUp(true)}>
                  Register
                </Button>

              </Form>

            </div>


          )}




        </Modal.Body>

      </Modal>
    </>


  );
}

export default LoginModal;