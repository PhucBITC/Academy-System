'use client'
import '@/styles/course_video.css'
import CourseItem from '@/styles/course_item.module.css'
import GridSystem from '@/styles/grid.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'next/navigation';


const videoPage = () => {
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isUnlocked, setIsUnlocked] = useState<boolean>(false);


    const params = useParams();
    const courseId = params.courseId as string;

    // DATA CỨNG (Hardcoded) - Anh có thể thêm video cho từng khóa học ở đây
    const videoDatabase: Record<string, string> = {
        "1": "https://res.cloudinary.com/df4t92mre/video/upload/v1736840743/video1_1_1_dwaql5.mp4", // Test
        "default": "https://res.cloudinary.com/df4t92mre/video/upload/v1736840743/video1_1_1_dwaql5.mp4"
    };

    const currentVideoUrl = videoDatabase[courseId] || videoDatabase["default"];


    const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const current = e.currentTarget.currentTime;
        const duration = e.currentTarget.duration;

        setCurrentTime(current);

        if (duration - current <= 5 && !isUnlocked) {
            unlockNextVideo();
            setIsUnlocked(true);
        }
    };


    const unlockNextVideo = () => {

        const currentVideoElement = document.querySelector('.watch') as HTMLLIElement | null;

        if (currentVideoElement) {
            const currentIcon = currentVideoElement.querySelector('.check') as HTMLElement | null;
            if (currentIcon) {
                currentIcon.classList.add('checked');
            }

            const currentUl = currentVideoElement.closest('ul.course_lesson--list') as HTMLUListElement | null;
            const parentContentDiv = currentVideoElement.closest('.course_content') as HTMLElement | null;
            const nextLi = currentVideoElement.nextElementSibling as HTMLLIElement | null;
            let totalLi: number = 0;
            let watchPosition: number = -1;

            if (currentUl) {
                const liElements = currentUl.querySelectorAll('li');
                totalLi = liElements.length;

                watchPosition = Array.from(liElements).indexOf(currentVideoElement);
            }

            if (nextLi && nextLi.classList.contains('lock')) {
                nextLi.classList.remove('lock');

                const nextLockIcon = nextLi.querySelector('.lock') as HTMLElement | null;
                const nextCheckIcon = nextLi.querySelector('.check') as HTMLElement | null;

                if (nextLockIcon) nextLockIcon.classList.add('hide');
                if (nextCheckIcon) nextCheckIcon.classList.remove('hide');
            } else if (parentContentDiv) {

                if ((watchPosition + 1) == totalLi) {
                    const nextContentDiv = parentContentDiv.nextElementSibling as HTMLElement | null;
                    if (nextContentDiv && nextContentDiv.classList.contains('course_content')) {
                        const nextUl = nextContentDiv.querySelector('ul.course_lesson--list') as HTMLUListElement | null;
                        if (nextUl) {
                            const firstLi = nextUl.querySelector('li') as HTMLLIElement | null;  // Ép kiểu thành HTMLLIElement
                            if (firstLi && !firstLi.classList.contains('lock')) {
                                return;
                            }
                            if (firstLi) {
                                firstLi.classList.remove('lock');

                                const firstLockIcon = firstLi.querySelector('.lock') as HTMLElement | null;
                                const firstCheckIcon = firstLi.querySelector('.check') as HTMLElement | null;

                                if (firstLockIcon) firstLockIcon.classList.add('hide');
                                if (firstCheckIcon) firstCheckIcon.classList.remove('hide');
                            }
                        }
                    }
                }
            }
        }
    };




    const handlePlayClick = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };



    useEffect(() => {
        const lessonItems = document.querySelectorAll('.course_lesson--list li');

        lessonItems.forEach((li, index) => {
            li.addEventListener('click', () => {
                if (!li.classList.contains('lock')) {
                    const previousWatchItem = document.querySelector('.course_lesson--list li.watch');
                    if (previousWatchItem) {
                        previousWatchItem.classList.remove('watch');
                    }

                    li.classList.add('watch');

                    if (videoRef.current) {
                        videoRef.current.pause()
                        videoRef.current.currentTime = 0;
                        setIsPlaying(false)
                        setIsUnlocked(false);
                    }

                }
            });
        });

        return () => {
            lessonItems.forEach((li) => {
                li.removeEventListener('click', () => { });
            });
        };
    }, []);


    return (
        <div className='videocontainer'>
            <div className={`${GridSystem['grid']} ${GridSystem['wide']}`}>
                <div className={`${GridSystem['row']} ${GridSystem['sm-gutter']}`}>
                    <div className={`${GridSystem['col']} ${GridSystem['l-8']}`}>
                        <div className="coursevideo">
                            {!isPlaying && (
                                <div className="video_pause">
                                    <div className="video-overlay">
                                        <div className="play-button" onClick={handlePlayClick}>
                                            ▶️
                                        </div>
                                    </div>
                                </div>
                            )}
                            <video
                                ref={videoRef}
                                controls
                                width="100%"
                                onTimeUpdate={handleTimeUpdate}
                                style={{ display: isPlaying ? 'block' : 'none' }}
                                src={currentVideoUrl}
                            >
                            </video>
                        </div>
                    </div>
                    <div className={`${GridSystem['col']} ${GridSystem['l-4']}`}>
                        <div className='course_menu'>
                            <div className='course_content'>
                                <div className='course_content--header'>
                                    <div>
                                        <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']} />
                                        <h3 className='course_content--index'>
                                            1.
                                        </h3>
                                        <h3 className='course_content--name'>
                                            Introduction Introduction
                                            Introduction Introduction
                                        </h3>
                                    </div>

                                    <h3 className='course_content_lesson'>
                                        3 lessons
                                    </h3>
                                </div>
                                <ul className='course_lesson--list'>
                                    <li className='watch'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock hide' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check' />
                                            <h4 className='lesson_index'>1.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>

                                        <h4 className='lesson_time'>01:03</h4>
                                    </li>
                                    <li className='lock'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check hide' />
                                            <h4 className='lesson_index'>2.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>

                                        <h4 className='lesson_time'>01:03</h4>
                                    </li>
                                </ul>
                            </div>
                            <div className='course_content'>
                                <div className='course_content--header'>
                                    <div>
                                        <FontAwesomeIcon icon={faMinus} className={CourseItem['icon_minus']} />
                                        <h3 className='course_content--index'>
                                            2.
                                        </h3>
                                        <h3 className='course_content--name'>
                                            Introduction Introduction
                                            Introduction Introduction
                                        </h3>
                                    </div>

                                    <h3 className='course_content_lesson'>
                                        3 lessons
                                    </h3>
                                </div>
                                <ul className='course_lesson--list'>
                                    <li className='lock'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check hide' />
                                            <h4 className='lesson_index'>1.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>

                                        <h4 className='lesson_time'>01:03</h4>
                                    </li>
                                    <li className='lock'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check hide' />
                                            <h4 className='lesson_index'>2.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>

                                        <h4 className='lesson_time'>01:03</h4>
                                    </li>
                                    <li className='lock'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check hide' />
                                            <h4 className='lesson_index'>3.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>
                                        <div className='videoStatus' >
                                            <h4 className='lesson_time'>01:03</h4>
                                        </div>

                                    </li>
                                    <li className='lock'>
                                        <div>
                                            <FontAwesomeIcon icon={faLock} className='icon lock' />
                                            <FontAwesomeIcon icon={faCheckCircle} className='icon check hide' />
                                            <h4 className='lesson_index'>4.</h4>
                                            <h4 className='lesson_name'>Course_information</h4>
                                        </div>
                                        <div className='videoStatus' >
                                            <h4 className='lesson_time'>01:03</h4>
                                        </div>

                                    </li>

                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default videoPage