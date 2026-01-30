'use client'
import footer from '@/styles/foooter.module.css'
import GridSystem from '@/styles/grid.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

import { faCoffee } from '@fortawesome/free-solid-svg-icons';
const AppFooter = () => {
    return (
        <div>
            <footer className={footer['footer']}>

                <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                    <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                        <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                            <ul className={footer['footer_col']}>
                                <li><h1>Contact Info</h1></li>
                                <li>
                                    <span>Address:</span>
                                    Thanh khe Da Nang
                                </li>
                                <li>
                                    <span>Phone Number:</span>
                                    (+84) 0357839115
                                </li>
                                <li>
                                    <span>Email:</span>
                                    phucxo262@gmail.com
                                </li>
                            </ul>
                        </div>
                        <div className="col l-2">
                            <ul className={footer['footer_col']}>
                                <li><h1>Quick Links</h1></li>
                                <li>
                                    <a href="">Home</a>
                                </li>
                                <li>
                                    <a href="">Courses</a>
                                </li>
                                <li>
                                    <a href="">Contact</a>
                                </li>
                                <li>
                                    <a href="">Blog</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col l-2">
                            <ul className={footer['footer_col']}>
                                <li><h1>Social</h1></li>
                                <li>
                                    <a href="">Facebook</a>
                                </li>
                                <li>
                                    <a href="">Youtube</a>
                                </li>
                                <li>
                                    <a href="">Tiktok</a>
                                </li>
                            </ul>
                        </div>
                        <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                            <ul className={footer['footer_col']}>
                                <li><h1>Subscribe</h1></li>
                                <li className="">
                                    <form action="" className={footer['send_email']}>
                                        <input type="email" placeholder="Email Address"></input>
                                        <button>
                                        <FontAwesomeIcon icon={faPlane} style={{
                                        }}/>
                                        </button>
                                    </form>
                                </li>
                                <li>
                                    Subscribe to our mailing list and get updates to your email inbox.
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h3 className={footer['copyright']}>© 2018 - 2026 The world's leading programming learning platform.</h3>
                </div>
            </footer>
        </div>

    )
}
export default AppFooter