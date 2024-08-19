// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import { faTwitterSquare, faFacebookSquare, faSnapchatSquare } from '@fortawesome/free-brands-svg-icons';
// // import { TfiNewWindow } from "react-icons/tfi";
// // import { GiSofa } from "react-icons/gi";
// // import { GoStopwatch } from "react-icons/go";
// // import './css/LandingPage.css';
// // import logo from './image/logo.png';


// // const Hero = () => (
// //     <section className="hero">
// //         <img src={logo} alt="Logo" />
// //     </section>
// // );

// // const Section = ({ title, children }) => (
// //     <section>
// //         <h3 className="title">{title}</h3>
// //         <hr />
// //         {children}
// //     </section>
// // );

// // const LandingPage = () => {
// //     const navigate = useNavigate();
// //     return (
// //         <div className='LandingPage'>
// //             <Hero />
// //             <Section title="About us">
// //                 <p>you can achieve queues in one click
// //                     Do you have an independent business? Are you tired of your customers calling again and again to make an appointment or change the date and maybe even move it by just a few hours and you no longer have the strength to write and delete in the diary every time???
// //                     If you identified with what was written or even with a part, then your place is with us!!
// //                     We at "queueInClick" will help you operate your queue system in the best and most efficient way - for you and your customers who will of course be satisfied!" </p>
// //                 <ul className="grid destinations">
// //                     <li className="small image-1"></li>
// //                     <li className="large image-2"></li>
// //                     <li className="large image-3"></li>
// //                     <li className="small image-4"></li>
// //                 </ul>
// //             </Section>

// //             <Section title="Our advantages">
// //                 <ul className="grid packages">
// //                     <li>
// //                         <TfiNewWindow size="80px" />
// //                         <h4>innovation</h4>
// //                         <p>Conduct in an innovative and practical way.</p>
// //                     </li>
// //                     <li>
// //                         <GiSofa size="80px" />
// //                         <h4>comfort</h4>
// //                         <p>The ability to make appointments from home independently easily and conveniently.</p>
// //                     </li>
// //                     <li>
// //                         <GoStopwatch size="80px" />
// //                         <h4>efficiency</h4>
// //                         <p>The system enables the utilization of time and saves the time of waiting for the secretary on the phone to make an appointment or cancel it..</p>
// //                     </li>
// //                 </ul>
// //             </Section>

// //             <Section title="lets visit">
// //                 <div className="buttons-container">
// //                     <button type="button" onClick={() => navigate('/register')}>Register</button>
// //                     <button type="button" onClick={() => navigate('/login')}>Login</button>
// //                 </div>
// //             </Section>

// //             <footer>
// //                 <p>Images courtesy of <a href="http://unsplash.com/">unsplash</a>.</p>
// //                 <p>Footer content.</p>
// //                 <ul>
// //                     <li><a href="#"><FontAwesomeIcon icon={faTwitterSquare} /></a></li>
// //                     <li><a href="#"><FontAwesomeIcon icon={faFacebookSquare} /></a></li>
// //                     <li><a href="#"><FontAwesomeIcon icon={faSnapchatSquare} /></a></li>
// //                 </ul>
// //             </footer>
// //         </div>
// //     );
// // };

// // export default LandingPage;

// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTwitterSquare, faFacebookSquare, faSnapchatSquare } from '@fortawesome/free-brands-svg-icons';
// import { TfiNewWindow } from "react-icons/tfi";
// import { GiSofa } from "react-icons/gi";
// import { GoStopwatch } from "react-icons/go";
// import './css/LandingPage.css';
// import logo from './image/logo.png';

// const Hero = () => (
//     <section className="hero">
//         <img src={logo} alt="Logo" />
//     </section>
// );

// const Section = ({ title, children }) => (
//     <section>
//         <h3 className="title">{title}</h3>
//         <hr />
//         {children}
//     </section>
// );

// const Dropdown = ({ options, onSelect }) => (
//     <div className="dropdown">
//         {options.map((option, index) => (
//             <button key={index} onClick={() => onSelect(option.path)}>
//                 {option.label}
//             </button>
//         ))}
//     </div>
// );

// const LandingPage = () => {
//     const navigate = useNavigate();
//     const [showCustomerOptions, setShowCustomerOptions] = useState(false);
//     const [showProfessionalOptions, setShowProfessionalOptions] = useState(false);

//     const customerOptions = [
//         { label: 'Login', path: '/login' },
//         { label: 'Register', path: '/register' }
//     ];

//     const professionalOptions = [
//         { label: 'Login', path: '/login' },
//         { label: 'Register', path: '/registerCustomer' }
//     ];

//     const handleNavigate = (path) => {
//         navigate(path);
//     };

//     return (
//         <div className='LandingPage'>
            
//                 <div className="button-container">
//                     <button onClick={() => setShowCustomerOptions(!showCustomerOptions)}>Customer</button>
//                     {showCustomerOptions && <Dropdown options={customerOptions} onSelect={handleNavigate} />}
//                     <button onClick={() => setShowProfessionalOptions(!showProfessionalOptions)}>Professional</button>
//                     {showProfessionalOptions && <Dropdown options={professionalOptions} onSelect={handleNavigate} />}
//                 </div>
            
//             <Hero />
//             <Section  title="About us">
//                 <p>
//                     you can achieve queues in one click
//                     Do you have an independent business? Are you tired of your customers calling again and again to make an appointment or change the date and maybe even move it by just a few hours and you no longer have the strength to write and delete in the diary every time???
//                     If you identified with what was written or even with a part, then your place is with us!!
//                     We at "queueInClick" will help you operate your queue system in the best and most efficient way - for you and your customers who will of course be satisfied!
//                 </p>
//                 <ul className="grid destinations">
//                     <li className="small image-1"></li>
//                     <li className="large image-2"></li>
//                     <li className="large image-3"></li>
//                     <li className="small image-4"></li>
//                 </ul>
//             </Section>

//             <Section title="Our advantages">
//                 <ul className="grid packages">
//                     <li>
//                         <TfiNewWindow size="80px" />
//                         <h4>innovation</h4>
//                         <p>Conduct in an innovative and practical way.</p>
//                     </li>
//                     <li>
//                         <GiSofa size="80px" />
//                         <h4>comfort</h4>
//                         <p>The ability to make appointments from home independently easily and conveniently.</p>
//                     </li>
//                     <li>
//                         <GoStopwatch size="80px" />
//                         <h4>efficiency</h4>
//                         <p>The system enables the utilization of time and saves the time of waiting for the secretary on the phone to make an appointment or cancel it.</p>
//                     </li>
//                 </ul>
//             </Section>

//             <Section title="lets visit">
//                 <div className="buttons-container">
//                     <button type="button" onClick={() => navigate('/register')}>Register</button>
//                     <button type="button" onClick={() => navigate('/login')}>Login</button>
//                 </div>
//             </Section>

//             <footer>
//                 <p>Images courtesy of <a href="http://unsplash.com/">unsplash</a>.</p>
//                 <p>Footer content.</p>
//                 <ul>
//                     <li><a href="#"><FontAwesomeIcon icon={faTwitterSquare} /></a></li>
//                     <li><a href="#"><FontAwesomeIcon icon={faFacebookSquare} /></a></li>
//                     <li><a href="#"><FontAwesomeIcon icon={faSnapchatSquare} /></a></li>
//                 </ul>
//             </footer>
//         </div>
//     );
// };

// export default LandingPage;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitterSquare, faFacebookSquare, faSnapchatSquare } from '@fortawesome/free-brands-svg-icons';
import { TfiNewWindow } from "react-icons/tfi";
import { GiSofa } from "react-icons/gi";
import { GoStopwatch } from "react-icons/go";
import './css/LandingPage.css';
import logo from './image/logo.png';

const Hero = () => (
    <section className="hero">
        <img src={logo} alt="Logo" />
    </section>
);

const Section = ({ title, children, className }) => (
    <section className={className}>
        <h3 className="title">{title}</h3>
        <hr />
        {children}
    </section>
);

const Dropdown = ({ options, onSelect }) => (
    <div className="dropdown">
        {options.map((option, index) => (
            <button  key={index} onClick={() => onSelect(option.path)}>
                {option.label}
            </button >
        ))}
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();
    const [showCustomerOptions, setShowCustomerOptions] = useState(false);
    const [showProfessionalOptions, setShowProfessionalOptions] = useState(false);

    const customerOptions = [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/registerCustomer' }
    ];

    const professionalOptions = [
        { label: 'Login', path: '/login' },
        { label: 'Register', path: '/registerCustomer' }
    ];

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <div className='LandingPage'>
            <header>
                <div className="button-container">
                    <button type="button" onClick={() => setShowCustomerOptions(!showCustomerOptions)}>Customer</button>
                    {showCustomerOptions && <Dropdown options={customerOptions} onSelect={handleNavigate} />}
                    <button type="button" onClick={() => setShowProfessionalOptions(!showProfessionalOptions)}>Professional</button>
                    {showProfessionalOptions && <Dropdown options={professionalOptions} onSelect={handleNavigate} />}
                </div>
            </header>
            <div className="main-content">
                <Hero />
                <Section title="About us" className="white-section">
                    <p>
                        You can achieve queues in one click
                        Do you have an independent business? Are you tired of your customers calling again and again to make an appointment or change the date and maybe even move it by just a few hours and you no longer have the strength to write and delete in the diary every time???
                        If you identified with what was written or even with a part, then your place is with us!!
                        We at "queueInClick" will help you operate your queue system in the best and most efficient way - for you and your customers who will of course be satisfied!
                    </p>
                    <ul className="grid destinations">
                        <li className="small image-1"></li>
                        <li className="large image-2"></li>
                        <li className="large image-3"></li>
                        <li className="small image-4"></li>
                    </ul>
                </Section>
                <Section title="Our advantages" className="colored-section">
                    <ul className="grid packages">
                        <li>
                            <TfiNewWindow size="80px" />
                            <h4>Innovation</h4>
                            <p>Conduct in an innovative and practical way.</p>
                        </li>
                        <li>
                            <GiSofa size="80px" />
                            <h4>Comfort</h4>
                            <p>The ability to make appointments from home independently easily and conveniently.</p>
                        </li>
                        <li>
                            <GoStopwatch size="80px" />
                            <h4>Efficiency</h4>
                            <p>The system enables the utilization of time and saves the time of waiting for the secretary on the phone to make an appointment or cancel it.</p>
                        </li>
                    </ul>
                </Section>
                <Section title="Let's visit" className="white-section">
                    <div className="buttons-container">
                        <button type="button" onClick={() => navigate('/register')}>Register</button>
                        <button type="button" onClick={() => navigate('/login')}>Login</button>
                    </div>
                </Section>
            </div>
            <footer>
                <p>Images courtesy of <a href="http://unsplash.com/">unsplash</a>.</p>
                <p>Footer content.</p>
                <ul>
                    <li><a href="#"><FontAwesomeIcon icon={faTwitterSquare} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faFacebookSquare} /></a></li>
                    <li><a href="#"><FontAwesomeIcon icon={faSnapchatSquare} /></a></li>
                </ul>
            </footer>
        </div>
    );
};

export default LandingPage;

