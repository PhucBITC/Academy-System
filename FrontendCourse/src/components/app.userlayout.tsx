'use client'
import '@/styles/user.css'
import GridSystem from '@/styles/grid.module.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faCartPlus, faPen, faRing, faSearch, faTicket, faUser } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '@/context/UserContext'
const UserLayOut = ({ children }: { children: React.ReactNode }) =>{
  const users = useUser();
  const user = users!.user!
   
    return (
      <>
      <div className="userLayout">
        <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
          <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
            <div className={`${GridSystem['col']} ${GridSystem['l-2']}`}>
              <div className="user_taskbar">
                <div className="taskbar_infor">
                  <img src={user.urlAvt} alt="" />
                  <div className="taskbar_changeInfo">
                    <h3>{user.name}</h3>
                    <Link href="" className="taskbar_changeLink">
                    <FontAwesomeIcon icon={faPen}/>
                    Change Information</Link>
                  </div>
                </div>
                <ul className="taskbar_list">
                  <li>
                    <Link href={""}>
                      <FontAwesomeIcon icon={faUser}/>
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link href={"/user/purchase"}>
                    <FontAwesomeIcon icon={faCartPlus}/>
                    My Cart
                    </Link>
                  </li>
                  <li>
                    <Link href={""}>
                    <FontAwesomeIcon icon={faBell}/>
                      My Notification
                    </Link>
                  </li>
                  <li>
                    <Link href={""}>
                    <FontAwesomeIcon icon={faTicket}/>
                      My Voucher
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={`${GridSystem['col']} ${GridSystem['l-10']}`}>
            <ul className="purchase_list">
                <li className="active">Waiting for payment</li>
                <li>Returns/Refunds</li>
                <li>All</li>
            </ul>
            <div className="searchProduct">
                <FontAwesomeIcon icon={faSearch}/>
                <input type="text" className="" placeholder="You can search by Course name" />
            </div>
              {children}
            </div>
          </div>
        </div>
      </div>
        
      </>
    )
}
export default UserLayOut