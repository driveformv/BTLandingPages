import React, { Component } from 'react';
import './RecruitmentStyles.css';
import RecruitmentNavbar from "./RecruitmentNavbar";
import HeroSection from "./HeroSection";
import RetreadTechnicianRole from "./RetreadTechnicianRole";
import CompanyOverview from "./CompanyOverview";
import JobListings from "./JobListings";
import EmployeeBenefits from "./EmployeeBenefits";
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

                {/* Retread Technician Role */}
                <RetreadTechnicianRole />

                {/* Company Overview */}
                <CompanyOverview />

                {/* Employee Benefits */}
                <EmployeeBenefits />

                {/* Call to Action */}
                <CallToAction />

                {/* Job Listings */}
                <JobListings />

                {/* Recruitment Footer */}
                <RecruitmentFooter />
            </React.Fragment>
        );
    }
}

export default RecruitmentLanding;
