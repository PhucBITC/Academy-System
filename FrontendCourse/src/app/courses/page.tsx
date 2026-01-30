'use client'
import course from '@/styles/course_pages.module.css'
import GridSystem from '@/styles/grid.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faFilter } from '@fortawesome/free-solid-svg-icons'
import suggest from '@/styles/suggest_tion.module.css';
import Pagination from 'react-bootstrap/Pagination';
import pagination from '@/styles/paginations.module.css';
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useEffect, useState } from 'react'
import { Carousel } from 'react-bootstrap'
import useSWR, {Fetcher} from "swr";
import { useUser } from '@/context/UserContext'
import PRSuggest from '@/components/app.productsuggset'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { faBook } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import Spinner from 'react-bootstrap/Spinner';




const coursesPage = () => {
    const users = useUser();
    const [dataSuggest, setDataSuggest] = useState<ICourseWithRating[] | null>(null);
    const [dataCourseFree, setdataCourseFree] = useState<ICourseWithRating[] | null>(null);
    const [dataCourseNew, setdataCourseNew] = useState<ICourseWithRating[] | null>(null); 
    const [loading, setLoading] = useState<boolean>(false);
    const [dataCourseFilter, setDataCourseFilter] = useState<ICourseWithRating[] | null>(null);
    const [errorCourseFilter, setErrorCourseFilter] = useState<string | null>(null);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    const [hoveredCourse, setHoveredCourse] = useState<{ id: number, title: string, x: number, y: number } | null>(null);

    const [selectedLevels, setSelectedLevels] = useState<string[] | null>(null)
    const [selectedLanguages, setSelectedLanguages] = useState<string[] | null>(null)
    const [selectedCategories, setSelectedCategories] = useState<string[] | null>(null)
    const [selectedRating, setSelectedRating] = useState<string | null>(null)
    const [selectedFreePrice, setSelectedFreePrice] = useState<string | null>(null)
    const [selectedPrices, setSelectedPrices] = useState<{ [key: number]: string[] | null }>({
        1: null,
        2: null,
        3: null,
        4: null,
        5: null,
      });

    const [showMorePrice, setShowMorePrice] = useState(false);
    const [showMoreCategory, setShowMoreCategory] = useState(false);
    const [showMoreLanguage, setShowMoreLanguage] = useState(false);
    
    const [checkedStates, setCheckedStates] = useState<{
        levels: string[];
        prices: string[];
        categories: string[];
        languages: string[];
        rating: string | null;
      }>({
        levels: [],
        prices: [],
        categories: [],
        languages: [],
        rating: null
      });
      

    const setBefaulFilter = () => {
        setSelectedLevels(null)
        setSelectedPrices({
            1: null,
            2: null,
            3: null,
            4: null,
            5: null,
        })
        setSelectedLanguages(null)
        setSelectedCategories(null)
        setSelectedRating(null)

        setCheckedStates({
            levels: [],
            prices: [],
            categories: [],
            languages: [],
            rating: null
          });

    }
    const handleSetCheckState = (param: keyof typeof checkedStates, input: string) => {
        setCheckedStates((prev) => {
          // Nếu là rating, chỉ cần cập nhật giá trị chuỗi
          if (param === 'rating') {
            return {
              ...prev,
              rating: input // Cập nhật giá trị rating
            };
          }
      
          // Nếu không phải rating (checkbox), xử lý như trước
          const updatedState = prev[param].includes(input)
            ? prev[param].filter((item) => item !== input) // Nếu có, loại bỏ
            : [...prev[param], input]; // Nếu không, thêm vào
      
          return {
            ...prev,
            [param]: updatedState // Cập nhật trạng thái
          };
        });
      };
      
      
    const handleCheckboxLevelChange = (level: string) => {
        setSelectedLevels((prev) => {
          if (prev === null) {
            return [level];
          }
          return prev.includes(level)
            ? prev.filter((item) => item !== level)
            : [...prev, level];
        });
      };
      const handleCheckboxPriceChange = (index: number, price: string) => {
        setSelectedPrices((prev) => {
          const currentPrices = prev[index] || [];
          const updatedPrices = currentPrices.includes(price)
            ? currentPrices.filter((item) => item !== price)
            : [...currentPrices, price];
      
          return {
            ...prev,
            [index]: updatedPrices,
          };
        });
      };
    const handleCheckboxCategoryChange = (category: string) => {
        setSelectedCategories((prev) => {
          if (prev === null) {
            return [category];
          }
          return prev.includes(category)
            ? prev.filter((item) => item !== category)
            : [...prev, category];
        });
      };
      const handleCheckboxlangugaeChange = (language: string) => {
        setSelectedLanguages((prev) => {
          if (prev === null) {
            return [language];
          }
          return prev.includes(language)
            ? prev.filter((item) => item !== language)
            : [...prev, language];
        });
      };
    
    

    const [activePage, setActivePage] = useState(1);

    const handlePageClick = (pageNumber : number) => {
        setActivePage(pageNumber);
        setPageNumber(pageNumber);
    };

    const fetchCoursesFilter = async (rating : string | null,languages : string | null,categories : string | null ,levels : string | null, 
        prices1 : string | null,
        prices2 : string | null,
        prices3 : string | null,
        prices4 : string | null,
        prices5 : string | null,
        freePrice : string | null, pageNumber : number) => {
        setLoading(true);
        setErrorCourseFilter(null);
        const url = `http://localhost:8080/api/courses/public/coursefilter/${rating}/${languages}/${categories}/${levels}/${prices1}/${prices2}/${prices3}/${prices4}/${prices5}/${freePrice}/${pageNumber}`
        console.log(url)
        const urlTotalPage = `http://localhost:8080/api/courses/public/totalPageCourses/${rating}/${languages}/${categories}/${levels}/${prices1}/${prices2}/${prices3}/${prices4}/${prices5}/${freePrice}`

        try {
          const response = await fetch(
            url
          );
          const responseTotalPage = await fetch(
            urlTotalPage
          );
          if (!response.ok || !responseTotalPage.ok) {
            throw new Error('Failed to fetch data');
          }
          const dataCourse: [ICourse, number][] = await response.json();
          const totalPage = await responseTotalPage.json()
          console.log("totalPage " + totalPage)
            
            const coursesWithRatings: ICourseWithRating[] = dataCourse.map(item => ({
                course: item[0],
                rating: item[1],
            }));
            
            
          setDataCourseFilter(coursesWithRatings);
          setTotalPage(totalPage)
          
        } catch (err) {
          setErrorCourseFilter((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
    
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

    const renderPaginationItems = () => {
        const items = [];
        for (let pageNumber = 1; pageNumber <= totalPage; pageNumber++) {
            if (pageNumber >= activePage - 1 && pageNumber <= activePage + 1) {
                items.push(
                    <Pagination.Item
                        key={pageNumber}
                        active={activePage === pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`${pagination['pagination-item']} ${activePage === pageNumber ? pagination['pagination-item-active'] : ''}`}
                    >
                        {pageNumber}
                    </Pagination.Item>
                );
            } else if (pageNumber === 2 || pageNumber === totalPage - 1) {
                items.push(<Pagination.Ellipsis className={pagination['paginationEllips']} key={`ellipsis-${pageNumber}`} />);
            }
        }
        return items;
    };



    
    const fetcher = (url: string) => fetch(url)
    .then((res) => res.json())

    const { data, error } = useSWR(
        `http://localhost:5001/collaborative-recommend?person_id=${users?.user?.personId}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    );

    

    const fetchSuggestCourses = async (suggestColUrl: string) => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(suggestColUrl, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                credentials: 'include'
            });
    
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

    const fetchCoursesFree = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/courses/public/getCourseWithAvgRatingFreeRandom', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const dataCourseFree: [ICourse, number][] = await response.json();
            
            const coursesWithRatings: ICourseWithRating[] = dataCourseFree.map(item => ({
                course: item[0],
                rating: item[1],
            }));
            
            setdataCourseFree(coursesWithRatings); 
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    const fetchCoursesNew = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/courses/public/getFinalCourseWithAverageRating', {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const dataCourseNew: [ICourse, number][] = await response.json();
            
            const coursesWithRatings: ICourseWithRating[] = dataCourseNew.map(item => ({
                course: item[0],
                rating: item[1],
            }));
            
            setdataCourseNew(coursesWithRatings); 
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    

    useEffect(() => {
        if (Array.isArray(data)) {
            const courseIds = data.join(',');
            const url = `http://localhost:8080/api/courses/auth/suggest-course?courseIds=${courseIds}`;
            fetchSuggestCourses(url);
        }
        fetchCoursesFree();
        fetchCoursesNew();
    }, [data]);
    
    useEffect(() => {
        const levelsParam =
            selectedLevels && selectedLevels.length > 0
                ? encodeURIComponent(selectedLevels.join(','))
                : 'null';
        const pricesParams = Object.values(selectedPrices).map((prices) =>
        prices && prices.length > 0 ? encodeURIComponent(prices.join(',')) : 'null'
        );
        const [prices1, prices2, prices3, prices4, prices5] = pricesParams;
        const categorysParam =
            selectedCategories && selectedCategories.length > 0
                ? encodeURIComponent(selectedCategories.join(','))
                : 'null';
        const languagesParam =
            selectedLanguages && selectedLanguages.length > 0
                ? encodeURIComponent(selectedLanguages.join(','))
                : 'null';
        setActivePage(1); 
        setPageNumber(1);
        fetchCoursesFilter(selectedRating,languagesParam,categorysParam,levelsParam,prices1,
            prices2,
            prices3,
            prices4,
            prices5,
            selectedFreePrice,pageNumber-1);
        renderPaginationItems();
    }, [selectedLevels,selectedRating,selectedPrices,selectedCategories, selectedLanguages,selectedFreePrice]);
    useEffect(() => {
        const levelsParam =
            selectedLevels && selectedLevels.length > 0
                ? encodeURIComponent(selectedLevels.join(','))
                : 'null';
        const pricesParams = Object.values(selectedPrices).map((prices) =>
        prices && prices.length > 0 ? encodeURIComponent(prices.join(',')) : 'null'
        );
        const [prices1, prices2, prices3, prices4, prices5] = pricesParams;
        const categorysParam =
            selectedCategories && selectedCategories.length > 0
                ? encodeURIComponent(selectedCategories.join(','))
                : 'null';
        const languagesParam =
            selectedLanguages && selectedLanguages.length > 0
                ? encodeURIComponent(selectedLanguages.join(','))
                : 'null';
        


        fetchCoursesFilter(selectedRating,languagesParam,categorysParam,levelsParam,prices1,
            prices2,
            prices3,
            prices4,
            prices5,
            selectedFreePrice,pageNumber-1);
    }, [pageNumber]);




    
    
    return (
        <div>
            <Carousel style={{
                marginTop : '80px'
            }}>
                <Carousel.Item interval={1500}>
                <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                    <img
                        className="d-block w-100"
                        src="/img/background_course1.png"
                        alt="Image One"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu đen với độ trong suốt
                    }} />
                </div>

                <Carousel.Caption>
                    <h1 style={{fontSize: '3.0rem'}}>Learn Programming, Open The Door To Success</h1>
                    <p style={{fontSize: '1.5rem'}}>Create a positive learning environment where students can explore and develop programming skills to build innovative products.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={1500}>
                <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                    <img
                        className="d-block w-100"
                        src="/img/background_course2.png"
                        alt="Image One"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu đen với độ trong suốt
                    }} />
                </div>
                <Carousel.Caption>
                    <h1 style={{fontSize: '3.0rem'}}>Programming Is An Art, Learn To Create</h1>
                    <p style={{fontSize: '1.5rem'}}>Provide flexible and practical learning methods, encourage students to pursue their passion for programming and develop their own unique products.</p>
                </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={1500}>
                <div style={{ position: 'relative', width: '100%', height: '600px' }}>
                    <img
                        className="d-block w-100"
                        src="/img/background_course3.png"
                        alt="Image One"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)' // Màu đen với độ trong suốt
                    }} />
                </div>
                <Carousel.Caption>
                    <h1 style={{fontSize: '3.0rem'}}>Learn Today, Succeed Tomorrow</h1>
                    <p style={{fontSize: '1.5rem'}}>Provide quality courses from basic to advanced, helping students master the knowledge and skills needed to become a professional web developer.</p>
                </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
            <PRSuggest
            courses={dataSuggest || []}
            freeCourses = {dataCourseFree || []}
            newCourses = {dataCourseNew|| []}
            type={1}
            />
            <div className={course['ads']}>
                <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                    <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                        <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                            <div className={course['ads-item']}>
                                <div className={course['icon']}>
                                    <FontAwesomeIcon icon={faPlay}/>
                                </div>
                                
                                <h3>
                                    Learn at your own pace, with lifetime access on mobile and desktop
                                </h3>
                            </div>
                        </div>
                        <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                            <div className={course['ads-item']}>
                                <div className={course['icon']}>
                                    <FontAwesomeIcon icon={faStar}/>
                                </div>
                                
                                <h3>
                                    Choose courses taught by real-world experts
                                </h3>
                            </div>
                        </div>
                        <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                            <div className={course['ads-item']}>
                                <div className={course['icon']}>
                                    <FontAwesomeIcon icon={faBook}/>
                                </div>
                    
                                <h3>
                                    Learn in-demand skills with over 25 video courses
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={course['container']}>
                <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                        <div>
                            <h3 className={course['container_title']}>
                                All Courses
                            </h3>
                            <h1 className={course['container_slogan']}>
                                All Quality Courses At LeHerry Academy
                            </h1>
                        </div>
                        <div style={{position : 'relative', opacity : loading ? '0.4' : '1',}}>
                            <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`}>
                                    <div className={course['filler_button']}>
                                        <FontAwesomeIcon icon={faFilter}/>
                                        <h3>Filter</h3>
                                    </div>
                                </div>

                                <div className={`${GridSystem['col']} ${GridSystem['l-9']}`}>
                                    <div className={course['filter--result']}>
                                        <h3 onClick={() => setBefaulFilter()} style={{
                                            cursor : 'pointer'
                                        }}>Clear filters</h3>
                                        <h3>Results</h3>
                                    </div>
                                </div>
                            </div>
                            <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']} ${GridSystem['course_container']}`}>
                                <div className={`${GridSystem['col']} ${GridSystem['l-3']}`}>
                                    <div className={course['nav--filter']}>
                                        
                                        <div className={course['filter_rate']}>
                                            <h3>Ratings</h3>
                                            <ul>
                                                {['4.5 & up', '4.0 & up', '3.5 & up', '3.0 & up']
                                                    .map((rate, index) => (
                                                        <li key={index}>

                                                            <input
                                                                type="radio"
                                                                name="rate"
                                                                checked={checkedStates.rating?.includes(rate) ? true : false}
                                                                onChange={() => {setSelectedRating(
                                                                    rate === '4.5 & up' ? '4.5' :
                                                                    rate === '4.0 & up' ? '4.0' :
                                                                    rate === '3.5 & up' ? '3.5' : '3.0'
                                                                )
                                                                
                                                                handleSetCheckState('rating', rate)
                                                            }     
                                                            }
                                                            />
                                                            <div className={course['stars']}>
                                                                <FontAwesomeIcon icon={faStar}  style={{
                                                                    width: '14px',
                                                                    color: '#FFD43B',
                                                                    marginBottom : '3px'
                                                                    
                                                                }}/>
                                                            </div>
                                                            <h4>{rate}</h4>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                        <div className={course['filter_item']}>
                                            <h3>Price</h3>
                                            <ul>
                                                {['Free', '1-50$', '50-100$', '100-150$', '150-200$', '200+']
                                                    .slice(0, showMorePrice ? undefined : 4)
                                                    .map((price, index) => (
                                                        <li key={index}>
                                                            <input
                                                                type="checkbox"
                                                                name="price"
                                                                checked={checkedStates.prices.includes(price) ? true : false}
                                                                onChange={() => {
                                                                    if (price === '1-50$') {
                                                                        handleCheckboxPriceChange(1, '1');
                                                                        handleCheckboxPriceChange(1, '50');
                                                                    } else if (price === '50-100$') {
                                                                        handleCheckboxPriceChange(2, '50');
                                                                        handleCheckboxPriceChange(2, '100');
                                                                    } else if (price === '100-150$') {
                                                                        handleCheckboxPriceChange(3, '100');
                                                                        handleCheckboxPriceChange(3, '150');
                                                                    } else if (price === '150-200$') {
                                                                        handleCheckboxPriceChange(4, '150');
                                                                        handleCheckboxPriceChange(4, '200');
                                                                    } else if (price === '200+') {
                                                                        handleCheckboxPriceChange(5, '200');
                                                                        handleCheckboxPriceChange(5, '400');
                                                                    }
                                                                    else if (price === 'Free') {
                                                                        setSelectedFreePrice('Free')
                                                                    }
                                            
                                                                    handleSetCheckState('prices', price);
                                                            }     
                                                            }
                                                            />
                                                            <h4>{price}</h4>
                                                        </li>
                                                    ))}
                                            </ul>
                                            <h4
                                                className={course['show']}
                                                onClick={() => setShowMorePrice(!showMorePrice)}
                                            >
                                                {showMorePrice ? 'Show less' : 'Show more'}
                                            </h4>
                                        </div>

                                        
                                        {/* Filter Level */}
                                        <div className={course['filter_item']}>
                                            <h3>Level</h3>
                                            <ul>
                                                {['Beginner Level', 'Intermediate Level', 'Expert Level', 'All Levels']
                                                    .map((level, index) => (
                                                        <li key={index}>
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedStates.levels.includes(level) ? true : false}
                                                                onChange={() => {
                                                                    handleCheckboxLevelChange(level)
                                                                    handleSetCheckState('levels', level)
                                                                }}
                                                            />
                                                            <h4>{level}</h4>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>


                                        {/* Filter Category */}
                                        <div className={course['filter_item']}>
                                            <h3>Category</h3>
                                            <ul>
                                                {[
                                                    'Frontend Development',
                                                    'Backend Development',
                                                    'Fullstack Development',
                                                    'DevOps/Cloud Computing',
                                                    'CMS',
                                                    'Web Design/UX/UI',
                                                    'API Development',
                                                    'Database Management',
                                                    'Security',
                                                ]
                                                    .slice(0, showMoreCategory ? undefined : 4)
                                                    .map((category, index) => (
                                                        <li key={index}>
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedStates.categories.includes(category) ? true : false}
                                                                onChange={() => {
                                                                    handleCheckboxCategoryChange(
                                                                        category == 'DevOps/Cloud Computing' ? 'DevOps_Cloud Computing' :
                                                                        category == 'Web Design/UX/UI' ? 'Web Design_UX_UI' :
                                                                        category
                                                                    )
                                                                    handleSetCheckState('categories', category)
                                                                    
                                                                }}
                                                            />
                                                            <h4>{category}</h4>
                                                        </li>
                                                    ))}
                                            </ul>
                                            <h4
                                                className={course['show']}
                                                onClick={() => setShowMoreCategory(!showMoreCategory)}
                                            >
                                                {showMoreCategory ? 'Show less' : 'Show more'}
                                            </h4>
                                        </div>

                                        {/* Filter Language */}
                                        <div className={course['filter_item']}>
                                            <h3>Language</h3>
                                            <ul>
                                                {[
                                                    'Java',
                                                    'JavaScript',
                                                    'PHP',
                                                    'C#',
                                                    'Python',
                                                    'TypeScript',
                                                    'Ruby',
                                                    'SQL',
                                                    'HTML/CSS',
                                                ]
                                                    .slice(0, showMoreLanguage ? undefined : 5)
                                                    .map((language, index) => (
                                                        <li key={index}>
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedStates.languages.includes(language) ? true : false}
                                                                onChange={() => {
                                                                    handleCheckboxlangugaeChange(
                                                                        language == 'HTML/CSS' ? 'HTML_CSS' :
                                                                        language)
                                                                    handleSetCheckState('languages', language)
                                                                }}
                                                            />
                                                            <h4>{language}</h4>
                                                        </li>
                                                    ))}
                                            </ul>
                                            <h4
                                                className={course['show']}
                                                onClick={() => setShowMoreLanguage(!showMoreLanguage)}
                                            >
                                                {showMoreLanguage ? 'Show less' : 'Show more'}
                                            </h4>
                                        </div>



                                        <div className={course['filter_item']}>
                                            <h3>
                                                Video Duration <img src="./assets/img/arrowhead-up.png" alt="" />
                                            </h3>
                                            <ul>
                                                <li>
                                                    <input type="checkbox" name="video_duration" id="" />
                                                    <h4>0-1 Hour</h4>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="video_duration" id="" />
                                                    <h4>1-3 Hours</h4>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="video_duration" id="" />
                                                    <h4>3-6 Hours</h4>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="video_duration" id="" />
                                                    <h4>6-17 Hours</h4>
                                                </li>
                                                <li>
                                                    <input type="checkbox" name="video_duration" id="" />
                                                    <h4>17+ Hours</h4>
                                                </li>
                                            </ul>
                                            <h4 className={course['show']}>Show more</h4>
                                        </div>

                                        
                                    </div>

                                </div>
                                <div className={`${GridSystem['col']} ${GridSystem['l-9']}`}>
                                    <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                                    {dataCourseFilter && dataCourseFilter.map(({ course, rating }) => (
                                                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`} key={course.courseId} style={{ position: 'relative' }}>
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
                                    <Pagination className={pagination['pagination']}>
                                        <Pagination.First className={pagination['paginationFirst']} onClick={() => handlePageClick(1)} />
                                        {renderPaginationItems()}
                                        <Pagination.Last className={pagination['paginationLast']} onClick={() => handlePageClick(totalPage)} />
                                    </Pagination>
                                </div>
                            </div>
                            {loading && (
                                <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Lớp phủ mờ
                                    zIndex: 10, 
                                    pointerEvents: 'none', 
                                }}
                                />
                            )}
                            {loading && (
                                <div className={course['load_courses']}>
                                <Spinner animation="border" style={{ width: '200px', height: '200px', color: '#F48C06' }} />
                                </div>
                            )}
                        </div>
                        
                </div>
            </div>

        </div>
    )
}

export default coursesPage