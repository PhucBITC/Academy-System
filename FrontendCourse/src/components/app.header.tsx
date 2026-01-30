'use client'
import Link from "next/link"
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import GridSystem from '@/styles/grid.module.css'
import Navbar from 'react-bootstrap/Navbar';
import header from '@/styles/header.module.css';
import { Button } from "react-bootstrap";
import { useEffect, useState } from 'react';
import LoginModal from "./login.modal";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from 'react-bootstrap/Dropdown';
import { signIn, signOut, useSession } from "next-auth/react";
import { useUser } from '@/context/UserContext'
import { cookies } from "next/dist/client/components/headers";

interface IProps {
  user: IUser | null;
}

const AppHeader = (props: IProps) => {
  const { user } = props;

  var temp = typeof window !== 'undefined' ? sessionStorage.getItem('temp') : null;


  const { data: session } = useSession();




  const [showModalLogin, setShowModalLogin] = useState<boolean>(false)
  const [showModalSignUp, setShowModalSignUp] = useState<boolean>(false)


  const handleApiLogout = async () => {
    localStorage.removeItem('provider');
    localStorage.removeItem('emailUser');
    localStorage.removeItem('checkRemember');


    try {
      const response = await fetch('http://localhost:8080/apiAuthen/logout',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = async () => {
    await handleApiLogout();
    window.location.reload();
    signOut();
  }





  return (
    <header className={header['header_nav']}>
      <div className={`${GridSystem['grid']} ${GridSystem['wide']}`} style={{ height: '100%' }}>
        <div className={header['header']}>
          <img src="/img/Logo_web.png" alt="" className={header['header_logo']} />
          {user ? (
            <ul className={header['header_category--haveUser']}>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Home</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/courses"}>Course</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Contact</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Blog</Link>
              </li>
              <div className={header['header_authen--user']}>
                <Dropdown>
                  <Dropdown.Toggle style={{
                    backgroundColor: '#cbd3daff',
                    borderRadius: '18px'
                  }} id="dropdown-basic">
                    {user.name}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={header['Dropdown_Menu']} style={{

                  }}>
                    <Dropdown.Item href="#/action-1">Infomation</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Product</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" className={header['Dropdown_Menu--Click']} onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

            </ul>


          ) : (
            <ul className={header['header_category']}>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Home</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/courses"}>Course</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Contact</Link>
              </li>
              <li className={header['header_category--item']}>
                <Link href={"/"}>Blog</Link>
              </li>
              <div className={header['header_authen']}>
                <button className={header['header_login']} onClick={() => {
                  setShowModalSignUp(false)
                  setShowModalLogin(true)

                }}>
                  Login
                </button>
                <button className={header['header_regis']} onClick={() => {
                  setShowModalSignUp(true)
                  setShowModalLogin(true)
                }}>
                  <div>Sign Up</div>
                </button>
              </div>
            </ul>

          )}

        </div>
      </div>
      <LoginModal
        showModalLogin={showModalLogin}
        setShowModalLogin={setShowModalLogin}
        showModalSignUp={showModalSignUp}
        setShowModalSignUp={setShowModalSignUp}
      />
    </header>


    // <Button classNameName={`${header['button']}`}>Sign Up</Button>

  )
}
export default AppHeader