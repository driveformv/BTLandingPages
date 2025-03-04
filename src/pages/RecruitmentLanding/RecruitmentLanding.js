import React, { Component } from 'react';
import './RecruitmentStyles.css';
import RecruitmentNavbar from "./RecruitmentNavbar";
import HeroSection from "./HeroSection";
import CompanyOverview from "./CompanyOverview";
import JobListings from "./JobListings";
import EmployeeBenefits from "./EmployeeBenefits";
import ApplicationForm from "./ApplicationForm";
import RecruitmentFooter from './RecruitmentFooter';
import CallToAction from './CallToAction';

class RecruitmentLanding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navClass: "navbar-white"
        };
    }

    render() {
        return (
            <React.Fragment>
                {/* Recruitment Navbar */}
                <RecruitmentNavbar navClass={this.state.navClass} />

                {/* Hero Section */}
                <HeroSection />

                {/* Company Overview */}
                <CompanyOverview />

                {/* Job Listings */}
                <JobListings />

                {/* Employee Benefits */}
                <EmployeeBenefits />

                {/* Application Form */}
                <ApplicationForm />

                {/* Call to Action */}
                <CallToAction />

                {/* Recruitment Footer */}
                <RecruitmentFooter />
            </React.Fragment>
        );
    }
}

export default RecruitmentLanding;
