// Function to include HTML files
async function includeHTML() {
    const elements = document.querySelectorAll("[include-html]");
    for (const element of elements) {
        const file = element.getAttribute("include-html");
        if (file) {
            try {
                const response = await fetch(file);
                const data = await response.text();
                element.innerHTML = data;
                element.removeAttribute("include-html");

                // Execute scripts in the included content
                const scripts = element.getElementsByTagName("script");
                for (let i = 0; i < scripts.length; i++) {
                    const oldScript = scripts[i];
                    const newScript = document.createElement("script");
                    Array.from(oldScript.attributes).forEach(attr => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.text = oldScript.text;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                }

                // After header is loaded, update account display
                if (file.includes('header.html') && typeof updateAccountDisplay === 'function') {
                    updateAccountDisplay();
                }
            } catch (error) {
                console.error('Error loading include file:', error);
            }
        }
    }
}

// Run includeHTML when the document is loaded
document.addEventListener('DOMContentLoaded', includeHTML);
