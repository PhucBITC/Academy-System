import { useEffect, useState } from 'react';
import suggest from '@/styles/suggest_tion.module.css';
import GridSystem from '@/styles/grid.module.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface ProductSuggestProps {
    courses: ICourseWithRating[]; 
    type : number;
    freeCourses : ICourseWithRating[]; 
    newCourses : ICourseWithRating[]; 
}

const handleCourseClick = (courseId: number,
    courseTitle: string,
    originalPrice: string,
    price: string,
    level: string,
    category: string,
    languagesProgramming: string,
    urlImg: string,
    des: string,
    rating: number
) => {
    sessionStorage.setItem('selectedCourse', JSON.stringify({
        course: {
            courseId: courseId,
            courseTitle: courseTitle,
            originalPrice: originalPrice,
            price: price,
            level: level,
            category: category,
            languagesProgramming: languagesProgramming,
            urlImg: urlImg,
            des: des
        },
        rating: rating
    }));
};

const PRSuggest = (productsuggset: ProductSuggestProps) => {
    const { courses } = productsuggset;
    const {type} = productsuggset;
    const {freeCourses} = productsuggset;
    const {newCourses} = productsuggset;
    useEffect(() => {
        if (courses.length > 0) {
            setKey('suggest');
        } else {
            setKey('free');
        }
    }, [courses.length]);
    const [key, setKey] = useState<string>(courses.length > 0 ? 'suggest' : 'free');
    const [hoveredCourse, setHoveredCourse] = useState<{ id: number, title: string, x: number, y: number } | null>(null);
    return (
        <div>
            <div className={suggest['container']}>
                <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                    {type === 1 ? (
                        <div>
                            <h3 className={suggest['container_title']}>
                                Best Courses
                            </h3>
                            <h1 className={suggest['container_slogan']}>
                                Wide Range Of Highly Rated Courses
                            </h1>
                            <Tabs
                                activeKey={key}
                                onSelect={(k) => setKey(k as string)}
                                id="uncontrolled-tab-example"
                                className="mb-3"
                            >
                                {courses.length > 0 && (
                                    <Tab eventKey="suggest" title={<span className={key === 'suggest' ? suggest['tab-title-active'] : suggest['tab-title']}>Today's Suggestion</span>}>
                                        <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${suggest['overFlowAuto']}`}>
                                            {courses.map(({ course, rating }) => (
                                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`} key={course.courseId} style={{ position: 'relative' }}>
                                                    <Link href={`/courses/${course.courseId}`} className={suggest['item--course']}
                                                        onClick={() => handleCourseClick(course.courseId, course.courseTitle, course.originalPrice, course.price, course.level, course.category, course.languagesProgramming, course.urlImg, course.des, rating)}
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse({ id: course.courseId, title: course.courseTitle, x: e.clientX - rect.left, y: e.clientY - rect.top });
                                                        }}
                                                        onMouseLeave={() => setHoveredCourse(null)}
                                                        onMouseMove={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse(prev => prev && prev.id === course.courseId ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev);
                                                        }}
                                                    >
                                                        <div className={suggest['course_img']}>
                                                            <img src={course.urlImg} alt="" />
                                                        </div>
                                                        <div className={suggest['course_content']}>
                                                            <div className={suggest['course_title']}>
                                                                <h2>{course.courseTitle}</h2>
                                                                <div className={suggest['review']}>
                                                                    <h3 className={suggest['review_avg']}>{rating.toFixed(1)}</h3>
                                                                    <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} />
                                                                </div>
                                                            </div>
                                                            <div className={suggest['course_price']}>
                                                                <h3 className={suggest['course_price--old']}>
                                                                    {course.price !== 'Free' ? `${course.originalPrice}$` : course.originalPrice}
                                                                </h3>
                                                                <h3 className={suggest['course_price--new']}>
                                                                    {course.price !== 'Free' ? `${course.price}$` : course.price}
                                                                </h3>
                                                            </div>
                                                            <div className={suggest['course_info']}>
                                                                <div className={suggest['course_tutor']}>
                                                                    <h3>Level : {course.level}</h3>
                                                                </div>
                                                                <div className={suggest['course_chap']}>
                                                                    <i className="fa-solid fa-circle-play"></i>
                                                                    <h3>590 chapters</h3>
                                                                </div>
                                                                <div className={suggest['course_time']}>
                                                                    <i className="fa-solid fa-clock"></i>
                                                                    <h3>14h590p</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Tooltip chỉ hiện với course hiện tại */}
                                                        {hoveredCourse && hoveredCourse.id === course.courseId && (
                                                            <div
                                                                className={suggest['hovered-course-tooltip']}
                                                                style={{ top: hoveredCourse.y + 'px', left: hoveredCourse.x + 'px' }}
                                                            >
                                                                {hoveredCourse.title}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </Tab>
                                )}
                                <Tab eventKey="free" title={<span className={key === 'free' ? suggest['tab-title-active'] : suggest['tab-title']}>Free</span>}>
                                <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${suggest['overFlowAuto']}`}>
                                            {freeCourses.map(({ course, rating }) => (
                                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`} key={course.courseId} style={{ position: 'relative' }}>
                                                    <Link href={`/courses/${course.courseId}`} className={suggest['item--course']}
                                                        onClick={() => handleCourseClick(course.courseId, course.courseTitle, course.originalPrice, course.price, course.level, course.category, course.languagesProgramming, course.urlImg, course.des, rating)}
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse({ id: course.courseId, title: course.courseTitle, x: e.clientX - rect.left, y: e.clientY - rect.top });
                                                        }}
                                                        onMouseLeave={() => setHoveredCourse(null)}
                                                        onMouseMove={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse(prev => prev && prev.id === course.courseId ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev);
                                                        }}
                                                    >
                                                        <div className={suggest['course_img']}>
                                                            <img src={course.urlImg} alt="" />
                                                        </div>
                                                        <div className={suggest['course_content']}>
                                                            <div className={suggest['course_title']}>
                                                                <h2>{course.courseTitle}</h2>
                                                                <div className={suggest['review']}>
                                                                    <h3 className={suggest['review_avg']}>{rating}</h3>
                                                                    <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} />
                                                                </div>
                                                            </div>
                                                            <div className={suggest['course_price']}>
                                                                <h3 className={suggest['course_price--old']}>
                                                                    {course.price !== 'Free' ? `${course.originalPrice}$` : course.originalPrice}
                                                                </h3>
                                                                <h3 className={suggest['course_price--new']}>
                                                                    {course.price !== 'Free' ? `${course.price}$` : course.price}
                                                                </h3>
                                                            </div>
                                                            <div className={suggest['course_info']}>
                                                                <div className={suggest['course_tutor']}>
                                                                    <h3>Level : {course.level}</h3>
                                                                </div>
                                                                <div className={suggest['course_chap']}>
                                                                    <i className="fa-solid fa-circle-play"></i>
                                                                    <h3>590 chapters</h3>
                                                                </div>
                                                                <div className={suggest['course_time']}>
                                                                    <i className="fa-solid fa-clock"></i>
                                                                    <h3>14h590p</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Tooltip chỉ hiện với course hiện tại */}
                                                        {hoveredCourse && hoveredCourse.id === course.courseId && (
                                                            <div
                                                                className={suggest['hovered-course-tooltip']}
                                                                style={{ top: hoveredCourse.y + 'px', left: hoveredCourse.x + 'px' }}
                                                            >
                                                                {hoveredCourse.title}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                </Tab>
                                <Tab eventKey="new" title={<span className={key === 'new' ? suggest['tab-title-active'] : suggest['tab-title']}>New</span>}>
                                <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${suggest['overFlowAuto']}`}>
                                            {newCourses.map(({ course, rating }) => (
                                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`} key={course.courseId} style={{ position: 'relative' }}>
                                                    <Link href={`/courses/${course.courseId}`} className={suggest['item--course']}
                                                        onClick={() => handleCourseClick(course.courseId, course.courseTitle, course.originalPrice, course.price, course.level, course.category, course.languagesProgramming, course.urlImg, course.des, rating)}
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse({ id: course.courseId, title: course.courseTitle, x: e.clientX - rect.left, y: e.clientY - rect.top });
                                                        }}
                                                        onMouseLeave={() => setHoveredCourse(null)}
                                                        onMouseMove={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse(prev => prev && prev.id === course.courseId ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev);
                                                        }}
                                                    >
                                                        <div className={suggest['course_img']}>
                                                            <img src={course.urlImg} alt="" />
                                                        </div>
                                                        <div className={suggest['course_content']}>
                                                            <div className={suggest['course_title']}>
                                                                <h2>{course.courseTitle}</h2>
                                                                <div className={suggest['review']}>
                                                                <h3 className={suggest['review_avg']}>
                                                                    {rating !== null && rating !== undefined ? rating.toFixed(1) : '0'}
                                                                </h3>
                                                                    <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} />
                                                                </div>
                                                            </div>
                                                            <div className={suggest['course_price']}>
                                                                <h3 className={suggest['course_price--old']}>
                                                                    {course.price !== 'Free' ? `${course.originalPrice}$` : course.originalPrice}
                                                                </h3>
                                                                <h3 className={suggest['course_price--new']}>
                                                                    {course.price !== 'Free' ? `${course.price}$` : course.price}
                                                                </h3>
                                                            </div>
                                                            <div className={suggest['course_info']}>
                                                                <div className={suggest['course_tutor']}>
                                                                    <h3>Level : {course.level}</h3>
                                                                </div>
                                                                <div className={suggest['course_chap']}>
                                                                    <i className="fa-solid fa-circle-play"></i>
                                                                    <h3>590 chapters</h3>
                                                                </div>
                                                                <div className={suggest['course_time']}>
                                                                    <i className="fa-solid fa-clock"></i>
                                                                    <h3>14h590p</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {hoveredCourse && hoveredCourse.id === course.courseId && (
                                                            <div
                                                                className={suggest['hovered-course-tooltip']}
                                                                style={{ top: hoveredCourse.y + 'px', left: hoveredCourse.x + 'px' }}
                                                            >
                                                                {hoveredCourse.title}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                </Tab>
                            </Tabs>
                        </div>
                    ) : type === 2 ? (
                        <div>
                            <h3 className={suggest['container_title']}>
                                Similar Courses
                            </h3>
                            <h1 className={suggest['container_slogan']}>
                                Explore Courses That Match Your Journey
                            </h1>
                            <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${suggest['overFlowAuto']}`}>
                                            {courses.map(({ course, rating }) => (
                                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`} key={course.courseId} style={{ position: 'relative' }}>
                                                    <Link href={`/courses/${course.courseId}`} className={suggest['item--course']}
                                                        onClick={() => handleCourseClick(course.courseId, course.courseTitle, course.originalPrice, course.price, course.level, course.category, course.languagesProgramming, course.urlImg, course.des, rating)}
                                                        onMouseEnter={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse({ id: course.courseId, title: course.courseTitle, x: e.clientX - rect.left, y: e.clientY - rect.top });
                                                        }}
                                                        onMouseLeave={() => setHoveredCourse(null)}
                                                        onMouseMove={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            setHoveredCourse(prev => prev && prev.id === course.courseId ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : prev);
                                                        }}
                                                    >
                                                        <div className={suggest['course_img']}>
                                                            <img src={course.urlImg} alt="" />
                                                        </div>
                                                        <div className={suggest['course_content']}>
                                                            <div className={suggest['course_title']}>
                                                                <h2>{course.courseTitle}</h2>
                                                                <div className={suggest['review']}>
                                                                    <h3 className={suggest['review_avg']}>
                                                                        {rating !== null ? `${rating}` : 0}
                                                                    </h3>
                                                                    <FontAwesomeIcon icon={faStar} style={{ color: '#FFD43B' }} />
                                                                </div>
                                                            </div>
                                                            <div className={suggest['course_price']}>
                                                                <h3 className={suggest['course_price--old']}>
                                                                    {course.price !== 'Free' ? `${course.originalPrice}$` : course.originalPrice}
                                                                </h3>
                                                                <h3 className={suggest['course_price--new']}>
                                                                    {course.price !== 'Free' ? `${course.price}$` : course.price}
                                                                </h3>
                                                            </div>
                                                            <div className={suggest['course_info']}>
                                                                <div className={suggest['course_tutor']}>
                                                                    <h3>Level : {course.level}</h3>
                                                                </div>
                                                                <div className={suggest['course_chap']}>
                                                                    <i className="fa-solid fa-circle-play"></i>
                                                                    <h3>590 chapters</h3>
                                                                </div>
                                                                <div className={suggest['course_time']}>
                                                                    <i className="fa-solid fa-clock"></i>
                                                                    <h3>14h590p</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Tooltip chỉ hiện với course hiện tại */}
                                                        {hoveredCourse && hoveredCourse.id === course.courseId && (
                                                            <div
                                                                className={suggest['hovered-course-tooltip']}
                                                                style={{ top: hoveredCourse.y + 'px', left: hoveredCourse.x + 'px' }}
                                                            >
                                                                {hoveredCourse.title}
                                                            </div>
                                                        )}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                        </div>
                    ) : (
                        <div>Type not recognized</div>
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default PRSuggest;
