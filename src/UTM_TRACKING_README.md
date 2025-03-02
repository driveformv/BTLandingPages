# UTM Tracking Implementation Guide

This document explains how UTM parameter tracking has been implemented in the recruitment landing page application and how to use it effectively for tracking applicant sources.

## What Are UTM Parameters?

UTM (Urchin Tracking Module) parameters are tags added to URLs that help track the effectiveness of online marketing campaigns across traffic sources and publishing media. They are especially useful for identifying which marketing efforts are driving the most traffic and conversions.

The standard UTM parameters are:

| Parameter | Description | Example |
|-----------|-------------|---------|
| utm_source | Identifies which site sent the traffic | facebook, google, newsletter |
| utm_medium | Identifies what type of link was used | cpc, social, email, banner |
| utm_campaign | Identifies a specific product promotion or strategic campaign | spring_sale, job_fair_2025 |
| utm_term | Identifies search terms (optional) | hiring+jobs, tire+technician |
| utm_content | Identifies what specifically was clicked (optional) | logo_link, apply_now_button |

## How UTM Tracking Works in This Application

The UTM tracking implementation in this application follows these steps:

1. **Parameter Capture**: When a user visits the recruitment landing page with UTM parameters in the URL, the application captures these parameters.

2. **Local Storage**: The captured UTM parameters are stored in the browser's localStorage, ensuring they persist even if the user navigates to different pages within the site.

3. **Form Submission**: When a user submits a job application, the stored UTM parameters are automatically attached to the submission data sent to Firestore.

4. **Data Analysis**: You can then analyze the application data in Firestore to see which marketing channels are driving the most qualified applicants.

## Implementation Details

The UTM tracking functionality is implemented in the `ApplicationForm.js` component:

- The `captureUtmParams` method extracts UTM parameters from the URL and stores them in localStorage
- The `handleSubmit` method retrieves the stored UTM parameters and includes them in the form submission data
- In development mode, a debug section displays the captured UTM parameters for testing purposes

## How to Use UTM Parameters

### Creating UTM-Tagged URLs

To track different marketing campaigns, you need to create URLs with appropriate UTM parameters. Here's how to structure them:

```
https://yourdomain.com/?utm_source=facebook&utm_medium=social&utm_campaign=job_fair&utm_content=apply_now_button
```

### Example Use Cases

1. **Social Media Campaigns**:
   ```
   https://yourdomain.com/?utm_source=facebook&utm_medium=social&utm_campaign=job_fair_2025
   https://yourdomain.com/?utm_source=linkedin&utm_medium=social&utm_campaign=tire_technicians
   ```

2. **Email Marketing**:
   ```
   https://yourdomain.com/?utm_source=newsletter&utm_medium=email&utm_campaign=monthly_update&utm_content=job_listing
   ```

3. **Paid Search Advertising**:
   ```
   https://yourdomain.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand_keywords&utm_term=tire+technician+jobs
   ```

4. **Job Boards**:
   ```
   https://yourdomain.com/?utm_source=indeed&utm_medium=job_board&utm_campaign=evergreen
   ```

5. **Print Materials** (using QR codes):
   ```
   https://yourdomain.com/?utm_source=flyer&utm_medium=print&utm_campaign=local_event
   ```

## Testing UTM Parameter Tracking

A test page has been created to help you test the UTM parameter tracking functionality:

1. Open `/utm-test.html` in your browser
2. Use the form to generate test URLs with different UTM parameters
3. Click on the generated links to visit the recruitment landing page with those parameters
4. Submit a test application form
5. Check the Firestore database to verify that the UTM parameters were correctly attached to the submission

## Best Practices for UTM Parameter Naming

For consistent tracking and easier analysis, follow these naming conventions:

1. **Use lowercase**: All parameter values should be lowercase (e.g., `facebook` not `Facebook`)
2. **Use underscores instead of spaces**: For multi-word values, use underscores (e.g., `spring_sale` not `spring sale`)
3. **Be consistent**: Use the same naming conventions across all campaigns
4. **Be descriptive but concise**: Make names descriptive enough to understand but not unnecessarily long

## Analyzing UTM Data in Firestore

The UTM parameters are stored in each job application document in Firestore. You can:

1. Query applications by specific UTM parameters to analyze conversion rates
2. Create reports showing which sources are generating the most applications
3. Analyze which campaigns are bringing in the most qualified candidates

## Future Enhancements

Potential enhancements to the UTM tracking system could include:

1. Creating a dashboard to visualize application sources
2. Implementing A/B testing for different landing page variants
3. Adding conversion tracking to measure application completion rates
4. Integrating with Google Analytics for more comprehensive tracking

## Troubleshooting

If UTM parameters are not being captured correctly:

1. Verify the URL format is correct (parameters should start with `?` and be separated by `&`)
2. Check that localStorage is enabled in the user's browser
3. In development mode, use the debug section to see what parameters are being captured
4. Check the browser console for any JavaScript errors
