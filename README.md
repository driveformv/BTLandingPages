# Recruitment Landing Page Blueprint

## 1. Introduction  
A recruitment landing page for Border Tire’s new **Redlands, CA** retread tire plant should attract candidates and convert their interest into applications. This blueprint provides a structured plan for developers and designers to create an optimized, high-performing page.

## 2. Tech Stack Recommendation  
- **Frontend:** Next.js (React framework for SSR and static generation)  
- **Backend:** Node.js with Next.js API routes or serverless functions  
- **Styling:** Tailwind CSS or Material UI for a modern, responsive design  
- **Database:** PostgreSQL (with Prisma ORM) or Firebase/Supabase for storing applicant data  
- **File Storage:** Google Cloud Storage for resume uploads  
- **Email Service:** Resend API for automated notifications  
- **Analytics:** Google Analytics (GA4), Facebook Pixel (Meta Pixel) for tracking user interactions  

## 3. Page Structure & Layout  
### **Hero Section:**  
- Strong **headline** (e.g., "Join Our Team in Redlands!")  
- **Subheading**: Brief company intro (optional)  
- **Primary Call-To-Action (CTA):** “Apply Now” button  
- **Background Image** or graphic related to the workplace  

### **Company Overview (Optional):**  
- Brief introduction about Border Tire and the significance of the new plant  
- High-quality company or team image  

### **Job Listings Section:**  
- List of **open positions** with one-line descriptions  
- Each job has an “Apply” button (scrolls to the form with pre-selected role)  
- Dynamically populated from a JSON or CMS  

### **Call-To-Action Elements:**  
- Multiple "Apply Now" buttons placed strategically  
- Sticky CTA bar on mobile if necessary  

### **Employee Testimonial or Benefits (Optional):**  
- Quote from an existing employee  
- List of job benefits (e.g., insurance, 401k, paid time off)  

### **Application Form (Lead Capture):**  
- **Fields:**  
  - Full Name  
  - Email  
  - Phone Number  
  - Work Experience (Dropdown or short text)  
  - Preferred Role (Dropdown based on job listings)  
  - Availability (Dropdown or date picker)  
  - Resume Upload (PDF/DOC/DOCX, max 5MB)  
- **Submit Button:** “Send Application”  
- **Thank You Message:** Displayed after submission  

## 4. Resume Upload System  
- **Accepts formats:** PDF, DOC, DOCX  
- **File size limit:** 5MB  
- **Storage method:** Upload to Firebase Storage  
- **Security:** Validate file type on frontend and backend, secure access control  

### Resume Storage Implementation
- **Firebase Storage:** Resumes are uploaded to Firebase Storage in a `resumes/` directory
- **Unique Filenames:** Each resume is stored with a unique filename based on the application ID and timestamp
- **Firestore Integration:** The resume download URL is stored in the application record in Firestore
- **Email Integration:** The resume download URL is included in the notification email to recruiters

## 5. Integration with Resend (Email Notifications)  
- **Applicant Notification:** Confirmation email upon submission  
- **Recruiter Notification:** Email with applicant details and resume link  
- **Resend API Setup:** Secure API keys, send emails from no-reply@bordertire.com  

### Email Implementation Details
- **Firebase Cloud Functions:** Emails are sent using server-side Firebase Cloud Functions
- **Firestore Trigger:** When a new application is submitted to the `jobApplications` collection, a function is triggered to send emails
- **Security:** API keys are stored securely in Firebase environment configuration, not in client-side code
- **Deployment:** Use the provided `deploy-functions.sh` script to deploy the email sending functions

To deploy the email sending functionality:
```bash
# Make the script executable (if not already)
chmod +x deploy-functions.sh

# Run the deployment script
./deploy-functions.sh
```

## 6. Database & Data Storage  
- **Schema:** Table with columns for ID, name, email, phone, experience, role, availability, resume URL, submission date  
- **Security Measures:** SSL connection, encryption at rest, access control for recruiters only  

## 7. Analytics & Tracking Setup  
- **Google Analytics (GA4):** Tracks pageviews, form submissions (custom event `form_submit`)  
- **Facebook Pixel:** Fires “Lead” event on form submission  
- **Testing:** Use GA DebugView, Facebook Pixel Helper to verify event tracking  

## 8. Mobile Responsiveness & Accessibility  
- **Responsive Design:** Mobile-first approach, flexible grids, touch-friendly buttons  
- **Accessibility Best Practices:**  
  - Proper form labels (`<label>` elements)  
  - Semantic HTML with proper headings  
  - High contrast text for readability  
  - Keyboard navigable with tab order  
  - ARIA attributes for screen readers  

## 9. Brand Compliance  
- **Logo:** Official Border Tire logo in header  
- **Colors:** Follow brand guidelines for CTA buttons, highlights  
- **Typography:** Use official brand fonts  
- **Imagery:** Use only approved Border Tire images and styles  

## 10. Development Workflow  
1. **Wireframe & Design Approval:** Create wireframes in Figma/Adobe XD  
2. **Component-Based Development:** Use React components for each section  
3. **Use Ready Libraries:** Tailwind for styling, React Hook Form for validation  
4. **Testing & QA:**  
   - Validate form fields and file upload  
   - Check analytics tracking  
   - Test on multiple devices and browsers  
5. **Deployment:** Host on Vercel (Next.js optimized hosting)  
6. **Monitoring:** Set up error tracking and log applicant data securely  

By following this structured approach, the landing page will be fast, accessible, and optimized for lead conversion, while ensuring data security and brand consistency.
