import React, { Component } from "react";

class ScrollspyNav extends Component {
  constructor(props) {
    super(props);

    this.props = props;
    this.scrollTargetIds = this.props.scrollTargetIds;
    this.activeNavClass = this.props.activeNavClass;
    this.scrollDuration = Number(this.props.scrollDuration) || 1000;
    this.headerBackground =
      this.props.headerBackground === "true" ? true : false;

    if (this.props.router && this.props.router === "HashRouter") {
      this.homeDefaultLink = "#/";
      this.hashIdentifier = "#/#";
    } else {
      this.homeDefaultLink = "/";
      this.hashIdentifier = "#";
    }
  }

  easeInOutQuad(current_time, start, change, duration) {
    current_time /= duration / 2;
    if (current_time < 1)
      return (change / 2) * current_time * current_time + start;
    current_time--;
    return (-change / 2) * (current_time * (current_time - 2) - 1) + start;
  }

  scrollTo(start, to, duration) {
    let change = to - start,
      currentTime = 0,
      increment = 10;

    let animateScroll = () => {
      currentTime += increment;
      let val = this.easeInOutQuad(currentTime, start, change, duration);
      window.scrollTo(0, val);
      if (currentTime < duration) {
        setTimeout(animateScroll, increment);
      }
    };

    animateScroll();
  }

  getNavLinkElement(sectionID) {
    return document.querySelector(
      `a[href='${this.hashIdentifier}${sectionID}']`
    );
  }

  getNavToSectionID(navHref) {
    return navHref.includes(this.hashIdentifier)
      ? navHref.replace(this.hashIdentifier, "")
      : "";
  }

  componentDidMount() {
    if (document.querySelector(`a[href='${this.homeDefaultLink}']`)) {
      document
        .querySelector(`a[href='${this.homeDefaultLink}']`)
        .addEventListener("click", (event) => {
          event.preventDefault();
          this.scrollTo(window.pageYOffset, 0, this.scrollDuration);
          window.location.hash = "";
        });
    }

    const navListElement = document.querySelector("div[data-nav='list']");
    if (navListElement) {
      navListElement.querySelectorAll("a").forEach((navLink) => {
        navLink.addEventListener("click", (event) => {
          event.preventDefault();
          let sectionID = this.getNavToSectionID(navLink.getAttribute("href"));

          if (sectionID) {
            const sectionElement = document.getElementById(sectionID);
            if (sectionElement) {
              let scrollTargetPosition =
                sectionElement.offsetTop -
                (this.headerBackground && navListElement
                  ? navListElement.scrollHeight
                  : 0);
              this.scrollTo(
                window.pageYOffset,
                scrollTargetPosition,
                this.scrollDuration
              );
            }
          } else {
            this.scrollTo(window.pageYOffset, 0, this.scrollDuration);
          }
        });
      });
    }

    window.addEventListener("scroll", () => {
      const navListElement = document.querySelector("div[data-nav='list']");
      if (!navListElement) return;

      this.scrollTargetIds.forEach((sectionID, index) => {
        const sectionElement = document.getElementById(sectionID);
        const navLinkElement = this.getNavLinkElement(sectionID);
        
        // Skip if section element or nav link doesn't exist
        if (!sectionElement || !navLinkElement) return;
        
        let scrollSectionOffsetTop =
          sectionElement.offsetTop -
          (this.headerBackground ? navListElement.scrollHeight : 0);
    
        if (
          window.pageYOffset >= scrollSectionOffsetTop &&
          window.pageYOffset <
            scrollSectionOffsetTop + sectionElement.scrollHeight
        ) {
          navLinkElement.classList.add(this.activeNavClass);
          navLinkElement.parentNode.classList.add(this.activeNavClass);
          this.clearOtherNavLinkActiveStyle(sectionID);
        } else {
          navLinkElement.classList.remove(this.activeNavClass);
          navLinkElement.parentNode.classList.remove(this.activeNavClass);
        }
    
        if (
          index === this.scrollTargetIds.length - 1 &&
          window.innerHeight + window.pageYOffset >= document.body.scrollHeight
        ) {
          navLinkElement.classList.add(this.activeNavClass);
          navLinkElement.parentNode.classList.add(this.activeNavClass);
          this.clearOtherNavLinkActiveStyle(sectionID);
        }
      });
    });
  }

  clearOtherNavLinkActiveStyle(excludeSectionID) {
    this.scrollTargetIds
      .filter(sectionID => sectionID !== excludeSectionID)
      .forEach(sectionID => {
        const navLinkElement = this.getNavLinkElement(sectionID);
        if (navLinkElement) {
          navLinkElement.classList.remove(this.activeNavClass);
          if (navLinkElement.parentNode) {
            navLinkElement.parentNode.classList.remove(this.activeNavClass);
          }
        }
      });
  }

  render() {
    return (
      <div data-nav="list" className={this.props.className}>
        {this.props.children}
      </div>
    );
  }
}

export default ScrollspyNav;
