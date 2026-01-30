'use client'
import Link from "next/link"
import x from '@/styles/app.module.css';
import y from '@/styles/temp.module.css';
import { useEffect, useState } from "react";
import GridSystem from '@/styles/grid.module.css'
import AppTable from "@/components/app.table";
import type { Metadata } from 'next'
import '@/styles/home.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faArrowRight, faPlay, faSign, faStar } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faChartBar } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { faRegistered } from "@fortawesome/free-solid-svg-icons";
import PayPalPayment from "@/components/PayPalPayment.modal";
export const metadata: Metadata = {
  title: 'HomePage',
  description: '...',
}


export default function Home() {
  const slides = [
  {
    name: 'Gloria Rose',
    content: "This platform made learning web development much easier than I expected. The lessons are clear, practical, and very well structured. I was able to apply what I learned immediately to my own projects.",
    url: "https://img.freepik.com/free-photo/close-up-young-person-barbeque_23-2149271979.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    name: 'Maria Barin',
    content: "I really appreciate how everything is explained step by step. The learning path helped me stay focused and improve my skills faster without feeling overwhelmed.",
    url: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    name: 'John Bine',
    content: "The courses are well-designed and easy to follow. I gained practical knowledge that I can actually use in real projects. This platform is perfect for beginners and self-learners.",
    url: "https://www.shutterstock.com/image-photo/young-handsome-man-beard-wearing-600nw-1703979295.jpg"
  }
];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [animating, setAnimating] = useState(false);

  const handleNextSlide = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      setAnimating(false);
    }, 500);
  };

  return (
    <div>
      <div className="heros">
        <div className={`${GridSystem['grid']} ${GridSystem['wide']}`} style={{
          display: 'flex'
        }}>
          <div className="heros_left">
            <h3 className="heros_left-title">
              <span>
                Web development online.
              </span>
              Learning to code websites online just got easier
            </h3>
            <h4 className="heros_left-description">
              Here, you can learn how websites work, how to design user-friendly interfaces, and how to build dynamic web applications.The lessons are simple, well-structured, and suitable for beginners as well as learners who want to improve their skills.
              By the end of the course, you will be confident in creating your own web projects.
            </h4>
            <div className="heros_left-guide">
              <Link href={"/courses"} className="btn--main">Join Courses</Link>
              <div className="heros_left-watch">
                <div className="watch_btn">
                  <FontAwesomeIcon icon={faPlay} className="icon_play" />
                </div>
                <h4 className="watch-title">
                  Watch how it works
                </h4>
              </div>
            </div>
          </div>
          <div className="heros_right">
            <div className="heros_right-item itm1">
              <div className="item_icon itm1">
                <FontAwesomeIcon icon={faCalendar} className="item_icon-calendar" />
              </div>
              <div className="item_content">
                <h5>250k</h5>
                <h6>Assisted Student</h6>
              </div>
            </div>
            <div className="heros_right-item itm2">
              <div className="item_icon itm2">
                <FontAwesomeIcon icon={faMessage} className="item_icon-calendar" />
              </div>
              <div className="item_content">
                <h5>Congratulations</h5>
                <h6>Your admission completed</h6>
              </div>
            </div>
            <div className="heros_right-item itm3">
              <div style={{
                display: 'flex',
                alignItems: 'center'
              }}>
                <div className="item_icon itm3">
                  <img src="data:image/jpeg;base64,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" alt="" />
                </div>
                <div className="item_content">
                  <h5>Special Course</h5>
                  <h6>Over 1200 in-depth website courses</h6>
                </div>
              </div>
              <Link href={"/courses"} className="btn--main2">Explore Now</Link>
            </div>
            <div className="itm4">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <img src="/img/Banner.png" alt="" className="heros_right-banner" />
          </div>
        </div>

      </div>
      <div className="container1">
        <div style={{
          borderRadius: '16px',
          border: '2px solid #c0bfbf',
          padding: '20px 0'

        }} className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
          <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
            <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
              <div className="container-item">
                <div style={{
                  backgroundColor: '#D8587E;'
                }}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <h4>
                  Followers
                </h4>
                <h1>
                  2100+
                </h1>
              </div>
            </div>
            <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
              <div className="container-item center">
                <div style={{
                  backgroundColor: '#D8587E;'
                }}>
                  <FontAwesomeIcon icon={faBook} />
                </div>
                <h4>
                  Training courses
                </h4>
                <h1>
                  1200+
                </h1>
              </div>
            </div>
            <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
              <div className="container-item">
                <div style={{
                  backgroundColor: '#D8587E;'
                }}>
                  <FontAwesomeIcon icon={faSign} />
                </div>
                <h4>
                  Likes
                </h4>
                <h1>
                  1400+
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container2">
        <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div className="container2-left">
              <div></div>
              <img src="/img/AI.png" alt="" />
            </div>
            <div className="container2-right">

              <h1 className="container2-title">ABOUT US</h1>
              <h3 className="container-namewebsite">
                ONLINE LEARNING PLATFORM
              </h3>
              <p className="container-des">
                We are an online learning platform focused on IT and web development education. Our goal is to help learners build strong technical foundations and practical skills needed in today’s technology-driven world.

                Our courses range from basic to advanced levels, suitable for beginners as well as those who want to improve their professional skills. We also integrate AI technology to support learners in choosing the most suitable learning path, helping them save time and learn more effectively.

                With our platform, you can study anytime, anywhere, and gradually build a solid career in the IT industry from home.
              </p>
            </div>
          </div>
        </div>

      </div>
      <div className="container2">
        <h3 className='container-title'>
          Why Choose Us
        </h3>
        <h1 className='container-slogan'>
          We Bring You Something Special
        </h1>
        <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
          <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
            <div className={`${GridSystem['col']} ${GridSystem['l-6']}`}>
              <div className="container2-item itm1">
                <div></div>
                <h3>Suggested RoadMap by Learning Needs</h3>
                <button>Suggest RoadMap Now</button>
              </div>
            </div>
            <div className={`${GridSystem['col']} ${GridSystem['l-6']}`}>
              <div className="container2-item itm2">
                <div></div>
                <h3>The most comprehensive web development courses
                </h3>
                <button><Link href={"/courses"}>Explore Courses Now</Link></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="container2">
          <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
            <div style={{
              display: 'flex'
            }}>
              <div className="container2-left">
                <h1 className="container2-title">WHAT THEY SAY</h1>
                <h3 className="container-namewebsite">
                  ONLINE LEARNING COMMUNITY
                </h3>
                <p className="container-des">
                  Our platform has received thousands of positive reviews from learners around the world. These reviews reflect the quality of our courses, the clarity of our lessons, and the real value students gain throughout their learning journey.

We are proud to support learners of all levels by providing practical knowledge, flexible learning paths, and continuous improvement. The trust and feedback from our community inspire us to keep delivering better learning experiences every day.
                </p>
                <button>
                  Do You Have Anything To Say To Us?
                </button>
              </div>
              <div className="container2-right">
                <div className="slide-container">
                  <div className={`slide ${animating ? 'next-enter' : ''}`}>
                    <button onClick={handleNextSlide}>
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <img src={slides[currentSlide].url} alt="" />
                    <div className="review">
                      <p>"{slides[currentSlide].content}"</p>
                      <div className="review-info">
                        <h2>{slides[currentSlide].name}</h2>
                        <div className="star">
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="container2">
        <h3 className='container-title'>
          Lastest News and Resources
        </h3>
        <h1 className='container-slogan'>
          Explore LeHerry Academy's global advancements
        </h1>
        <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
          <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
            <div className={`${GridSystem['col']} ${GridSystem['l-6']} `}>
              <div className="blog-item" style={{
                marginRight: '30px'
              }}>
                <div style={{ position: 'relative' }}>
                  <img src="https://cdn.tgdd.vn/Files/2018/05/21/1089986/microsoft_logo_building_800x450.jpg" alt="" />
                  <span>News</span>
                </div>

                <h3>Microsoft Paint Integrates AI for Generative Features</h3>
                <h4>
                  Microsoft has added Generative Fill and Generative Erase features to Paint, allowing users to add or remove image details through commands.
                </h4>

              </div>
            </div>
            <div className={`${GridSystem['col']} ${GridSystem['l-6']}`}>
              <div className="blog-item--col2">
                <div style={{ position: 'relative', width: '40%' }}>
                  <img src="https://telegrafi.com/wp-content/uploads/2024/10/Bill-Gates-AI-cover-1.jpg" alt="" />
                  <span>News</span>
                </div>
                <div className="blog-content">
                  <h3>Bill Gates Shares His Top Three Concerns About AI</h3>
                  <h4>
                    Although optimistic about AI future, billionaire Bill Gates has expressed some concerns about certain aspects of this technology.
                  </h4>
                </div>

              </div>
              <div className="blog-item--col2">
                <div style={{ position: 'relative', width: '40%' }}>
                  <img src="https://i.ytimg.com/vi/i0B4JT6-R98/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCvoBJRWb1bBTmeyGOwNPDUI8-Cjw" alt="" />
                  <span>News</span>
                </div>
                <div className="blog-content">
                  <h3>AI Bypasses Google reCAPTCHAv2 System</h3>
                  <h4>
                    Some AI systems have achieved a new breakthrough by bypassing Google’s popular captcha authentication system, posing new challenges for web security.
                  </h4>
                </div>

              </div>
              <div className="blog-item--col2">
                <div style={{ position: 'relative', width: '40%' }}>
                  <img src="https://www.businesstechafrica.co.za/wp-content/uploads/2023/06/GettyImages-1202870693.webp" alt="" />
                  <span>News</span>
                </div>
                <div className="blog-content">
                  <h3>AI-Enabled Workstations Priced at Hundreds of Millions in Vietnam</h3>
                  <h4>
                    Lenovo’s ThinkStation workstations, capable of running large language models and training AI, are now available in Vietnam, starting at over 100 million VND.
                  </h4>
                </div>

              </div>

            </div>
          </div>
        </div>
        <button className="read-more">Read More</button>
      </div>


    </div>
  )
}
