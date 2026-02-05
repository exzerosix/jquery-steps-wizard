# jQuery Steps Wizard - Steps Wizard Form Plugin

A flexible and feature-rich jQuery plugin for creating step-by-step wizard forms with validation, clickable navigation, and dynamic step control.

## Features

✨ **Core Features**
- 📝 Multi-step form wizard with elegant navigation
- 🖱️ Clickable tab navigation between steps
- ✅ Built-in validation support (jQuery Validation plugin)
- 🔄 Async callback support for all navigation actions
- 📱 Responsive and customizable design
- 🎯 Dynamic step skipping/unskipping
- 🚀 Easy to integrate and configure

🎨 **Navigation Features**
- Previous/Next button navigation
- Automatic submit button on final step
- Custom back/next/finish button labels
- Tab-based step navigation
- Visual indicators for current and disabled steps

🔧 **Advanced Features**
- Skip specific steps dynamically
- Reverse/unskip steps on demand
- Add or remove steps programmatically
- Custom callbacks for each navigation action
- Validation before step transitions
- Legend and description display options

## Installation

### Download
Download the `jquery.stepy.js` file and include it in your project.

### CDN
```html
<!-- jQuery (required) -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- jQuery Validation (optional, for validation feature) -->
<script src="https://cdn.jsdelivr.net/npm/jquery-validation@1.19.5/dist/jquery.validate.min.js"></script>

<!-- Stepy Plugin -->
<script src="path/to/jquery.stepy.js"></script>
```

## Basic Usage

### HTML Structure
```html
<form id="myForm">
    <fieldset title="Personal Information">
        <legend>Step 1: Personal Info</legend>
        <label>Name: <input type="text" name="name" required /></label>
        <label>Email: <input type="email" name="email" required /></label>
    </fieldset>
    
    <fieldset title="Address">
        <legend>Step 2: Address</legend>
        <label>Street: <input type="text" name="street" /></label>
        <label>City: <input type="text" name="city" /></label>
    </fieldset>
    
    <fieldset title="Confirmation">
        <legend>Step 3: Confirm</legend>
        <p>Please review your information</p>
    </fieldset>
    
    <button type="submit" class="finish">Submit</button>
</form>
```

### JavaScript Initialization
```javascript
$('#myForm').stepy({
    backLabel: '← Previous',
    nextLabel: 'Next →',
    validate: true
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `backLabel` | String | `"&lt; Back"` | Label for back button |
| `nextLabel` | String | `"Next &gt;"` | Label for next button |
| `finishLabel` | String | `"Submit"` | Label for submit button (if created) |
| `validate` | Boolean | `false` | Enable jQuery validation |
| `legend` | Boolean | `true` | Show/hide legend elements |
| `description` | Boolean | `true` | Show/hide step descriptions |
| `titleTarget` | String | `undefined` | Custom selector for titles container |
| `skipSteps` | Array | `[]` | Array of step numbers to skip initially |
| `ignore` | String | `""` | Selector for fields to ignore in validation |
| `back` | Function | `undefined` | Callback when back button is clicked |
| `next` | Function | `undefined` | Callback when next button is clicked |
| `finish` | Function | `undefined` | Callback when finish button is clicked |
| `select` | Function | `undefined` | Callback when a step is selected |

## Methods

### Navigation Methods

#### `step(index)`
Navigate to a specific step (1-based index).
```javascript
$('#myForm').stepy('step', 3); // Go to step 3
```

### Step Control Methods

#### `skipStep(step)`
Skip a specific step.
```javascript
$('#myForm').stepy('skipStep', 5); // Skip step 5
```

#### `unskipStep(step)`
Unskip/enable a previously skipped step.
```javascript
$('#myForm').stepy('unskipStep', 5); // Enable step 5
```

#### `setSkipSteps(steps)`
Set multiple steps to skip at once.
```javascript
$('#myForm').stepy('setSkipSteps', [3, 5, 7]); // Skip steps 3, 5, and 7
```

#### `clearSkipSteps()`
Clear all skipped steps.
```javascript
$('#myForm').stepy('clearSkipSteps'); // Enable all steps
```

#### `getSkippedSteps()`
Get array of currently skipped steps.
```javascript
var skipped = $('#myForm').stepy('getSkippedSteps');
console.log(skipped); // [3, 5, 7]
```

### Step Management Methods

#### `addStep(html, [index])`
Add a new step to the form.
```javascript
var newStep = '<fieldset title="New Step"><legend>New</legend><input type="text" /></fieldset>';
$('#myForm').stepy('addStep', newStep, 2); // Insert at position 2
```

#### `removeStep(index)`
Remove a step from the form.
```javascript
$('#myForm').stepy('removeStep', 3); // Remove step 3
```

## Examples

### Example 1: Basic Form with Validation
```javascript
$('#registrationForm').stepy({
    backLabel: '← Previous',
    nextLabel: 'Continue →',
    validate: true,
    finish: function(index) {
        alert('Form submitted!');
        this.submit();
    }
});
```

### Example 2: Conditional Step Skipping
```javascript
$('#surveyForm').stepy({
    next: async function(index) {
        // Skip step 3 if user selects "No" on step 2
        if (index === 3) {
            var answer = $('input[name="hasExperience"]:checked').val();
            if (answer === 'no') {
                $(this).stepy('skipStep', 3);
                return 4; // Jump to step 4
            } else {
                $(this).stepy('unskipStep', 3);
            }
        }
        return index;
    }
});
```

### Example 3: Dynamic Step Control
```javascript
$('#wizardForm').stepy({
    validate: true
});

// Enable/disable steps based on checkbox
$('#enableAdvanced').change(function() {
    if ($(this).is(':checked')) {
        $('#wizardForm').stepy('unskipStep', 4);
    } else {
        $('#wizardForm').stepy('skipStep', 4);
    }
});
```

### Example 4: Async Validation
```javascript
$('#orderForm').stepy({
    next: async function(index) {
        if (index === 2) {
            // Async API call to validate data
            const isValid = await validateWithServer();
            if (!isValid) {
                alert('Please fix the errors');
                return false; // Prevent navigation
            }
        }
        return index;
    },
    finish: async function(index) {
        const result = await submitOrder();
        if (result.success) {
            window.location.href = '/thank-you';
        }
    }
});

async function validateWithServer() {
    const response = await fetch('/api/validate', {
        method: 'POST',
        body: JSON.stringify({ /* data */ })
    });
    return response.ok;
}
```

### Example 5: Custom Callbacks
```javascript
$('#myForm').stepy({
    select: function(index) {
        console.log('Now on step:', index);
    },
    back: function(index) {
        console.log('Going back from step:', index);
        // Return false to prevent navigation
        // Return number to go to specific step
        return index; // Continue normal back behavior
    },
    next: async function(index) {
        console.log('Moving to step:', index);
        
        // Save progress
        await saveProgress(index);
        
        return index; // Continue to next step
    }
});
```

## Styling

### Basic CSS
```css
/* Tab navigation */
.stepy-titles {
    list-style: none;
    display: flex;
    gap: 10px;
    padding: 0;
    margin-bottom: 20px;
}

.stepy-titles li {
    flex: 1;
    padding: 10px;
    background: #f0f0f0;
    text-align: center;
    border-radius: 5px;
    transition: all 0.3s;
}

.stepy-titles li:hover {
    background: #e0e0e0;
}

.stepy-titles li.current-step {
    background: #007bff;
    color: white;
    font-weight: bold;
}

.stepy-titles li.disabled-step {
    background: #ddd;
    color: #999;
}

/* Buttons */
.button-back,
.button-next,
.finish {
    padding: 10px 20px;
    margin: 10px 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

.button-back {
    background: #6c757d;
    color: white;
}

.button-next,
.finish {
    background: #007bff;
    color: white;
}

.button-back:hover,
.button-next:hover,
.finish:hover {
    opacity: 0.9;
}

/* Steps */
fieldset {
    border: 1px solid #ddd;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 5px;
}

legend {
    font-weight: bold;
    font-size: 18px;
    padding: 0 10px;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11+ (with polyfills for async/await)

## Dependencies

- jQuery 1.7+
- jQuery Validation Plugin (optional, for validation feature)

## License

MIT License - see [LICENSE](LICENSE) file for details

## Author

**Joey Sauva**

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Changelog

### Version 1.0.0 (2026-02-05)
- Initial release
- Multi-step wizard functionality
- Clickable tab navigation
- Validation support
- Dynamic step skipping
- Async callback support
- Submit button auto-show on final step

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ by Joey Sauva
