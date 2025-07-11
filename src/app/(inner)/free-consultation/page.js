"use client"
import BackToTop from "@/components/common/BackToTop";
import FooterOne from "@/components/footer/FooterOne";
import HeaderTwo from "@/components/header/HeaderTwo";
import Testimonials from "@/components/testimonials/Testimonials";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderOne from "@/components/header/HeaderOne";
export default function Home() {
    useEffect(() => {
        AOS.init({
            disableMutationObserver: true,
            once: true,
        });
    }, []);
    return (
        <div className='#'>
            <HeaderOne />

            <>
                <div className="rts-career-banner-area rts-section-gap">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="career-banner-wrapper">
                                    <h1 className="title" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="100">
                                    Unlock Your Next Career Opportunity
                                    </h1>
                                    <p className="disc" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                                    Explore a wide range of job openings from top employers. Whether you&apos;re starting out, advancing your career, or making a change, Justjobs Info connects you to roles that match your skills and ambitions. Browse our latest listings and take the next step toward your professional goals.
                                    </p>
                                    <a href="/job-listing" className="rts-btn btn-primary btn-bold" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="300">
                                        Current Openings
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6 pl--30 pl_md--15 pl_sm--10 mt_md--30 mt_sm--30">
                                <div
                                    className="thumbnail-top thumbnail-consultancy" data-aos="zoom-out" data-aos-duration="1000" data-aos-delay="100"
                                >
                                    <img
                                        className="jarallax-img"
                                        src="assets/images/consultancy/02.webp"
                                        alt="career"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="consultancy-bottom rts-section-gapBottom career-two-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-6 pr--40 pr_md--15 pr_sm--10">
                                <div className="thumbnail-consultancy" data-aos="zoom-out" data-aos-duration="1000" data-aos-delay="100">
                                    <img
                                        className="jarallax-img"
                                        src="assets/images/consultancy/01.webp"
                                        alt="consultancy"
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 pt_md--50 mt_sm--30">
                                <div className="career-right-two-wrapper">
                                    <h2 className="title">
                                    Our Career Support &amp; <br /> Job Search Services
                                    </h2>
                                    <p>
                                    We provide personalized career support and resources to help you succeed at every stage of your job search. Whether you&apos;re building your resume, exploring new opportunities, or preparing for interviews, Justjobs Info is here to guide you.
                                    </p>
                                    <div className="check-wrapper-main">
                                        <div className="single-wrapper">
                                            <div className="check-wrapper">
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Resume Building & Optimization</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Personalized Career Consultations</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Curated Job Listings</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Interview Preparation & Tips</p>
                                                </div>
                                                <div className="single-check">
                                                    <img src="assets/images/service/01.svg" alt="service" />
                                                    <p>Career Growth Resources
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rts-solution-area rts-section-gapBottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="title-center-style-two">
                                    <h2 className="title" style={{ fontSize: '3.5rem', fontWeight: '700' }}>Step by Step to Career Success</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container-consulting mt--80 mt_sm--30">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="career-pyramid-wrapper" style={{ 
                                    padding: '60px 0',
                                    position: 'relative',
                                    maxWidth: '1000px',
                                    margin: '0 auto'
                                }}>
                                    {/* Step 1 - Top of pyramid */}
                                    <div className="pyramid-step step-1" style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '40px',
                                        animation: 'fadeInUp 0.8s ease-out 0.2s both',
                                        minHeight: '80px'
                                    }}>
                                        <div style={{
                                            flex: '0 0 50%',
                                            textAlign: 'center',
                                            paddingLeft: '200px',
                                            paddingTop: '10px'
                                        }}>
                                            <h4 className="pyramid-title" style={{
                                                fontSize: '2.2rem',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                margin: '0',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                lineHeight: '1.6'
                                            }}>Discovery</h4>
                                        </div>
                                        <div style={{
                                            flex: '0 0 50%',
                                            paddingLeft: '40px',
                                            paddingTop: '10px',
                                            borderLeft: '1px solid #e0e0e0'
                                        }}>
                                            <p style={{
                                                fontSize: '1.1rem',
                                                color: '#666',
                                                margin: '0',
                                                lineHeight: '1.6'
                                            }}>
                                                Understanding your career goals and unique strengths.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 2 - Second level */}
                                    <div className="pyramid-step step-2" style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '40px',
                                        animation: 'fadeInUp 0.8s ease-out 0.4s both',
                                        minHeight: '80px'
                                    }}>
                                        <div style={{
                                            flex: '0 0 50%',
                                            textAlign: 'center',
                                            paddingLeft: '150px',
                                            paddingTop: '10px'
                                        }}>
                                            <h4 className="pyramid-title" style={{
                                                fontSize: '2.5rem',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                margin: '0',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                lineHeight: '1.6'
                                            }}>Assessment</h4>
                                        </div>
                                        <div style={{
                                            flex: '0 0 50%',
                                            paddingLeft: '40px',
                                            paddingTop: '10px',
                                            borderLeft: '1px solid #e0e0e0'
                                        }}>
                                            <p style={{
                                                fontSize: '1.1rem',
                                                color: '#666',
                                                margin: '0',
                                                lineHeight: '1.6'
                                            }}>
                                                Reviewing your resume and identifying areas for improvement.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3 - Third level */}
                                    <div className="pyramid-step step-3" style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        marginBottom: '40px',
                                        animation: 'fadeInUp 0.8s ease-out 0.6s both',
                                        minHeight: '80px'
                                    }}>
                                        <div style={{
                                            flex: '0 0 50%',
                                            textAlign: 'center',
                                            paddingLeft: '80px',
                                            paddingTop: '10px'
                                        }}>
                                            <h4 className="pyramid-title" style={{
                                                fontSize: '2.8rem',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                margin: '0',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                lineHeight: '1.6'
                                            }}>Personalised Strategy</h4>
                                        </div>
                                        <div style={{
                                            flex: '0 0 50%',
                                            paddingLeft: '40px',
                                            paddingTop: '10px',
                                            borderLeft: '1px solid #e0e0e0'
                                        }}>
                                            <p style={{
                                                fontSize: '1.1rem',
                                                color: '#666',
                                                margin: '0',
                                                lineHeight: '1.6'
                                            }}>
                                                Creating a tailored plan for your job search and professional growth.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 4 - Base of pyramid */}
                                    <div className="pyramid-step step-4" style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        animation: 'fadeInUp 0.8s ease-out 0.8s both',
                                        minHeight: '80px'
                                    }}>
                                        <div style={{
                                            flex: '0 0 50%',
                                            textAlign: 'center',
                                            paddingLeft: '20px',
                                            paddingTop: '10px'
                                        }}>
                                            <h4 className="pyramid-title" style={{
                                                fontSize: '3.1rem',
                                                fontWeight: '700',
                                                color: '#1a1a1a',
                                                margin: '0',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                lineHeight: '1.6'
                                            }}>Action & Support</h4>
                                        </div>
                                        <div style={{
                                            flex: '0 0 50%',
                                            paddingLeft: '40px',
                                            paddingTop: '10px',
                                            borderLeft: '1px solid #e0e0e0'
                                        }}>
                                            <p style={{
                                                fontSize: '1.1rem',
                                                color: '#666',
                                                margin: '0',
                                                lineHeight: '1.6'
                                            }}>
                                                Guiding you through resume building, job applications, and interview preparation.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <style jsx>{`
                                    @keyframes fadeInUp {
                                        from {
                                            opacity: 0;
                                            transform: translateY(30px);
                                        }
                                        to {
                                            opacity: 1;
                                            transform: translateY(0);
                                        }
                                    }

                                    @media (max-width: 768px) {
                                        .pyramid-step {
                                            flex-direction: column !important;
                                            text-align: center !important;
                                            margin-bottom: 30px !important;
                                        }
                                        
                                        .pyramid-step > div {
                                            flex: none !important;
                                            padding: 10px !important;
                                            border: none !important;
                                            width: 100% !important;
                                        }
                                        
                                        .pyramid-title {
                                            font-size: 1.8rem !important;
                                            margin-bottom: 15px !important;
                                        }
                                        
                                        .step-2 .pyramid-title {
                                            font-size: 2rem !important;
                                        }
                                        
                                        .step-3 .pyramid-title {
                                            font-size: 2.2rem !important;
                                        }
                                        
                                        .step-4 .pyramid-title {
                                            font-size: 2.4rem !important;
                                        }
                                    }

                                    @media (max-width: 480px) {
                                        .pyramid-title {
                                            font-size: 1.5rem !important;
                                        }
                                        
                                        .step-2 .pyramid-title {
                                            font-size: 1.7rem !important;
                                        }
                                        
                                        .step-3 .pyramid-title {
                                            font-size: 1.9rem !important;
                                        }
                                        
                                        .step-4 .pyramid-title {
                                            font-size: 2.1rem !important;
                                        }
                                    }
                                `}</style>
                            </div>
                        </div>
                    </div>
                </div>
            </>





            <Testimonials />
            <div>
                <>
                    {/* shedule a  consultation start */}
                    <div className="shedule-a-consultation rts-section-gapTop">
                        <div className="container">
                            <div className="row align-items-center">
                                <div className="col-lg-5">
                                    <div className="shedule-consulting-left">
                                        <h2 className="title">
                                        Let&apos;s Advance Your <br /> Career Together
                                        </h2>
                                        <p className="disc">
                                        We&apos;re here to support your career journey with expert guidance, resume help, and job connections. Reach out to Justjobs Info for career support or even partnership opportunities
                                        </p>
                                        <div className="check-wrapper">
                                            <p className="top">What&apos;s Included</p>
                                            <div className="single-wrapper">
                                                <div className="check-wrapper">
                                                    <div className="single-check">
                                                        <img src="assets/images/service/01.svg" alt="service" />
                                                        <p> Understanding your career needs
                                                        .</p>
                                                    </div>
                                                    <div className="single-check">
                                                        <img src="assets/images/service/01.svg" alt="service" />
                                                        <p>Insights and actionable recommendations
                                                        .</p>
                                                    </div>
                                                    <div className="single-check">
                                                        <img src="assets/images/service/01.svg" alt="service" />
                                                        <p>No obligation.</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* 
                                            <p className="call">
                                                Call us at: <a href="#">+1 (555) 123-4567</a>
                                            </p>
                                            */}
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 offset-lg-1 mt_sm--30">
                                    <form action="#" className="consulting-form">
                                        <p>Looking forward to hearing from you. Drop us a note!</p>
                                        <div className="input-half-wrapper">
                                            <div className="single">
                                                <input type="text" placeholder="First name" required="" />
                                            </div>
                                            <div className="single">
                                                <input type="text" placeholder="Last name" required="" />
                                            </div>
                                        </div>
                                        <div className="input-half-wrapper">
                                            <div className="single">
                                                <input type="text" placeholder="Company email" required="" />
                                            </div>
                                            <div className="single">
                                                <input type="text" placeholder="Phone Number" />
                                            </div>
                                        </div>
                                        <input type="text" placeholder="How can we Help You?" />
                                        <textarea
                                            name=""
                                            id=""
                                            placeholder="Write a Message "
                                            required=""
                                            defaultValue={""}
                                        />
                                        <button className="rts-btn btn-primary">Submit</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* shedule a  consultation end */}
                </>


            </div>
            <FooterOne />
            <BackToTop />
        </div>
    );
}
