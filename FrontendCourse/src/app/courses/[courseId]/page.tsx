'use client'
import GridSystem from '@/styles/grid.module.css';
import CourseItem from '@/styles/course_item.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faC, faClock, faPlaneDeparture } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faCloud } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { json } from 'stream/consumers';
import PRSuggest from '@/components/app.productsuggset';
import { useUser } from '@/context/UserContext';
import LoginModal from '@/components/login.modal';
import { checkApiStatus } from '@/app/globalfunction';
import { count } from 'console';
import coursesPage from '../page';
import { toast } from 'react-toastify';
import PayPalPayment from '@/components/PayPalPayment.modal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';




const CourseDetail = ({params} : {params : {courseId : string}}) => {
    const [courseWithRating, setCourseWithRating] = useState<ICourseWithRating | null>(null);
    const [countRating, setCountRating] = useState<number | null>(null); 
    const [contentRecommend, setContentRecommend] = useState<number[] | null>(null);
    const [dataSuggest, setDataSuggest] = useState<ICourseWithRating[] | null>(null); 
    const [dataCommentOrigin, setDataCommentOrigin] = useState<IComment[] | null>(null);
    const [dataCommentReplies, setDataCommentReplies] = useState<IComment[] | null>(null);
    const [dataUserRating, setDataUserRating] = useState<IUserRating[] | null>(null);
    const [showModalLogin, setShowModalLogin] = useState<boolean>(false)
    const [paymentProcess, setPayMentProcess] = useState<boolean>(false)
    const [newComment, setNewComment] = useState<string>('');
    const [checkCourseRegis, setCheckCourseRegis] = useState<boolean>(false)
    const [newCommentReplies, setNewCommentReplies] = useState<string>('');
    const [showModalSignUp, setShowModalSignUp] = useState<boolean>(false)
    const router = useRouter();


    const users = useUser();


    const [rating, setRating] = useState(0);  
    const [hover, setHover] = useState(0); 


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(e.target.value);
    };
    const fetchCountRating = async (courseId : number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ratings/public/count-rating/${courseId}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const countRating = await response.json();
            setCountRating(countRating)            
            
        } catch (err) {
            console.error("Fetch error:", err);
        }
    }
    const fetchSuggestCourses = async (suggestColUrl: string) => {
        try {
            const response = await fetch(suggestColUrl, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include'
            });
            if(response.status === 401){
                checkApiStatus(401, false);
            }
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const dataCourseSuggest: [ICourse, number][] = await response.json();
            
            const coursesWithRatings: ICourseWithRating[] = dataCourseSuggest.map(item => ({
                course: item[0],
                rating: item[1],
            }));
            
            setDataSuggest(coursesWithRatings); 
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    const getContentRecommend = async (courseTitle: string) => {
        try {
            const response = await fetch(`http://localhost:5001/content-recommend?course_title=${encodeURIComponent(courseTitle)}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setContentRecommend(data);
            if (Array.isArray(data)) {
                const courseIds = data.join(',');
                const url = `http://localhost:8080/api/courses/auth/suggest-course?courseIds=${courseIds}`;
                fetchSuggestCourses(url);
            }
        } catch (error) {
            console.error('Error fetching content recommend:', error);
        }
    }
    const fetchCommentRelies = async (commentIds: number[]) => {
        try {
            const queryString = commentIds.join(',');
            const response = await fetch(`http://localhost:8080/api/comments/public/getCommentRelies?parentIds=${queryString}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataCommentReplies(data)
    
        } catch (error) {
            console.error('Error fetching comment replies:', error);
        }
    }

    const fetchComment = async (courseId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/comments/public/getOriginalComment?courseId=${courseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataCommentOrigin(data);
            const commentIds = data.map((comment: { commentId: number }) => comment.commentId);
            if(commentIds != null){
                await fetchCommentRelies(commentIds);
            }

        } catch (error) {
            console.error('Error fetching content recommend:', error);
        }
    }
    const getUserRating = async (courseId : number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ratings/public/user_rating/${courseId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setDataUserRating(data)
        
        } catch (error) {
            console.error('Error fetching content recommend:', error);
        }
    }

    
    
    const CreateComment = async (content: string, datetime: string, courseId: number, personId : number) => {
        const newComment = {
            content: content,
            datetime : datetime,
            courseId : courseId,
            personId: personId,
            parentId : 0
        }
        try {
            const response = await fetch('http://localhost:8080/api/comments/auth/createComment', 
                {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComment),
                credentials: 'include'
              });
            if(response.status === 401){
                checkApiStatus(401, false);
                await CreateComment(content, datetime, courseId, personId);
            }
        }
        catch(error){
        }
    }
    const CreateRepComment = async (content: string, datetime: string, courseId: number, personId : number, parentId: number) => {
        const newComment = {
            content: content,
            datetime : datetime,
            courseId : courseId,
            personId: personId,
            parentId : parentId
        }
        try {
            const response = await fetch('http://localhost:8080/api/comments/auth/createComment', 
                {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newComment),
                credentials: 'include'
              });
            if(response.status === 401){
                await checkApiStatus(401, false);
                await CreateRepComment(content,datetime,courseId,personId,parentId);
            }
        }
        catch(error){
        }
    }
    const UpdateRating = async (personId: number, courseId: number, rating: number) => {
        const updateOrNewRating = {
            personId: personId,
            courseId: courseId,
            newRating: rating
        }
        try {
            const response = await fetch('http://localhost:8080/api/ratings/auth/updateRatingUser', 
                {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateOrNewRating),
                credentials: 'include'
              });
            if(response.status === 401){
                await checkApiStatus(401, false);
                await UpdateRating(personId, courseId, rating)
            }
        }
        catch(error){
        }
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!users) {

            setShowModalSignUp(false)
            setShowModalLogin(true)
        } else {
            if(rating > 0){
                const userPersonId = users.user!.personId;
                const updatedRatings = dataUserRating 
                ? dataUserRating.map(ratingObj => 
                    ratingObj.id.personId === userPersonId 
                    ? { ...ratingObj, rating: rating } 
                    : ratingObj
                ) 
                : [];

                if (!updatedRatings.some(ratingObj => ratingObj.id.personId === userPersonId)) {
                    const newRating: IUserRating = {
                        id: { personId: userPersonId },
                        rating: rating,  
                    };
                    updatedRatings.push(newRating); 
                    setCountRating((countRating ?? 0) + 1);
                }
                
                if (courseWithRating?.course.courseId) {
                    UpdateRating(userPersonId,courseWithRating.course.courseId,rating)
                }
                
                setDataUserRating(updatedRatings as IUserRating[]);

            }

            if(rating == 0 && newComment.length == 0){
                alert('You need to rate or comment!!');
            }
            else if (newComment.length >= 1 && newComment.length < 15) {
                alert('Comment must be at least 15 characters.');
            } else if (newComment.length >= 15) {

                if (!users.user) {
                    throw new Error("User data is not available");
                  }
                  const person = {
                    personId: users.user.personId,
                    name: users.user.name,
                    mobileNumber: users.user.mobileNumber,
                    email: users.user.email,
                    urlAvt: users.user.urlAvt,
                    roles: users.user.roles,
                  };
    
                const newCommentObject: IComment = {
                    commentId: Date.now(),
                    content: newComment,
                    person : person,
                    createdAt: new Date(),
                    parent: null,
                };
                const currentDate = newCommentObject.createdAt;
                const formattedDateTime = currentDate.toLocaleString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric'
                }).replace(',', '');
                if (courseWithRating?.course.courseId) {
                    CreateComment(newCommentObject.content, formattedDateTime, courseWithRating.course.courseId, newCommentObject.person.personId);
                }
    
                setDataCommentOrigin(prevComments => prevComments ? [...prevComments, newCommentObject] : [newCommentObject]);
    
                setNewComment('');
            }
            
                        
            
        }
    };
    const handleReplySubmit = (parent: IComment, replyContent: string) => {
        
        if (!users) {
            setShowModalSignUp(false)
            setShowModalLogin(true)
        } else {
            if (replyContent.length >= 15) {
                if (!users.user) {
                    throw new Error("User data is not available");
                  }
                  const person = {
                    personId: users.user.personId,
                    name: users.user.name,
                    mobileNumber: users.user.mobileNumber,
                    email: users.user.email,
                    urlAvt: users.user.urlAvt,
                    roles: users.user.roles,
                  };
        
                const newReply: IComment = {
                    commentId: Date.now(),  
                    content: replyContent,
                    person: person,
                    createdAt: new Date(),
                    parent: parent,  
                };
                const currentDate = newReply.createdAt;
                const formattedDateTime = currentDate.toLocaleString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                    day: '2-digit', 
                    month: '2-digit', 
                    year: 'numeric'
                }).replace(',', '');
                if (courseWithRating?.course.courseId && newReply.parent?.commentId) {
                    CreateRepComment(
                        newReply.content,
                        formattedDateTime,
                        courseWithRating.course.courseId,
                        newReply.person.personId,
                        newReply.parent.commentId
                    );
                }                
        
                setDataCommentReplies(prevReplies => prevReplies ? [...prevReplies, newReply] : [newReply]);
            } else {
                alert('Reply must be at least 15 characters.');
            }
        }
    };
    const handleAddToCard = async () => {
        if (!users?.user) {
            toast.error("You need to login!!")

            setShowModalSignUp(false)
            setShowModalLogin(true)
        }
        if (users?.cards == null || users.user == null) {
            return;
        }
        const updatedCards = [...users.cards];
        console.log(updatedCards);
    
        if (courseWithRating?.course == null) {
            return;
        }
        const result  = await fetchGetCart(users.user.personId, courseWithRating.course.courseId)
        if (result){
            
            const existingCardIndex = updatedCards.findIndex((item) => item.course.courseId === courseWithRating?.course.courseId);
    
            if (existingCardIndex !== -1) {
                toast.success("The course is already in your cart!!")
            } else {
                toast.success("Add Your Course Successfully!!")
                updatedCards.unshift({
                    course: courseWithRating?.course,
                    selected: false
                });
                users.updateCards(updatedCards);
            }
        
        }
        else{
            toast.error("Add Your Course Fail!!")
        }
    
        
    };
    const fetchGetCart = async (personId: number | null, courseId: number): Promise<boolean> => {
        if (personId == null || courseId == null) {
            return false; 
        }
    
        const url = "http://localhost:8080/api/cart/auth/getCartByPsAndCourseId";
        const cartRe = {
            cartId: {
                personId,
                courseId
            }
        };
    
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartRe),
                credentials: 'include'
            });
    
            if (response.ok) {
                const data = await response.json();
    
                if (data == 0) {
                    await fetchUpdateCart(personId, courseId, 1);
                } else {
                    await fetchUpdateCart(personId, courseId, data[0].quantity + 1);
                }
    
                return true; 
            } else {
                return false; 
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
            return false; 
        }
    };
    
    const fetchUpdateCart = async (personId : number | null, courseId : number, quantity: number) =>{
        const url = "http://localhost:8080/api/cart/auth/insertCart"
        const bodyEntity = {
            cartId: {
              personId,
              courseId
            },
            quantity
          }

            try {
              const response = await fetch(url, 
                {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyEntity),
                credentials: 'include'
              });      
              
            } catch (error) {
            }
    }

    // check khoá học đã đăng ký chưa
    const fetchCheckCourseRegis = async () => {
        const personId = users?.user?.personId;
        const courseId = courseWithRating?.course.courseId;
    
        const url = `http://localhost:8080/api/regiscourse/auth/checkCourseRegis?personId=${personId}&courseId=${courseId}`

            try {
              const response = await fetch(url, 
                {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include'
              });  
              
              const check = await response.json();
              setCheckCourseRegis(check)
              
            } catch (error) {
            }
    };

    // API đăng ký khoá học
    const fetchRegistrationCourse = async (queryParams : URLSearchParams): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:8080/api/regiscourse/auth/addcourse?${queryParams}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
    
            if (!response.ok) {
                return false;
            }
    
            const result = await response.json();
            return result;
        } catch (error) {
            return false;
        }
    };

    const ProcessPayMent = async () => {
        const courseId = courseWithRating?.course.courseId;
        const personId = users?.user?.personId

        const queryParams = new URLSearchParams({
            personId: `${personId}`,
            courseIds: `${courseId}`,
        });
        const resultAddCourse = await fetchRegistrationCourse(queryParams);
        if(resultAddCourse){
            toast.success("Course Registration Successful")
            setCheckCourseRegis(true)
            

        }else{
            toast.error("Course Registration Failed")
        }
        
    }
        

    
    

    useEffect(() => {
            const storedCourse = sessionStorage.getItem('selectedCourse');

            if (storedCourse) {
                try {
                    const parsedCourse: ICourseWithRating = JSON.parse(storedCourse);
                    setCourseWithRating(parsedCourse);
                    const courseId = parsedCourse?.course?.courseId;
                    const courseTitle = parsedCourse?.course.courseTitle;
                    if (courseId !== undefined) { 
                        fetchCountRating(courseId);
                        fetchComment(courseId);
                        getUserRating(courseId)
                    } else {
                        console.error("courseId is undefined");
                    }
                    if (courseTitle) {
                        getContentRecommend(courseTitle);
                    }
                } catch (error) {
                    console.error('Error parsing stored course:', error);
                }
            }
    }, []);
    console.log("chker" + checkCourseRegis)

    const ratings = dataUserRating?.map(item => item.rating);
    const totalRating = ratings?.reduce((sum, rating) => sum + rating, 0);
    const avgRating = totalRating != null && countRating != null && countRating > 0 ? totalRating / countRating : 0;
    fetchCheckCourseRegis()

    
    return (
        <div style={{marginTop : '122px'}}>
            {courseWithRating ? ( 
                        <div>
                            <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                                <div className={CourseItem['banner_course']}>
                                    <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                                        <div className={`${GridSystem['col']} ${GridSystem['l-5']}`}>
                                            <div className={CourseItem['course_backdrop']}>
                                                <div className={CourseItem['course_img']}>
                                                    <img src={courseWithRating.course.urlImg} alt="" className={CourseItem['course_img--item']}/>
                                                </div>
                                                <div className={CourseItem['course_share']}>
                                                    <h3>Share:</h3>
                                                    <a><svg style={{width : '24px', height : '24px'}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                </svg></a>
                <a>
                <svg xmlns="http://www.w3.org/2000/svg" style={{width : '24px', height : '24px', marginTop: '2px'}} x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
<path fill="#448AFF" d="M24,4C13.5,4,5,12.1,5,22c0,5.2,2.3,9.8,6,13.1V44l7.8-4.7c1.6,0.4,3.4,0.7,5.2,0.7c10.5,0,19-8.1,19-18C43,12.1,34.5,4,24,4z"></path><path fill="#FFF" d="M12 28L22 17 27 22 36 17 26 28 21 23z"></path>
</svg>
                </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`${GridSystem['col']} ${GridSystem['l-6']} ${GridSystem['l-o-1']}`}>
                                            <div className={CourseItem['course_info']}>
                                                <h2 className={CourseItem['course_name']}>
                                                    {courseWithRating.course.courseTitle}
                                                </h2>
                                                <p className={CourseItem['course_des']}>
                                                    {courseWithRating.course.des}
                                                </p>
                                                <div className={CourseItem['course_lectur']}>
                                                    <h3>Lecturer:</h3>
                                                    <img src="/img/Logo_web.png" alt="" className={CourseItem['avt_tutor']}/>
                                                    <h3 className={CourseItem['course_lectur--name']}> Academy</h3>
                                                </div>
                                                <div className={CourseItem['course_price']}>
                                                    <h3 className={CourseItem['course_price--old']}>
                                                        {courseWithRating.course.price !== 'Free' ? `${courseWithRating.course.originalPrice}$` : courseWithRating.course.originalPrice}
                                                    </h3>
                                                    <h3 className={CourseItem['course_price--new']}>
                                                        {courseWithRating.course.price !== 'Free' ? `${courseWithRating.course.price}$` : courseWithRating.course.price}
                                                    </h3>
                                                    <div className={CourseItem['discount']}> 
                                                        {courseWithRating.course.price !== 'Free' && parseFloat(courseWithRating.course.originalPrice) > parseFloat(courseWithRating.course.price) ? (
                                                            `${Math.round(((parseFloat(courseWithRating.course.originalPrice) - parseFloat(courseWithRating.course.price)) / parseFloat(courseWithRating.course.originalPrice)) * 100)}% OFF`
                                                        ) : (
                                                            courseWithRating.course.price === 'Free' ? 'Free' : ''
                                                        )}
                                                    </div>

                                                </div>
                                                <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${GridSystem['mg_top--10']}`}>
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                                        <div className={`${CourseItem['course_info--item']} ${CourseItem['course_review']}`}>
                                                            <FontAwesomeIcon icon={faStar} style={{ marginBottom: '3px' }}/>
                                                            <span>Rating: </span>
                                                            {courseWithRating.rating}
                                                        </div>
                                                    </div>
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                                        <div className={`${CourseItem['course_info--item']} ${CourseItem['course_review']}`}>
                                                            <FontAwesomeIcon icon={faCloud} style={{ marginBottom: '3px' }}/>
                                                            <span>Topic: </span>
                                                            {courseWithRating.course.category}
                                                        </div>
                                                    </div>
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                                        <div className={`${CourseItem['course_info--item']} ${CourseItem['course_review']}`}>
                                                            <FontAwesomeIcon icon={faClock} style={{ marginBottom: '3px' }}/>
                                                            <span>Duration: </span>
                                                            14h590p
                                                        </div>
                                                    </div>
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                                        <div className={`${CourseItem['course_info--item']} ${CourseItem['course_review']}`}>
                                                            <FontAwesomeIcon icon={faCirclePlay} style={{ marginBottom: '3px' }}/>
                                                            <span>Chapters: </span>
                                                            590 Chapters
                                                        </div>
                                                    </div>
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                                        <div className={`${CourseItem['course_info--item']} ${CourseItem['course_review']}`}>
                                                            <FontAwesomeIcon icon={faCode} style={{ marginBottom: '3px' }}/>
                                                            <span>Language: </span>
                                                            {courseWithRating.course.languagesProgramming}
                                                        </div>
                                                    </div>
                                                </div>
                                                {checkCourseRegis? (<div className={CourseItem['course-regis']}>
                                                    <Link href={`/courses/learn/${courseWithRating.course.courseId}`} className={CourseItem['pay']}>Join Now</Link>
                                                    <a className={CourseItem['add--Cart']}>View Similar Courses</a>
                                                </div>) : (<div className={CourseItem['course-regis']}>
                                                    <button className={CourseItem['pay']} onClick={(e) => {
                                                        e.preventDefault()
                                                        handleAddToCard()
                                                        
                                                    }}>Add To Cart</button>
                                                    
                                                    {courseWithRating.course.price == "Free" ? (
                                                        <button className={CourseItem['add--Cart']} onClick={ProcessPayMent}>Register Course Now</button>
                                                    ) : (<button className={CourseItem['add--Cart']} onClick={(e) => {
                                                        e.preventDefault()
                                                        handleAddToCard()
                                                        router.push('/user/purchase');


                                                    }}>Buy Now</button>)}
                                                    
                                                    
                                                </div>)}

                                                
                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                                <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                                    <div className={`${GridSystem['col']} ${GridSystem['l-8']} ${CourseItem['comment_contain']}`}>
                                        <form className={CourseItem['comment_content']} onSubmit={handleSubmit}>
                                            <div className={CourseItem['Form_title']}>
                                                <h2 className={CourseItem['form_course_title']}>{courseWithRating.course.courseTitle}</h2>
                                                <span className={CourseItem['star']}>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <FontAwesomeIcon
                                                    key={index}
                                                    className={
                                                        index < avgRating - 0.5
                                                        ? CourseItem['start_active']
                                                        : CourseItem['start_nonactive']
                                                    }
                                                    icon={faStar}
                                                    />
                                                ))}
                                                </span>
                                                <h5 className={CourseItem['avarage']}>
                                                    Average {avgRating.toFixed(1)} / {countRating} reviews
                                                </h5>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Content minimum 15 characters"
                                                className={CourseItem['User_comment--input']}
                                                value={newComment}
                                                onChange={handleInputChange} // Bắt sự kiện onChange
                                            />
                                            <div className={CourseItem['comment--send']}>
                                                <h4>To post a comment, you need to fill in at least the full name and content fields.</h4>
                                                <div className={CourseItem['eva']}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                <FontAwesomeIcon
                                                    key={star}
                                                    icon={faStar}
                                                    onClick={() => setRating(star)}       
                                                    onMouseEnter={() => setHover(star)}   
                                                    onMouseLeave={() => setHover(0)}    
                                                    style={{
                                                    cursor: 'pointer',
                                                    color: star <= (hover || rating) ? '#ffc107' : '#e4e5e9',  
                                                    }}
                                                />
                                                ))}
                                                </div>
                                                <button type="submit">Submit</button> 
                                            </div>
                                        </form>
                                        {dataCommentOrigin && dataCommentOrigin.length > 0&& (
                                            <div className={CourseItem['Comment--fromUser']}>
                                                {dataCommentOrigin
                                                .sort((a, b) => {
                                                    const commentIdA = a.commentId ?? 0;
                                                    const commentIdB = b.commentId ?? 0;
                                                    return commentIdB - commentIdA;
                                                })
                                                .map((comment) => {
                                                const userRating = dataUserRating?.find(rating => rating.id.personId === comment.person.personId);
                                                  
                                                return (
                                                    <div className={CourseItem['User--comment']} key={comment.commentId}>
                                                        <img
                                                            src={comment.person.urlAvt}
                                                            className={CourseItem['User_img--comment']}/>
                                                        <div className={CourseItem['User_content--commentAndFeedback']}>
                                                            <div className={CourseItem['User_content--comment']}>
                                                                <div className={CourseItem['User_content--header']}>
                                                                    <h6 className={CourseItem['User_name--comment']}>
                                                                        {comment.person.name} 
                                                                    </h6>
                                                                    {userRating && (
                                                                        <span className={CourseItem['star']}>
                                                                            {Array.from({ length: 5 }).map((_, index) => (
                                                                                <FontAwesomeIcon
                                                                                    key={index}
                                                                                    className={
                                                                                        index < userRating.rating
                                                                                            ? CourseItem['small_start_active']
                                                                                            : CourseItem['small_start_nonactive']
                                                                                    }
                                                                                    icon={faStar}
                                                                                />
                                                                            ))}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <h6 className={CourseItem['User_time--comment']}>
                                                                    {new Date(comment.createdAt).toLocaleString()}
                                                                </h6>
                                                                <p>{comment.content}</p>
                                                            </div>

                                                            {dataCommentReplies && dataCommentReplies
                                                                .filter((reply) => reply.parent !== null && reply.parent.commentId === comment.commentId)
                                                                .map((reply) => (
                                                                    <div className={CourseItem['User--feedback']} key={reply.commentId}>
                                                                        <img
                                                                            src={reply.person.urlAvt}
                                                                            className={CourseItem['User_img--feedback']}
                                                                        />
                                                                        <div className={CourseItem['User_content--feedback']}>
                                                                            <div className={CourseItem['User_name--feedback']}>
                                                                                <h6>{reply.person.name}</h6>
                                                                            </div>
                                                                            <h6 className={CourseItem['User_time--feedback']}>
                                                                                {new Date(reply.createdAt).toLocaleString()}
                                                                            </h6>
                                                                            <p>{reply.content}</p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            
                                                            <div className={CourseItem['User_content--addYourFeedback']}>
                                                                <div>
                                                                    <input type="text" placeholder="Enter your comment"
                                                                    value={newCommentReplies}
                                                                    onChange={(e) => setNewCommentReplies(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault(); 
                                                                            handleReplySubmit(comment, newCommentReplies);
                                                                            setNewCommentReplies(''); 
                                                                        }
                                                                    }}
                                                                    />
                                                                    <FontAwesomeIcon icon={faLocationArrow}  style={{
                                                                        position: 'absolute',
                                                                        right: '6px',
                                                                        fontSize: '19px',
                                                                        color: 'gray'
                                                                    }} />
                                                                </div>
                                                                <form className={CourseItem['comment_content--feedback']}>
                                                                    <div className={CourseItem['user_info--input']}>
                                                                        <input type="text" />
                                                                        <input placeholder="Name" type="text"/>
                                                                        <input placeholder="Phonenumber" type="phone"/>
                                                                        <input placeholder="Email" type="email" />
                                                                    </div>
                                                                    <input
                                                                        placeholder="Nội dung tối thiểu 15 ký tự"
                                                                        type="text"
                                                                        className={CourseItem['User_comment--input']}/>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            </div>
                                        )}
                                    </div>

                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                                    <div className={CourseItem['course_menu']}>
                                        <div className={CourseItem['course_content']}>
                                            <div className={CourseItem['course_content--header']}>
                                                <div>
                                                    <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']}/>
                                                    <h3 className={CourseItem['course_content--index']}>
                                                        1.
                                                    </h3>
                                                    <h3 className={CourseItem['course_content--name']}>
                                                        Introduction Introduction
                                                        Introduction Introduction
                                                    </h3>
                                                </div>

                                                <h3 className={CourseItem['course_content_lesson']}>
                                                    3 lessons
                                                </h3>
                                            </div>
                                            <ul className={CourseItem['course_lesson--list']}>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>1.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>2.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>3.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>4.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={CourseItem['course_content']}>
                                            <div className={CourseItem['course_content--header']}>
                                                <div>
                                                    <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']}/>
                                                    <h3 className={CourseItem['course_content--index']}>
                                                        1.
                                                    </h3>
                                                    <h3 className={CourseItem['course_content--name']}>
                                                        Introduction Introduction
                                                        Introduction Introduction
                                                    </h3>
                                                </div>

                                                <h3 className={CourseItem['course_content_lesson']}>
                                                    3 lessons
                                                </h3>
                                            </div>
                                            <ul className={CourseItem['course_lesson--list']}>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>1.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>2.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>3.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>4.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={CourseItem['course_content']}>
                                            <div className={CourseItem['course_content--header']}>
                                                <div>
                                                    <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']}/>
                                                    <h3 className={CourseItem['course_content--index']}>
                                                        1.
                                                    </h3>
                                                    <h3 className={CourseItem['course_content--name']}>
                                                        Introduction Introduction
                                                        Introduction Introduction
                                                    </h3>
                                                </div>

                                                <h3 className={CourseItem['course_content_lesson']}>
                                                    3 lessons
                                                </h3>
                                            </div>
                                            <ul className={CourseItem['course_lesson--list']}>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>1.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>2.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>3.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>4.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className={CourseItem['course_content']}>
                                            <div className={CourseItem['course_content--header']}>
                                                <div>
                                                    <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']}/>
                                                    <h3 className={CourseItem['course_content--index']}>
                                                        1.
                                                    </h3>
                                                    <h3 className={CourseItem['course_content--name']}>
                                                        Introduction Introduction
                                                        Introduction Introduction
                                                    </h3>
                                                </div>

                                                <h3 className={CourseItem['course_content_lesson']}>
                                                    3 lessons
                                                </h3>
                                            </div>
                                            <ul className={CourseItem['course_lesson--list']}>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>1.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>2.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>3.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                                <li>
                                                    <div>
                                                        <FontAwesomeIcon icon={faPlus} className={CourseItem['icon_plus']}/>
                                                        <h4 className={CourseItem['lesson_index']}>4.</h4>
                                                        <h4 className={CourseItem['lesson_name']}>Course_information</h4>
                                                    </div>

                                                    <h4 className={CourseItem['lesson_time']}>01:03</h4>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    </div>
                                </div>
                            </div>
                    </div>
                    ) : 
                    (
                                    <p>Course information is not available.</p>
                    )}
            
            <PRSuggest courses={dataSuggest || []} type={2} freeCourses = {[]} newCourses = {[]}/>
            
            <LoginModal
                showModalLogin = {showModalLogin}
                setShowModalLogin = {setShowModalLogin}
                showModalSignUp = {showModalSignUp}
                setShowModalSignUp = {setShowModalSignUp}
            />
            
        </div>
    );
};

export default CourseDetail;
