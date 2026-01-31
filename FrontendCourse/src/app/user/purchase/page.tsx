'use client'

import { faAngleUp, faArrowCircleUp, faArrowUp, faCheck, faSearch, faTicket, faUpLong } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap"
import header from '@/styles/header.module.css'


import pagination from '@/styles/paginations.module.css';
import PayPalPayment from "@/components/PayPalPayment.modal"
import { useUser } from "@/context/UserContext"
import { checkApiStatus } from "@/app/globalfunction"
import { toast } from "react-toastify"






const purchasePage = () => {
    const users = useUser();

    const [activePage, setActivePage] = useState(1);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [startItem, setStartItem] = useState<number>(0);
    const [endItem, setEndItem] = useState<number>(5);
    const [allSelected, setAllSelected] = useState<boolean>(false); 
    const [countSelectedCart, setCountSelectedCart] = useState<number>(0)
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [originPrice, setOriginlPrice] = useState<number>(0)
    const [savePrice, setSavePrice] = useState<number>(0)
    const [allFreeSelected, setAllFreeSelected] = useState<boolean>(false);
    const [paymentProcess, setPayMentProcess] = useState<boolean>(false)
    const personId = users?.user?.personId;



    
     const handlePageClick = (pageNumber : number) => {
            setActivePage(pageNumber);
            setPageNumber(pageNumber);
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

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setAllSelected(isChecked);
        users!.cards!.forEach((item: any) => (item.selected = isChecked)); 
        const updatedCards = [...users!.cards!];
        users!.updateCards(updatedCards);

    };


    //Update Checked Cart
    const handleItemChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        
        const isChecked = event.target.checked;
        const itemIndex = startItem + index;

        const updatedCards = [...users!.cards!];
        updatedCards[itemIndex].selected = isChecked;




    users!.updateCards(updatedCards);

    setAllSelected(updatedCards.slice(startItem, endItem).every((item: any) => item.selected));
    };
    

    // Tính tổng tiền
    const calculateTotalPrice = () => {
        if (!users || !users.cards) {
            return 0; 
        }
        const originTotal = users.cards.reduce((total: number, cart: any) => {
            if (cart.selected && cart.course.originalPrice !== "Free") {
                return total + parseFloat(cart.course.originalPrice); 
            }
            return total; 
        }, 0);
    
        const total =  users.cards.reduce((total: number, cart: any) => {
            if (cart.selected && cart.course.price !== "Free") {
                return total + parseFloat(cart.course.price); 
            }
            return total; 
        }, 0); 
        const save = originTotal - total
        setOriginlPrice(originTotal)
        setTotalPrice(total)
        setSavePrice(save)
    };
    const removeSelectedItems = () => {
        const updatedCards = users!.cards!.filter((cart: any) => !cart.selected);
        users!.updateCards(updatedCards);  
        setAllSelected(false);  
    };

    // Check Tất cả khoá học select là free
    const checkAllFreeSelected = () => {
        if (!users || !users.cards) {
            setAllFreeSelected(false);
            return;
        }
    
        const selectedCards = users.cards.filter((cart: ICart) => cart.selected);
    
        if (selectedCards.length === 0) {
            setAllFreeSelected(false);
            return;
        }
    
        const allFree = selectedCards.every(
            (cart: ICart) => cart.course.originalPrice === "Free"
        );
    
        console.log("All selected courses are free:", allFree);
        setAllFreeSelected(allFree);
    };

    
    
    
    
    

    const ProcessPayMent = async () => {
        const selectedCourseIds = users!.cards!.filter((cart: ICart) => cart.selected) 
            .map((cart: ICart) => cart.course.courseId); 
    
        if (!selectedCourseIds || selectedCourseIds.length === 0) {
            return false;
        }
        const queryParams = new URLSearchParams({
            personId: `${personId}`,
            courseIds: selectedCourseIds.join(','),
        });
        

        if(paymentProcess == true){
            const resultAddCourse = await fetchRegistrationCourse(queryParams);
            if(resultAddCourse == true){
                if(allSelected == true){
                    const result  = await fetchDeleteAllCart()
                    if(result) deleteAllCart()
                }else{
                    const result  = await fetchDeleteSelectedCarts(queryParams)
                    if(result) removeSelectedItems()
                }
                toast.success("Course registration successful")   
                setPayMentProcess(false)
            }
        }
    }

    const RegisCourseFree = async () => {
        const selectedCourseIds = users!.cards!
        .filter(
            (cart: ICart) => cart.selected && cart.course.originalPrice === "Free"
        )
        .map((cart: ICart) => cart.course.courseId);

        if (!selectedCourseIds || selectedCourseIds.length === 0) {
            return false;
        }
        const queryParams = new URLSearchParams({
            personId: `${personId}`,
            courseIds: selectedCourseIds.join(','),
        });
            const resultAddCourse = await fetchRegistrationCourse(queryParams);
            if(resultAddCourse == true){
                if(allSelected == true){
                    const result  = await fetchDeleteAllCart()
                    if(result) deleteAllCart()
                }else{
                    const result  = await fetchDeleteSelectedCarts(queryParams)
                    if(result) removeSelectedItems()
                }
                toast.success("Course registration successful")   
                setPayMentProcess(false)
            }
    }

    const handleBtnDeleteAll = async () => {
        const selectedCourseIds = users!.cards!.filter((cart: ICart) => cart.selected) 
            .map((cart: ICart) => cart.course.courseId); 
    
        if (!selectedCourseIds || selectedCourseIds.length === 0) {
            return false;
        }
        const queryParams = new URLSearchParams({
            personId: `${personId}`,
            courseIds: selectedCourseIds.join(','),
        });
        if(allSelected == true){
            const result  = await fetchDeleteAllCart()
            if(result) deleteAllCart()
        }else{
            const result  = await fetchDeleteSelectedCarts(queryParams)
            if(result) removeSelectedItems()
        }
    }

    const deleteAllCart = () =>{
        users?.updateCards([])
    }

    // Xử lý button xoá toàn bộ
    

    // API xoá toàn bộ
    const fetchDeleteAllCart = async (): Promise<boolean> => {
        try {
            const response = await fetch(`http://localhost:8080/api/cart/auth/removeAllCartsByPersonId?personId=${personId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
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

    // API xoá khoá học selected
    const fetchDeleteSelectedCarts = async (queryParams : URLSearchParams): Promise<boolean> => {
        try {
            
    
            const response = await fetch(`http://localhost:8080/api/cart/auth/removeListCartSelected?${queryParams}`, {
                method: 'DELETE',
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
    
    
    
    




    useEffect(() => {
        if (users?.cards) {
            const total = Math.ceil(users.cards.length / 5);
            setTotalPage(total);

            if(activePage >=2){
                setStartItem((activePage - 1) * 5)
                setEndItem(5*activePage)
            }
            else{
                setStartItem(0)
                setEndItem(5)
            }

        }
        setCountSelectedCart(users!.cards!.filter((cart: any) => cart.selected).length)
        calculateTotalPrice()
        checkAllFreeSelected();
    }, [users, activePage]);

    useEffect(() => {

        ProcessPayMent()
    }, [paymentProcess]);






      
    
    
    return (
        <div>
            <table className="cart-table">
                <thead>
                    <tr>
                        <th><input 
                        type="checkbox"
                        checked={allSelected}
                                onChange={handleSelectAll}/></th>
                        <th>Product</th>
                        <th>Original Price</th>
                        <th>Current Price</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    
                    {users?.cards && users?.cards.length > 0 ? (
                        users?.cards
                        .slice(startItem, endItem)
                            .map((cartItem, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type="checkbox" checked={cartItem.selected} onChange={(e) => handleItemChange(index, e)}/>
                                    </td>
                                    <td>
                                        <div className="product-info">
                                            <img src={cartItem.course.urlImg} alt="Product"/>
                                            <div className="product-details">
                                                <h4>{cartItem.course.courseTitle}
                                                </h4>
                                                <p>Language: {cartItem.course.languagesProgramming} </p>
                                                <div className="voucherContainer">
                                                <FontAwesomeIcon icon={faTicket}/>
                                                <span className="voucher">View the shop's voucher for you</span>
                                                </div>
                                                
                                            </div>
                                        </div>
                                    </td>
                                    <td>{cartItem.course.originalPrice == 'Free' ? cartItem.course.originalPrice : cartItem.course.originalPrice + "$" }</td>
                                    <td>{cartItem.course.price == 'Free' ? cartItem.course.price : cartItem.course.price + "$"}</td>
                                    <td className="actions">
                                        <h3 >Delete</h3> 
                                        <h3 >Find similar courses</h3>
                                    </td>
                                </tr>

                            ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                <p>No courses found in your cart.</p>
                            </td>
                            
                        </tr>
                    )}

                </tbody>
            </table>
            <Pagination className={pagination['pagination']}>
                                        <Pagination.First className={pagination['paginationFirst']} onClick={() => handlePageClick(1)} />
                                        {renderPaginationItems()}
                                        <Pagination.Last className={pagination['paginationLast']} onClick={() => handlePageClick(totalPage)} />
                                    </Pagination>
                                    
            <div className="pay_container">
            <ul className="discount">
                <li>
                <FontAwesomeIcon icon={faCheck}/>
                Discounted by $10
                </li>
                <li>
                    <FontAwesomeIcon icon={faTicket}/>
                     Academy Code
                </li>
                <li>
                    Select or enter code
                </li>
            </ul>
            <ul className="pay">
                <li><input type="checkbox" checked={allSelected}
                                onChange={handleSelectAll} /></li>
                <li>Selected Course ({countSelectedCart})</li>
                <li onClick={handleBtnDeleteAll}>Delete All</li>
                <li>Total Payment ({countSelectedCart} courses):</li>

                <li>
                    <div>{totalPrice}$ <FontAwesomeIcon icon={faAngleUp}/></div>
                    <div>
                        <span>Save: </span>
                        <h3>{savePrice}$</h3>
                    </div>

                    <div className="promo-container">
                        <h2>Promotion Details</h2>
                        <table className="promo-table">
                        <tr>
                            <td>Total Amount</td>
                            <td className="align-right">{originPrice}$</td>
                        </tr>
                        <tr>
                            <td>Discount Voucher</td>
                            <td className="align-right">-0$</td>
                        </tr>
                        <tr>
                            <td>Total Product Discount</td>
                            <td className="align-right">{totalPrice}$</td>
                        </tr>
                        <tr className="highlight">
                            <td>Savings</td>
                            <td className="align-right negative">-{savePrice}$</td>
                        </tr>
                        <tr className="total">
                            <td>Total Payment</td>
                            <td className="align-right">{totalPrice}$</td>
                        </tr>
                        </table>
                        <p className="note">Final amount payable</p>
                    </div>
                </li>
                {totalPrice !=0 ? (<li><PayPalPayment
                totalPrice={totalPrice}
                paymentProcess = {paymentProcess}
                setPayMentProcess={setPayMentProcess}
                ></PayPalPayment></li>) : allFreeSelected?  
                <li className="RegisFree" onClick={RegisCourseFree}>Register For The Courses</li> :
                ("")
                }

            </ul>
            </div>
            
        </div>

    )
}

export default purchasePage