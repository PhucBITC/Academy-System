'use client'
import header from '@/styles/header.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCartArrowDown, faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faShop } from '@fortawesome/free-solid-svg-icons';
import { faRoad } from '@fortawesome/free-solid-svg-icons';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';




const NavRight = () =>{
    const [industry, setIndustry] = useState("Front-End");
    const [level, setLevel] = useState("Beginner");
    const [data, setData] = useState<string[] | null>(null); 
    const [error, setError] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isBlogOpen, setIsBlogOpen] = useState(false);
    const router = useRouter();
    const users = useUser();

    const [countCart, setCountCart] = useState<number>(0)

    



    const handleIndustryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndustry = event.target.value;
        setIndustry(selectedIndustry);
        console.log("Selected industry:", selectedIndustry);
    };

    const handleLevelChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLevel(event.target.value);
    };

    const getCourseByName = async (courseTitle : string) => {
        try {
            courseTitle = encodeURIComponent(courseTitle);
            const response = await fetch(`http://localhost:8080/api/courses/public/getCourseWithAvgByTitle?courseTitle=${courseTitle}`,
               {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
               }
                
            )
            const result = await response.json();
            sessionStorage.setItem('selectedCourse', JSON.stringify({
                course: {
                    courseId: result[0].courseId,
                    courseTitle: result[0].courseTitle,
                    originalPrice: result[0].originalPrice,
                    price: result[0].price,
                    level: result[0].level,
                    category: result[0].category,
                    languagesProgramming: result[0].languagesProgramming,
                    urlImg: result[0].urlImg,
                    des: result[0].des
                },
                rating: result[1]
            }));
            router.push(`/courses/${result[0].courseId}`);
            setShowOverlay(false);
            setIsBlogOpen(false)
            
        } catch (error) {
            
        }
    }

    const handleSuggestRoad = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/get_courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ industry, level }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result)
            const regex = /\*\*(.*?)\*\*/g; // Tìm tất cả nội dung giữa ** và bỏ **
            const courseNames: string[] = []; 
            let match;

            while ((match = regex.exec(result.response)) !== null) {
                console.log("Match found:", match[1]); 
                courseNames.push(match[1].trim());
            }

            console.log(courseNames)
            setData(courseNames)
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message); 
            } else {
                setError('An unknown error occurred'); 
            }
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
    }, [data]);


    const handleRoadClick = () => {
        sessionStorage.setItem('temp', "temp")
        if(showOverlay == true){
            setShowOverlay(false);
            setIsBlogOpen(false)
        }
        else{
            setIsBlogOpen(true)
            setShowOverlay(true);
        }
         
    };

    const handleBlogClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation(); 
    };
    const handleNewRoadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setData(null);
        setIndustry("Front-End");
        setLevel("Beginner")
    };

    useEffect(() => {
        if (users?.cards) {
            const totalQuality = users.cards.length;
            setCountCart(totalQuality);
        }
    }, [users?.cards]); 
    
    

    return(
        <div>
            {showOverlay && (
                <div className={header['overlay']}></div>
            )}

            
            <div className={header['road']} onClick={handleRoadClick}>
                <FontAwesomeIcon icon={faRoad}/>
                <div className={header['road-blog']} style={{ display: isBlogOpen ? 'flex' : 'none' }} onClick={handleBlogClick}>
                    <div className={header['road_title']}>
                        <h1 style={{
                            fontSize : '1.6rem'
                        }}>Suggested Course Itinerary</h1>
                        <FontAwesomeIcon icon={faAngleDown} style={{
                            fontSize : 'large',
                            paddingTop : '2px'
                        }}/>
                    </div>
                    
                    {!isLoading && !data &&
                    <div>
                        <label className={header['road-select-title']}>Please select web development industry</label>
                        <select name="industry" className={header['road-select']} id="industry" onChange={handleIndustryChange}>
                            <option value="Front-End">Front-End</option>
                            <option value="Back-End">Back-end</option>
                            <option value="Full-stack">Full-stack</option>
                            <option value="DevOps">DevOps</option>
                            <option value="Web Security">Web Security</option>
                        </select>
                        <label className={header['road-select-title']}>Please select your current level</label>
                        <select name="level" id="level" className={header['road-select']} onChange={handleLevelChange}>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                    </select>
                    <img src="/img/Logo_web.png" alt="" className={header['road_img']}/>
                    </div>}
                    {isLoading &&  <div style={{
                        display : 'flex',
                        alignItems : 'center',
                        flex : '1',
                        flexDirection : 'column',

                    }}>
                        <h1 className={header['road_loading']}>We Are Processing</h1>
                        <div>
                        <Spinner animation="border" style={{ width: '50px', height: '50px', color : '#F48C06'}} />
                        <Spinner animation="border" style={{ width: '100px', height: '100px', color : '#F48C06'}}/>
                        </div>
                        </div>}
                    {data && (
                        <div>
                            <h4 style={{fontSize : 'medium',
                            marginBottom : '18px'
                            }}>Here are 5 course titles suitable for a {industry} {level} learning path:</h4>
                            <ul className={header['road-list']}>

                            </ul>
                            {data.map((course) => (
                                <li className={header['road-list_item']}>
                                <img src="/img/Logo_web.png" alt="" />
                                <div  onClick={() => getCourseByName(course)}>
                                    <h3>{course}</h3>
                                    <h4>{level}</h4>
                                </div>
                                </li>
                            ))}
                            <div className={header['addCourseRoad']}>
                            <button>Add Courses</button>
                            <button onClick={handleNewRoadClick}>New Road</button>
                        </div>
                        </div>
                    )}

                    {
                        !data && (
                        <button id="suggest_road" onClick={handleSuggestRoad}>
                            Suggest Itinerary
                        </button>)
                    }
                    
                </div>
            </div>
            <div className={header['card']}>
                <FontAwesomeIcon icon={faCartPlus}/>
                <div className={header['cart_count']}>{countCart > 9 ? '9+' : countCart}</div>
                <div className={header['cart_container']}>
                    <div className={header['cart_header']}>
                        <h1>New products added</h1>
                    </div>
                    <ul className={header['card_list']}>
                    {users?.cards && users.cards.length > 0 ? (
                        users.cards
                            .slice(0, 5)
                            .map((cartItem, index) => (
                                <li key={index}>
                                    <img src={cartItem.course.urlImg} alt="" />
                                    <div className={header['course_info']}>
                                        <h3>{cartItem.course.courseTitle}</h3>
                                        <h4>{cartItem.course.level}</h4>
                                    </div>
                                    <div className={header['course_price']}>
                                        <h3>{cartItem.course.price === "Free" ? "Free" : cartItem.course.price + "$"}</h3>
                                        <h4>{cartItem.course.languagesProgramming}</h4>
                                    </div>
                                </li>
                            ))
                    ) : (
                        <div>
                            <img src="/img/cart.png" alt="" className={header['cart_img']} />
                            <h4 className={header['no_course']}>There are no courses in your cart yet</h4>
                        </div>
                    )}

                    </ul>



                    <div className={header['cart_footer']}>
                        <div className={header['cart_footer--quantity']}>
                            {countCart} items in cart
                        </div>
                        <button className={header['cart_footer--viewAll']}>
                            View Cart
                        </button>
                    </div>

                </div>
                
            </div>
            
            <div className={header['notification']}>
                <FontAwesomeIcon icon={faBell}/>
            </div>

            

        </div>
    )
}
export default NavRight