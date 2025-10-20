# No-Code DataTable Configuration Guide

Welcome! This guide will help you create and configure your own data table **without writing any code**.

## What You'll Need

1. A web browser (Chrome, Firefox, Safari, or Edge)
2. An API endpoint that returns JSON data (we'll provide examples!)
3. 5-10 minutes of your time

## Getting Started

### Step 1: Start the Application

```bash
npm install
npm run dev
```

The application will open at `http://localhost:3000`

### Step 2: Navigate to Configuration

Click on **"Configuration"** in the top menu. You'll see a "New" badge if you haven't configured a table yet.

## Configuration Process (4 Easy Steps)

### Step 1: API Setup

**What you need:**
- The full URL of your API endpoint
- (Optional) Authentication token if your API requires it

**Example API Endpoints:**
- JSONPlaceholder Users: `https://jsonplaceholder.typicode.com/users`
- JSONPlaceholder Posts: `https://jsonplaceholder.typicode.com/posts`
- JSONPlaceholder Photos: `https://jsonplaceholder.typicode.com/photos`

**How to fill it out:**
1. **API Endpoint URL**: Paste your complete API URL
   - Must start with `http://` or `https://`
   - Example: `https://jsonplaceholder.typicode.com/users`

2. **Authentication Token** (Optional): Leave empty if not needed
   - Only fill this if your API requires authentication
   - Can include "Bearer" prefix or not

3. **Load Example Button**: Click this to auto-fill with a working example!

**Validation:**
- ✅ Green checkmark = URL is valid
- ❌ Red error = URL needs fixing (we'll suggest corrections!)
- ⚠️ Yellow warning = URL works but consider using HTTPS

---

### Step 2: Configure Table Columns

This is where you define what data to show in your table.

**For Each Column:**

1. **Column Display Name** (Required)
   - What users will see in the table header
   - Example: "Name", "Email Address", "Created Date"
   - Can include spaces and special characters

2. **Data Field Name** (Required)
   - The exact property name from your API response
   - Must match exactly (case-sensitive!)
   - Example: if API returns `{"name": "John"}`, use `name`

3. **Column Width** (Optional)
   - Set a specific width in pixels
   - Leave empty for automatic sizing
   - Example: `150` for 150 pixels wide

4. **Enable Sorting** (Checkbox)
   - Check this to let users sort by this column
   - Recommended for: names, dates, numbers

5. **Enable Click Action** (Checkbox)
   - Check this to make cells clickable
   - When clicked, data will be logged to console
   - Great for debugging and seeing full data

**Adding/Removing Columns:**
- Click **"+ Add Column"** to add a new column
- Click the **"Remove"** button (trash icon) to delete a column
- Configure as many columns as you need!

**💡 Pro Tip:** Use Step 4 (Preview & Test) to see available fields from your API!


---

### Step 3: Pagination Settings

Configure how many items to display per page.

**Options:**
- **Items per Page**: Choose 10, 20, 50, or 100
  - Recommended: 20 for most cases
  - Use smaller numbers (10) for large data rows
  - Use larger numbers (50-100) for simple data

- **Show Pagination Controls**: Keep this checked
  - Uncheck to show all items on one page (not recommended for large datasets)

---

### Step 4: Preview & Test

**Test Your API Connection:**
1. Click **"Test API Connection"** button
2. Wait for the test to complete
3. View the results:
   - ✅ Success = Your API is working!
   - ❌ Error = Check your URL and try again

**View Available Fields:**
- Expand **"Available Fields"** to see all data fields from your API
- Green "Recommended for column" tags show fields that work well as columns
- Copy field names exactly to use in Step 2

**Auto-Configure Columns:**
1. After successful test, click **"Apply Suggested Columns"**
2. This will automatically configure columns based on your API data
3. You can then edit, add, or remove columns as needed

---

## Saving and Viewing Your Table

### Save Configuration

1. Review all 4 steps
2. Fix any errors (shown in red)
3. Click **"Save Configuration & View Table"**
4. You'll be redirected to your configured table!

### View Your Table

After saving, you'll see:
- Your data loaded from the API
- All configured columns
- Pagination controls
- Clickable cells (if enabled)

**Actions Available:**
- **Refresh**: Reload data from API
- **Edit Configuration**: Go back to change settings
- **Clicks Counter**: Track how many cells/rows you've clicked

---

## Understanding Clickable Cells

If you enabled "click action" for any columns:

1. **Clickable cells** appear as blue underlined text
2. **Click a cell** to log its data to the browser console
3. **Click any row** to log the entire row data
4. **Open Console** to see logged data:
   - Windows/Linux: Press `F12` or `Ctrl+Shift+J`
   - Mac: Press `Cmd+Option+J`

---

## Common Questions

### Q: Where does my configuration get saved?
**A:** In your browser's local storage. It persists between sessions but is specific to your browser.

### Q: Can I configure multiple tables?
**A:** Currently, one configuration at a time. You can change it anytime in the Configuration page.

### Q: My API requires authentication, what do I do?
**A:** Enter your Bearer token in the "Authentication Token" field in Step 1.

### Q: What if I don't have an API?
**A:** Click "Load Example" in Step 1 to use our demo API (JSONPlaceholder users).

### Q: The "My DataTable" menu is disabled, why?
**A:** You need to complete and save a configuration first. The menu will enable automatically.

### Q: Can I export my data?
**A:** This feature is not yet available, but you can click rows/cells to log data to console and copy from there.

### Q: My data isn't loading, what should I do?
**A:**
1. Check if your API URL is correct
2. Test the connection in Step 4
3. Check if CORS is enabled on your API
4. Try the example API to verify the app works

---

## Example Configuration Walkthrough

Let's configure a table for user data step by step:

### 1. API Setup
```
API Endpoint: https://jsonplaceholder.typicode.com/users
Auth Token: (leave empty)
```

### 2. Columns Configuration

**Column 1:**
- Display Name: `ID`
- Data Field: `id`
- Width: `80`
- Sortable: ✅ Checked
- Clickable: ⬜ Unchecked

**Column 2:**
- Display Name: `Full Name`
- Data Field: `name`
- Width: (empty - auto)
- Sortable: ✅ Checked
- Clickable: ✅ Checked

**Column 3:**
- Display Name: `Email Address`
- Data Field: `email`
- Width: (empty - auto)
- Sortable: ✅ Checked
- Clickable: ✅ Checked

**Column 4:**
- Display Name: `Phone Number`
- Data Field: `phone`
- Width: (empty - auto)
- Sortable: ⬜ Unchecked
- Clickable: ⬜ Unchecked

### 3. Pagination
```
Items per Page: 20
Show Pagination: ✅ Checked
```

### 4. Test & Save
1. Click "Test API Connection"
2. Verify success message
3. Click "Save Configuration & View Table"

**Result:** A fully functional table with 4 columns showing user data!

---

## Tips for Success

### ✅ DO:
- Start with the "Load Example" to see how it works
- Use "Test Connection" before saving
- Check "Enable click action" to explore your data
- Use descriptive column display names
- Test with pagination set to 10 items first

### ❌ DON'T:
- Don't use spaces in "Data Field Name" (use exact field names from API)
- Don't forget to save after configuring
- Don't use HTTP URLs in production (prefer HTTPS)
- Don't configure too many columns at once (start with 3-5)

---

## Troubleshooting

### Issue: "Connection Failed" Error
**Solutions:**
1. Verify URL is complete and correct
2. Check if URL starts with `http://` or `https://`
3. Try the example API to test if app works
4. Check if API is publicly accessible

### Issue: No Data Shows in Table
**Solutions:**
1. Check if "Data Field Name" matches API response exactly
2. Use "Preview & Test" to see actual field names
3. Check browser console (F12) for error messages
4. Verify pagination settings allow data to display

### Issue: Sorting Doesn't Work
**Note:** Client-side sorting is not yet implemented. Sorting clicks are logged to console.

### Issue: Can't Click on Cells
**Solutions:**
1. Make sure "Enable click action" is checked for that column
2. Clickable cells appear as blue underlined text
3. Try refreshing the page

---

## Next Steps

After successfully configuring your first table:

1. **Try Different APIs**
   - Posts: `https://jsonplaceholder.typicode.com/posts`
   - Comments: `https://jsonplaceholder.typicode.com/comments`
   - Albums: `https://jsonplaceholder.typicode.com/albums`

2. **Explore the Example Page**
   - Click "Example" in the navigation
   - See a pre-configured table with clickable cells
   - Learn by clicking around and viewing console logs

3. **Customize Your Table**
   - Edit your configuration anytime
   - Try different column combinations
   - Experiment with pagination sizes

---

## Need Help?

- Check the browser console (F12) for detailed error messages
- Try the "Load Example" configuration to verify setup
- Review the "Example" page for a working demonstration
- Ensure your API returns valid JSON data

---

## Summary Checklist

Before saving your configuration, verify:

- [ ] API URL is valid and accessible
- [ ] At least one column is configured
- [ ] Column "Display Names" are filled in
- [ ] Column "Data Field Names" match API response
- [ ] Pagination size is reasonable (10-50 recommended)
- [ ] Tested connection successfully
- [ ] Reviewed preview/suggested columns

**You're ready to save and view your table!** 🎉

